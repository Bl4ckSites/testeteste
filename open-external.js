// ============================================
// OPEN EXTERNAL — Escape do In-App Browser (Instagram)
// Isolado, seguro e com fallback visual
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

  // 3. Prevenir loop infinito na mesma sessão
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
    // Tenta forçar o Safari no iOS
    escapeUrl = currentUrl.replace(/^https:\/\//i, 'x-safari-https://');
  } else if (isAndroid) {
    // Tenta forçar o Chrome (ou navegador padrão) no Android
    try {
      var u = new URL(currentUrl);
      escapeUrl =
        'intent://' + u.host + u.pathname + u.search +
        '#Intent;scheme=https;' +
        'package=com.android.chrome;' +
        'S.browser_fallback_url=' + encodeURIComponent(currentUrl) +
        ';end';
    } catch (e) {
      return; // Falha ao parsear URL, aborta para segurança
    }
  }

  if (!escapeUrl) return;

  // 5. Disparar a navegação
  try {
    sessionStorage.setItem('oeb_escaped', 'true');
    window.location.href = escapeUrl;
  } catch (e) {
    // Falha silenciosa, deixa o fallback assumir
  }

  // 6. Fallback visual após 1500ms se a página ainda estiver visível
  setTimeout(function () {
    if (document.visibilityState === 'visible') {
      showFallbackBanner(isIOS ? 'Safari' : 'Navegador', escapeUrl);
    }
  }, 1500);

  function showFallbackBanner(browserName, url) {
    // Injeta CSS isolado para não conflitar com o tema existente
    var style = document.createElement('style');
    style.textContent = `
      .oeb-banner {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        width: 90%;
        max-width: 400px;
        background: rgba(21, 21, 21, 0.95);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid #2c2c2c;
        border-radius: 16px;
        padding: 16px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.6);
        z-index: 9999;
        text-align: center;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        animation: oeb-slideUp 0.4s ease-out;
      }
      @keyframes oeb-slideUp {
        from { opacity: 0; transform: translate(-50%, 20px); }
        to { opacity: 1; transform: translate(-50%, 0); }
      }
      .oeb-text {
        color: #ffffff;
        font-size: 14px;
        margin-bottom: 12px;
        line-height: 1.4;
      }
      .oeb-btn-primary {
        display: block;
        width: 100%;
        padding: 12px;
        background: #2f80d0;
        color: #ffffff;
        border: none;
        border-radius: 999px;
        font-size: 14px;
        font-weight: 700;
        cursor: pointer;
        margin-bottom: 8px;
        text-decoration: none;
      }
      .oeb-btn-primary:active { transform: scale(0.97); }
      .oeb-btn-secondary {
        display: block;
        width: 100%;
        padding: 10px;
        background: transparent;
        color: #9aa0a6;
        border: 1px solid #444;
        border-radius: 999px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        text-decoration: none;
      }
    `;
    document.head.appendChild(style);

    // Cria o elemento do banner
    var banner = document.createElement('div');
    banner.className = 'oeb-banner';
    banner.innerHTML = 
      '<div class="oeb-text">Para uma melhor experiência, abra este link no seu navegador.</div>' +
      '<button class="oeb-btn-primary" id="oeb-open">Abrir no ' + browserName + '</button>' +
      '<button class="oeb-btn-secondary" id="oeb-dismiss">Continuar aqui mesmo</button>';

    document.body.appendChild(banner);

    // Lógica dos botões
    document.getElementById('oeb-open').addEventListener('click', function () {
      try { window.location.href = url; } catch (e) {}
    });

    document.getElementById('oeb-dismiss').addEventListener('click', function () {
      banner.style.opacity = '0';
      banner.style.transform = 'translate(-50%, 20px)';
      banner.style.transition = 'all 0.3s ease';
      setTimeout(function () { banner.remove(); }, 300);
    });
  }
})();