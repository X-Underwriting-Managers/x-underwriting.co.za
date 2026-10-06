// Cookie consent banner and website analytics loader.
// Loads before main.js on every page. Analytics scripts run only once the
// visitor accepts analytical cookies; the choice is remembered in localStorage
// and can be changed through any [data-cookie-settings] link.
//
// Exposes:
//   XU_CONSENT.onAccept(fn)  runs fn now if accepted, otherwise once accepted
//   XU_CONSENT.open()        shows the banner again
//   xuIdentify(email, props) links this visitor's analytics to a contact
//   xuTrack(event, props)    records a custom event against that contact

(function () {
  const STORAGE_KEY = 'xu-consent';

  // Freshworks CRM tracking code (heatmaps, session replay, page visits).
  // Production only, so the test site and local runs stay out of the CRM.
  const FRESHWORKS_SRC = 'https://eu.fw-cdn.com/13709179/1627244.js';
  const PRODUCTION_HOSTS = ['x-underwriting.co.za', 'www.x-underwriting.co.za'];

  const callbacks = [];
  let accepted = false;

  function readChoice() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return saved && typeof saved.analytics === 'boolean' ? saved.analytics : null;
    } catch (e) {
      return null;
    }
  }

  function saveChoice(analytics) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ analytics, at: new Date().toISOString() }));
    } catch (e) { /* private window or blocked storage: the choice lasts this page only */ }
  }

  function grant() {
    if (accepted) return;
    accepted = true;
    callbacks.splice(0).forEach(fn => { try { fn(); } catch (e) { console.error(e); } });
  }

  // ─── Freshworks ────────────────────────────────────────────────────────────
  // fwcrm only exists once the Freshworks script has finished loading, so
  // calls made before then wait in a queue.
  const fwQueue = [];
  let lastEmail = '';

  function flushFreshworks() {
    if (!window.fwcrm) return false;
    fwQueue.splice(0).forEach(call => { try { call(window.fwcrm); } catch (e) { console.error(e); } });
    return true;
  }

  function withFreshworks(call) {
    if (!accepted) return;
    fwQueue.push(call);
    flushFreshworks();
  }

  function loadFreshworks() {
    if (!PRODUCTION_HOSTS.includes(location.hostname)) return;
    const s = document.createElement('script');
    s.async = true;
    s.src = FRESHWORKS_SRC;
    s.setAttribute('chat', 'false');
    document.head.appendChild(s);
    let tries = 0;
    const timer = setInterval(() => {
      if (flushFreshworks() || ++tries > 60) clearInterval(timer);
    }, 500);
  }

  window.xuIdentify = function (email, props) {
    if (!email) return;
    lastEmail = email;
    withFreshworks(fw => fw.identify(email, { Email: email, ...props }));
  };

  // Freshworks only accepts custom events for a known email address, so
  // events before a form submission are left to the heatmaps and replays.
  window.xuTrack = function (event, props) {
    if (!lastEmail) return;
    const email = lastEmail;
    withFreshworks(fw => fw.trackCustomEvent(event, { email, ...props }));
  };

  // ─── Banner ────────────────────────────────────────────────────────────────
  let banner = null;

  function buildBanner() {
    banner = document.createElement('section');
    banner.className = 'xu-consent';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Cookie consent');
    banner.hidden = true;
    banner.innerHTML =
      '<p class="xu-consent-txt">We use cookies to make this website work. With your permission, we would also like to use website analytics to see how visitors use the site, so that we can improve it. ' +
      '<a href="popia-privacy-policy.html#cookies">Read our cookie policy</a>.</p>' +
      '<div class="xu-consent-btns">' +
      '<button type="button" class="xu-consent-btn" data-consent="decline">Decline</button>' +
      '<button type="button" class="xu-consent-btn xu-consent-btn-p" data-consent="accept">Accept</button>' +
      '</div>';
    banner.addEventListener('click', e => {
      const btn = e.target.closest('[data-consent]');
      if (!btn) return;
      const analytics = btn.dataset.consent === 'accept';
      const wasAccepted = accepted;
      saveChoice(analytics);
      hide();
      if (analytics) grant();
      // Scripts already running cannot be unloaded, so reload to stop them.
      else if (wasAccepted) location.reload();
    });
    document.body.appendChild(banner);
  }

  // Focus moves to the banner only when the visitor asked for it.
  function show(focus) {
    if (!banner) buildBanner();
    banner.hidden = false;
    if (focus === true) banner.querySelector('[data-consent="accept"]').focus({ preventScroll: true });
  }

  function hide() {
    if (banner) banner.hidden = true;
  }

  window.XU_CONSENT = {
    onAccept(fn) {
      if (accepted) fn();
      else callbacks.push(fn);
    },
    open: () => show(true)
  };

  window.XU_CONSENT.onAccept(loadFreshworks);

  function init() {
    document.addEventListener('click', e => {
      const link = e.target.closest('[data-cookie-settings]');
      if (!link) return;
      e.preventDefault();
      show(true);
    });

    const choice = readChoice();
    if (choice === true) grant();
    else if (choice === null) show();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
