// ============================================
// API /api/human — valida Turnstile (anti-robô)
// ============================================
export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';
    const referer = request.headers.get('Referer') || '';
    const isXHR = request.headers.get('X-Requested-With') === 'XMLHttpRequest';

    if (origin !== url.origin && !referer.startsWith(url.origin) && !isXHR) {
      return jsonResponse({ error: 'Acesso negado' }, 403);
    }

    const body = await request.json();
    if (!body.turnstile) return jsonResponse({ error: 'Token ausente' }, 400);

    const ip = request.headers.get('CF-Connecting-IP') || '';

    const verify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: env.TURNSTILE_SECRET_KEY,
        response: body.turnstile,
        remoteip: ip
      })
    });
    const v = await verify.json();

    if (!v.success) return jsonResponse({ error: 'Verificação falhou' }, 403);

    return jsonResponse({ ok: true }, 200);
  } catch (e) {
    console.error('[HUMAN ERROR]', e);
    return jsonResponse({ error: 'Erro interno' }, 500);
  }
}

function jsonResponse(data, status) {
  return new Response(JSON.stringify(data), {
    status: status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
  });
}