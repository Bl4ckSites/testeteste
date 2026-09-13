export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const body = await request.json();
    if (!body.ht) return json({ error: 'Token ausente' }, 400);
    if (!env.AUTH_KV) return json({ ok: true }, 200);
    const stored = await env.AUTH_KV.get('human:' + body.ht);
    if (!stored) return json({ error: 'Token inválido ou já usado' }, 401);
    await env.AUTH_KV.delete('human:' + body.ht);
    return json({ ok: true }, 200);
  } catch (e) {
    console.error('[CONSUME ERROR]', e);
    return json({ error: 'Erro interno' }, 500);
  }
}
function json(d, s) { return new Response(JSON.stringify(d), { status: s, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } }); }