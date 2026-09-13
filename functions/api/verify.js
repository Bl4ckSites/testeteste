// ============================================
// API /api/verify — token +18 (gera e valida)
// ============================================
export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';
    const referer = request.headers.get('Referer') || '';
    const isXHR = request.headers.get('X-Requested-With') === 'XMLHttpRequest';
    const isSameOrigin = origin === url.origin || referer.startsWith(url.origin);

    if (!isSameOrigin && !isXHR) {
      return jsonResponse({ error: 'Acesso negado' }, 403);
    }

    const authHeader = request.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return await validateExistingToken(authHeader.substring(7), env);
    }

    const token = generateSecureToken();
    const tokenData = {
      createdAt: Date.now(),
      ip: request.headers.get('CF-Connecting-IP') || 'unknown',
      ua: request.headers.get('User-Agent') || 'unknown'
    };

    if (env.AUTH_KV) {
      await env.AUTH_KV.put('token:' + token, JSON.stringify(tokenData), { expirationTtl: 86400 });
    }

    return jsonResponse({ success: true, token: token, expiresAt: tokenData.createdAt + 86400000 }, 200);
  } catch (error) {
    console.error('[VERIFY ERROR]', error);
    return jsonResponse({ error: 'Erro interno do servidor' }, 500);
  }
}

async function validateExistingToken(token, env) {
  if (!env.AUTH_KV) {
    return jsonResponse({ valid: token.length > 10 }, 200);
  }

  const stored = await env.AUTH_KV.get('token:' + token);
  if (!stored) return jsonResponse({ valid: false, error: 'Token não encontrado' }, 401);

  const data = JSON.parse(stored);
  if (Date.now() > data.createdAt + 86400000) {
    await env.AUTH_KV.delete('token:' + token);
    return jsonResponse({ valid: false, error: 'Token expirado' }, 401);
  }

  return jsonResponse({ valid: true }, 200);
}

function generateSecureToken() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  // CORREÇÃO APLICADA: 'array' adicionado como primeiro argumento
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

function jsonResponse(data, status) {
  return new Response(JSON.stringify(data), {
    status: status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store, no-cache, must-revalidate' }
  });
}