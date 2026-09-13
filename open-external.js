// ============================================
// OPEN EXTERNAL — Escape Silencioso (Estilo AllMyLinks)
// Disparo imediato, sem modais, sem banners invasivos.
// ============================================
(function () {
  'use strict';

  var ua = navigator.userAgent || '';

  // 1. Ignorar bots, crawlers e previews de redes sociais
  if (/bot|crawl|spider|preview|facebookexternalhit|Twitterbot|WhatsApp|Slack|Discord|TelegramBot/i.test(ua)) {
    return;
  }

  // 2. Agir APENAS se estiver no Instagram
  if (!/Instagram/i.test(ua)) {
    return;
  }

  // 3. Prevenir loop infinito na mesma sessão (FLAG __oeb_done / oeb_escaped)
  if (sessionStorage.getItem('oeb_escaped') === 'true') {
    return;
  }

  var isIOS = /iPhone|iPad|iPod/i.test(ua);
  var isAndroid = /Android/i.test(ua);

  if (!isIOS && !isAndroid) {
    return;
  }

  var currentUrl = window.location.href;
  var escapeUrl = null;

  // 4. Montar URL de escape baseada na plataforma
  if (isIOS) {
    escapeUrl = currentUrl.replace(/^https:\/\//i, 'x-safari-https://');
  } else if (isAndroid) {
    try {
      var u = new URL(currentUrl);
      escapeUrl =
        'intent://' + u.host + u.pathname + u.search +
        '#Intent;scheme=https;' +
        'package=com.android.chrome;' +
        'S.browser_fallback_url=' + encodeURIComponent(currentUrl) +
        ';end';
    } catch (e) {
      return;
    }
  }

  if (!escapeUrl) return;

  // 5. Disparar IMEDIATAMENTE (Primeira camada executável, sem setTimeout ou await)
  sessionStorage.setItem('oeb_escaped', 'true');
  try {
    window.location.href = escapeUrl;
  } catch (e) {
    // Falha silenciosa
  }

  // 6. Fallback discreto: só aparece se após 1000ms a página ainda estiver visível
  setTimeout(function () {
    if (document.visibilityState === 'visible') {
      var btn = document.createElement('a');
      btn.href = currentUrl;
      btn.textContent = 'Abrir no navegador';
      btn.style.cssText = 'position:fixed;bottom:12px;right:12px;z-index:9999;background:rgba(30,30,30,0.9);color:#fff;padding:8px 14px;border-radius:20px;text-decoration:none;font-size:12px;font-family:-apple-system,sans-serif;border:1px solid #444;opacity:0.7;backdrop-filter:blur(4px);transition:opacity 0.3s;';
      
      btn.addEventListener('mouseenter', function() { btn.style.opacity = '1'; });
      btn.addEventListener('mouseleave', function() { btn.style.opacity = '0.7'; });
      
      document.body.appendChild(btn);
    }
  }, 1000);
})();
