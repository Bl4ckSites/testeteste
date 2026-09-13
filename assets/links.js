// ============================================
// LINKS.JS — FINAL (escapeHtml à prova de cópia)
// ============================================
(function () {
  'use strict';

  var SVG_WHATS = '<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="24" fill="#25D366"/><path fill="#fff" d="M24 10c-7.7 0-14 6.1-14 13.7 0 3 .9 5.7 2.6 8L11 38l6.5-1.7c2 1 4.2 1.5 6.5 1.5 7.7 0 14-6.1 14-13.7S31.7 10 24 10z"/><path fill="#25D366" d="M19.2 17.4c-.3-.7-.6-.7-.9-.7h-.8c-.3 0-.7.1-1 .5-.4.4-1.4 1.3-1.4 3.2s1.4 3.7 1.6 4c.2.3 2.8 4.4 6.9 6 3.4 1.3 4.1 1 4.8 1 .7-.1 2.3-.9 2.6-1.8.3-.9.3-1.7.2-1.8-.1-.2-.4-.3-.8-.5s-2.3-1.1-2.6-1.2c-.4-.1-.6-.2-.9.2-.3.4-1 1.2-1.2 1.5-.2.3-.4.3-.8.1-.4-.2-1.6-.6-3.1-1.9-1.1-1-1.9-2.2-2.1-2.6-.2-.4 0-.6.2-.8l.6-.7c.2-.2.3-.4.4-.7.1-.3.1-.5 0-.7-.1-.2-.9-2.2-1.7-3.1z"/></svg>';

  var DEV_LINKS = [
    { id: '1', titulo: 'Privacy 50% OFF', url: 'https://privacy.com.br/checkout/soykarolinareal', icone: 'icone-onlyfans.avif' },
 //   { id: '2', titulo: 'Grupo VIP', url: 'https://t.me/Soykarolinareal_bot?start=biositesoykarolinareal', icone: 'icone-telegram.avif' },
   // { id: '3', titulo: 'Packs e Chamada de Vídeo', url: 'https://serverflow.dad/c/whatsapp-karol', icone: SVG_WHATS },
 //   { id: '4', titulo: 'OnlyFans', url: 'https://onlyfans.com/karolinaofc/c2', icone: 'icone-twitter.avif' }
  ];

  var SVG_CHEVRON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>';

  // À prova de cópia: nenhum "&#...;" literal que possa ser corrompido
  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&' + 'amp;')
      .replace(/</g, '&' + 'lt;')
      .replace(/>/g, '&' + 'gt;')
      .replace(/"/g, '&' + 'quot;')
      .replace(/'/g, '&' + '#39;');
  }

  function iconHTML(icone) {
    if (icone && icone.indexOf('<svg') === 0) return icone;
    return '<img src="' + icone + '" alt="" loading="lazy" decoding="async">';
  }

  function renderLinks(links) {
    var c = document.getElementById('linksContainer');
    if (!c) return;
    c.innerHTML = '';
    (links || []).forEach(function (l, i) {
      var a = document.createElement('a');
      a.href = l.url;
      a.className = 'link-btn';
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.style.animationDelay = (0.3 + i * 0.15) + 's';
      a.innerHTML =
        '<span class="link-icon" aria-hidden="true">' + iconHTML(l.icone) + '</span>' +
        '<span class="link-label">' + escapeHtml(l.titulo) + '</span>' +
        '<span class="link-chevron" aria-hidden="true">' + SVG_CHEVRON + '</span>';
      c.appendChild(a);
    });
    initMagneticEffect();
  }

  function initMagneticEffect() {
    if (!window.matchMedia('(hover: hover)').matches) return;
    document.querySelectorAll('.link-btn').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = 'translate(' + (x / rect.width) * 4 + 'px, ' + (y / rect.height) * 4 + 'px) translateY(-3px) scale(1.02)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transform = '';
      });
    });
  }

  function fetchLinks() {
    return fetch('/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' }
    }).then(function (r) {
      if (r.status === 403) { var e = new Error('denied'); e.denied = true; throw e; }
      if (!r.ok) throw new Error('http ' + r.status);
      return r.json();
    });
  }

  function init() {
    var img = document.getElementById('profileImg');
    if (img) {
      img.addEventListener('error', function () {
        img.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
          '<rect width="120" height="120" fill="#1a1a1a"/>' +
          '<circle cx="60" cy="46" r="22" fill="#444"/>' +
          '<ellipse cx="60" cy="98" rx="34" ry="26" fill="#444"/>' +
          '</svg>'
        );
      });
    }

    var container = document.getElementById('linksContainer');
    if (container) {
      container.addEventListener('pointerdown', function (e) {
        var btn = e.target.closest('.link-btn');
        if (!btn) return;
        var rect = btn.getBoundingClientRect();
        var size = Math.max(rect.width, rect.height);
        var s = document.createElement('span');
        s.className = 'ripple';
        s.style.width = s.style.height = size + 'px';
        s.style.left = (e.clientX - rect.left - size / 2) + 'px';
        s.style.top = (e.clientY - rect.top - size / 2) + 'px';
        btn.appendChild(s);
        setTimeout(function () { s.remove(); }, 650);
      });
    }

    fetchLinks()
      .then(function (d) { renderLinks(d.links); })
      .catch(function (e) {
        if (e && e.denied) return; // robô negado não recebe nada
        renderLinks(DEV_LINKS);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
