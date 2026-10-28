// Small enhancements. Every page works without JavaScript; this only adds comfort.
(function () {
  'use strict';
  var html = document.documentElement;

  // Easy read (lahko branje): remembered in this browser only, never sent to the server.
  function setEasy(on) {
    if (on) html.setAttribute('data-easy-read', 'true'); else html.removeAttribute('data-easy-read');
    document.querySelectorAll('[data-easy-toggle]').forEach(function (b) { b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
    try { if (on) localStorage.setItem('sozitje-lahko-branje', '1'); else localStorage.removeItem('sozitje-lahko-branje'); } catch (e) { /* ignore */ }
  }
  setEasy(html.getAttribute('data-easy-read') === 'true');
  document.querySelectorAll('[data-easy-toggle]').forEach(function (b) {
    b.addEventListener('click', function () { setEasy(html.getAttribute('data-easy-read') !== 'true'); });
  });
  document.querySelectorAll('[data-easy-off]').forEach(function (b) {
    b.addEventListener('click', function () { setEasy(false); window.scrollTo(0, 0); });
  });

  // Show / hide password
  document.querySelectorAll('[data-pw-toggle]').forEach(function (b) {
    var input = document.getElementById(b.getAttribute('data-pw-toggle'));
    b.addEventListener('click', function () {
      var show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      b.setAttribute('aria-pressed', show ? 'true' : 'false');
      b.setAttribute('aria-label', show ? 'Skrij geslo' : 'Pokaži geslo');
      b.querySelector('use').setAttribute('href', '#i-' + (show ? 'eye-off' : 'eye'));
    });
  });

  // Ask before destructive actions
  document.querySelectorAll('form[data-confirm]').forEach(function (f) {
    f.addEventListener('submit', function (e) { if (!window.confirm(f.getAttribute('data-confirm'))) e.preventDefault(); });
  });

  // Prevent double submits
  document.querySelectorAll('form').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      if (e.defaultPrevented) return;
      if (f.dataset.sent) { e.preventDefault(); return; }
      f.dataset.sent = '1';
      setTimeout(function () { delete f.dataset.sent; }, 8000);
    });
  });

  // Photo lightbox with keyboard support
  var box = document.getElementById('lightbox');
  if (box) {
    var links = Array.prototype.slice.call(document.querySelectorAll('[data-lightbox]'));
    var img = box.querySelector('img'), cap = box.querySelector('.lb-caption'), idx = 0, opener = null;
    function show(i) {
      idx = (i + links.length) % links.length;
      img.src = links[idx].getAttribute('href');
      img.alt = links[idx].getAttribute('data-alt') || '';
      cap.textContent = (idx + 1) + ' / ' + links.length + (links[idx].getAttribute('data-alt') ? ' · ' + links[idx].getAttribute('data-alt') : '');
    }
    function close() { box.hidden = true; document.body.style.overflow = ''; if (opener) opener.focus(); }
    links.forEach(function (a, i) {
      a.addEventListener('click', function (e) { e.preventDefault(); opener = a; show(i); box.hidden = false; document.body.style.overflow = 'hidden'; box.querySelector('.lb-close').focus(); });
    });
    box.querySelector('.lb-close').addEventListener('click', close);
    box.querySelector('.lb-prev').addEventListener('click', function () { show(idx - 1); });
    box.querySelector('.lb-next').addEventListener('click', function () { show(idx + 1); });
    box.addEventListener('click', function (e) { if (e.target === box) close(); });
    document.addEventListener('keydown', function (e) {
      if (box.hidden) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(idx - 1);
      else if (e.key === 'ArrowRight') show(idx + 1);
      else if (e.key === 'Tab') { // keep focus inside the lightbox
        var f = box.querySelectorAll('button'); var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  // Hero video: pause button, and no motion for people who asked their device for less
  document.querySelectorAll('[data-video-toggle]').forEach(function (b) {
    var v = document.getElementById(b.getAttribute('data-video-toggle'));
    if (!v) return;
    function set(paused) {
      if (paused) v.pause(); else v.play();
      b.setAttribute('aria-pressed', paused ? 'true' : 'false');
      b.querySelector('span').textContent = paused ? 'Predvajaj video' : 'Ustavi video';
      b.querySelector('use').setAttribute('href', b.querySelector('use').getAttribute('href').replace(/#i-(pause|play)$/, '#i-' + (paused ? 'play' : 'pause')));
    }
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) set(true);
    b.addEventListener('click', function () { set(!v.paused); });
  });

  // Admin: filter rows in a table
  document.querySelectorAll('[data-filter-table]').forEach(function (input) {
    var rows = document.querySelectorAll('#' + input.getAttribute('data-filter-table') + ' tbody tr');
    input.addEventListener('input', function () {
      var q = input.value.toLowerCase();
      rows.forEach(function (r) { r.hidden = q && r.textContent.toLowerCase().indexOf(q) === -1; });
    });
  });
})();
