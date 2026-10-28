// Preview only: a static snapshot of the site. Forms do not send anything.
(function () {
  var css = document.createElement('style');
  css.textContent =
    '.pv-bar{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:3000;display:flex;gap:4px;align-items:center;padding:6px;background:#1e301a;border-radius:999px;box-shadow:0 8px 28px -8px rgba(31,30,26,.45);font:600 15px/1 "Nunito Sans",system-ui,sans-serif;max-width:calc(100vw - 32px);overflow-x:auto}' +
    '.pv-bar span{color:#c7d3c0;padding:0 10px 0 12px;white-space:nowrap;font-size:13px;letter-spacing:.06em;text-transform:uppercase}' +
    '.pv-bar a{color:#faf9f5;text-decoration:none;padding:10px 14px;border-radius:999px;white-space:nowrap}' +
    '.pv-bar a:hover,.pv-bar a[aria-current]{background:#416c36}' +
    '.pv-bar a:focus-visible{outline:2px solid #9fc290;outline-offset:2px}' +
    '.pv-toast{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(84px + env(safe-area-inset-bottom,0px));z-index:3001;background:#faf9f5;color:#1f1e1a;border:2px solid #416c36;border-radius:16px;padding:12px 18px;font:500 16px/1.4 "Nunito Sans",system-ui,sans-serif;box-shadow:0 8px 28px -8px rgba(31,30,26,.35);max-width:calc(100vw - 32px)}' +
    'body{padding-bottom:84px}';
  document.head.appendChild(css);

  var here = location.pathname.split('/').pop() || 'index.html';
  var area = here.indexOf('a-') === 0 ? 'a' : here.indexOf('m-') === 0 ? 'm' : 'p';
  var bar = document.createElement('nav');
  bar.className = 'pv-bar'; bar.setAttribute('aria-label', 'Predogled');
  bar.innerHTML = '<span>Predogled</span>' +
    '<a href="index.html"' + (area === 'p' ? ' aria-current="true"' : '') + '>Javna stran</a>' +
    '<a href="m-clani.html"' + (area === 'm' ? ' aria-current="true"' : '') + '>Članski portal</a>' +
    '<a href="a-admin.html"' + (area === 'a' ? ' aria-current="true"' : '') + '>Skrbništvo</a>';
  document.body.appendChild(bar);

  var toast, timer;
  function say(text) {
    if (!toast) { toast = document.createElement('div'); toast.className = 'pv-toast'; toast.setAttribute('role', 'status'); document.body.appendChild(toast); }
    toast.textContent = text; toast.hidden = false;
    clearTimeout(timer); timer = setTimeout(function () { toast.hidden = true; }, 3500);
  }

  document.addEventListener('submit', function (e) {
    var f = e.target, to = f.getAttribute('data-orig-action') || '';
    e.preventDefault();
    if (to === '/prijava') { location.href = /admin/.test((f.querySelector('[name=email]') || {}).value || '') ? 'a-admin.html' : 'm-clani.html'; return; }
    if (to === '/odjava') { location.href = 'index.html'; return; }
    say('To je predogled: obrazci tu ne shranjujejo podatkov. Na strežniku društva bo to delovalo.');
  }, true);
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[data-preview-off]');
    if (a) { e.preventDefault(); say('Ta stran v predogledu ni vključena.'); }
  });
})();
