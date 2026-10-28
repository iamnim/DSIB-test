// Runs in <head> before the page paints, so easy-read mode does not flicker on.
try { if (localStorage.getItem('sozitje-lahko-branje') === '1') document.documentElement.setAttribute('data-easy-read', 'true'); } catch (e) { /* storage blocked */ }
