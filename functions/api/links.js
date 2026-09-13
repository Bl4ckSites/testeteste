// ============================================
// API /api/links — Retorna a lista de links
// ============================================
export async function onRequestPost(context) {
  const { request } = context;

  try {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';
    const referer = request.headers.get('Referer') || '';
    const isXHR = request.headers.get('X-Requested-With') === 'XMLHttpRequest';
    const isSameOrigin = origin === url.origin || referer.startsWith(url.origin);

    if (!isSameOrigin && !isXHR) {
      return jsonResponse({ error: 'Acesso negado' }, 403);
    }

    // Dados dos links (mantendo a mesma estrutura do DEV_LINKS do frontend)
    const linksData = [
      { id: '1', titulo: 'Privacy 50% OFF', url: 'https://privacy.com.br/checkout/soykarolinareal', icone: 'icone-onlyfans.avif' }
      // Adicione mais links aqui conforme necessário, seguindo este formato
    ];

    return jsonResponse({ success: true, links: linksData }, 200);
  } catch (error) {
    console.error('[LINKS API ERROR]', error);
    return jsonResponse({ error: 'Erro interno do servidor' }, 500);
  }
}

function jsonResponse(data, status) {
  return new Response(JSON.stringify(data), {
    status: status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
  });
}