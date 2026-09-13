// ============================================
// INDEX.JS — Gateway silencioso (FINAL)
// ============================================
(function () {
  'use strict';
  var TARGET_REL = './links.html';
  var ua = navigator.userAgent || '';

  // Detecção de robô (SÓ automação)
  function isBot() {
    if (navigator.webdriver === true) return true;
    return /bot|crawler|spider|headless|puppeteer|selenium|phantomjs|curl|wget|python-requests|scrapy|httpclient/i.test(ua);
  }

  function init() {
    // Robô de automação → 404
    if (isBot()) {
      window.location.replace('./404.html');
      return;
    }

    // TODOS os outros (incluindo Instagram) vão direto para links.html.
    // O script inline no <head> já tentou o escape. Se falhou, cai aqui normalmente.
    window.location.replace(TARGET_REL);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
