// ============================================
// API /api/event — analytics com rate limit
// ============================================
export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const url = new URL(request.url);

    const origin = request.headers.get('Origin') || '';
    const referer = request.headers.get('Referer') || '';
    const isXHR = request.headers.get('X-Requested-With') === 'XMLHttpRequest';
    const isSameOrigin = origin === url.origin || referer.startsWith(url.origin);

    if (!isSameOrigin && !isXHR) {
      return jsonResponse({ error: 'Origem inválida' }, 403);
    }

    if (env.ANALYTICS_KV) {
      const rateKey = 'rate:' + ip;
      const currentCount = parseInt(await env.ANALYTICS_KV.get(rateKey) || '0', 10);
      if (currentCount >= 100) {
        return jsonResponse({ error: 'Limite de requisições excedido' }, 429);
      }
      await env.ANALYTICS_KV.put(rateKey, String(currentCount + 1), { expirationTtl: 3600 });
    }

    let data;
    try {
      data = await request.json();
    } catch (e) {
      return jsonResponse({ error: 'JSON inválido' }, 400);
    }

    if (!data || !data.event || !data.ts) {
      return jsonResponse({ error: 'Campos obrigatórios ausentes: event, ts' }, 400);
    }

    if (env.ANALYTICS_KV) {
      const eventKey = 'ev:' + Date.now() + ':' + Math.random().toString(36).slice(2, 9);
      await env.ANALYTICS_KV.put(eventKey, JSON.stringify({
        event: data.event,
        ts: data.ts,
        page: data.page || 'unknown',
        ua: data.ua || 'unknown',
        linkId: data.linkId || null,
        ip: ip,
        receivedAt: Date.now()
      }), { expirationTtl: 2592000 });
    }

    console.log(JSON.stringify({ type: 'analytics_event', event: data.event, page: data.page, ip: ip }));
    return jsonResponse({ success: true }, 200);
  } catch (error) {
    console.error('[EVENT ERROR]', error);
    return jsonResponse({ error: 'Erro interno do servidor' }, 500);
  }
}

function jsonResponse(data, status) {
  return new Response(JSON.stringify(data), {
    status: status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
  });
}