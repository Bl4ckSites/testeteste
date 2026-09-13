// ============================================
// ERROR HANDLER GLOBAL
// ⚠️ Nome do arquivo DEVE ser exatamente _error.js
// ============================================
export async function onError(context) {
  const { error } = context;

  console.error('[UNHANDLED ERROR]', {
    message: error?.message || 'Unknown error',
    stack: error?.stack,
    timestamp: new Date().toISOString()
  });

  return new Response(
    JSON.stringify({ error: 'Erro interno do servidor', timestamp: Date.now() }),
    {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
    }
  );
}
