// ============================================
// INDEX.JS — Gateway silencioso (FINAL)
// ============================================
(function () {
  'use strict';
  var TARGET_REL = './links.html';
  var ua = navigator.userAgent || '';

  // Detecção de robô (SÓ automação real — preservando previews legítimos)
  function isBot() {
    if (navigator.webdriver === true) return true;
    // Removidos curl, wget, python-requests, httpclient para evitar falsos positivos
    return /bot|crawler|spider|headless|puppeteer|selenium|phantomjs/i.test(ua);
  }

  function init() {
    // Robô de automação → 404
    if (isBot()) {
      window.location.replace('./404.html');
      return;
    }

    // Todos os outros (incluindo Instagram, Safari, Chrome, WhatsApp preview) 
    // prosseguem normalmente para links.html
    window.location.replace(TARGET_REL);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
