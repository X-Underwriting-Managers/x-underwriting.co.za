// Broker recruitment landing page (become-a-broker.html), plus the same lead
// form on brokers.html, which has no A/B variant, sticky bar or video.
// Relies on sendEmail() and escapeHtml() from js/main.js, which loads first.

// ─── Config ──────────────────────────────────────────────────────────────────
// Each tag loads only once its ID is filled in, and only after the visitor
// accepts analytics cookies in the consent banner (js/consent.js).
const LP_CONFIG = {
  ga4Id: '',                 // e.g. 'G-XXXXXXXXXX'
  metaPixelId: '',           // e.g. '123456789012345'
  linkedInPartnerId: '',     // Insight Tag partner ID
  linkedInConversionId: '',  // conversion fired on a submitted lead
  calendlyUrl: 'https://calendly.com/ceazare-x-underwriting/30min'
};

// Lead capture API (POST /public/broker/prospect). It writes the lead to
// DynamoDB, then to Freshsales. The CRM key stays server side; x-api-key only
// gates the public endpoint.
// js/lead-config.js sets window.XU_LEAD_API = { base, key }. It is not in the
// repo: each deploy workflow writes it from the GitHub environment's
// XCELERATE_BASE_API variable and XCELERATE_API_KEY secret. Non-production
// leads still reach the real CRM with an environment suffix, so test with
// obviously fake company names. Without the config (e.g. running locally),
// the form falls back to emailing the lead.
const LEAD_API = {
  base: String((window.XU_LEAD_API && window.XU_LEAD_API.base) || '').replace(/\/+$/, ''),
  key: String((window.XU_LEAD_API && window.XU_LEAD_API.key) || '')
};

// Submissions faster than this after page load are treated as bots.
const MIN_FILL_MS = 3000;
const PAGE_LOADED_AT = Date.now();

const VARIANT = window.XU_VARIANT || { h: '1', s: 'a', source: 'default' };
// Only the landing page runs the headline test; brokers.html has no variant.
const ON_LANDING_PAGE = !!window.XU_VARIANT;
const PAGE_NAME = ON_LANDING_PAGE ? 'Broker landing page' : 'Brokers page';

// ─── Tracking ────────────────────────────────────────────────────────────────
function loadTags() {
  const addScript = src => {
    const s = document.createElement('script');
    s.async = true;
    s.src = src;
    document.head.appendChild(s);
  };

  if (LP_CONFIG.ga4Id) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', LP_CONFIG.ga4Id, { headline_variant: VARIANT.h, subheadline_variant: VARIANT.s });
    addScript('https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(LP_CONFIG.ga4Id));
  }

  if (LP_CONFIG.metaPixelId) {
    const fbq = window.fbq = function () {
      fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments);
    };
    if (!window._fbq) window._fbq = fbq;
    fbq.push = fbq; fbq.loaded = true; fbq.version = '2.0'; fbq.queue = [];
    addScript('https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', LP_CONFIG.metaPixelId);
    fbq('track', 'PageView');
  }

  if (LP_CONFIG.linkedInPartnerId) {
    window._linkedin_partner_id = LP_CONFIG.linkedInPartnerId;
    window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
    window._linkedin_data_partner_ids.push(LP_CONFIG.linkedInPartnerId);
    window.lintrk = window.lintrk || function (a, b) { window.lintrk.q.push([a, b]); };
    window.lintrk.q = window.lintrk.q || [];
    addScript('https://snap.licdn.com/li.lms-analytics/insight.min.js');
  }
}

if (window.XU_CONSENT) window.XU_CONSENT.onAccept(loadTags);

// Sends one event to every tag that is loaded. Every event carries the A/B variant.
function track(event, params = {}) {
  const data = ON_LANDING_PAGE ? { ...params, headline_variant: VARIANT.h, subheadline_variant: VARIANT.s } : { ...params };
  if (window.gtag) window.gtag('event', event, data);
  if (window.fbq) {
    if (event === 'generate_lead') window.fbq('track', 'Lead', data);
    else window.fbq('trackCustom', event, data);
  }
  if (window.lintrk && event === 'generate_lead' && LP_CONFIG.linkedInConversionId) {
    window.lintrk('track', { conversion_id: Number(LP_CONFIG.linkedInConversionId) });
  }
  if (window.xuTrack) window.xuTrack(event, data);
}

document.addEventListener('click', e => {
  const el = e.target.closest('[data-track]');
  if (el) track(el.dataset.track, { location: el.dataset.loc || '' });
});

// ─── Attribution (UTM capture) ───────────────────────────────────────────────
// First touch in this session wins, so internal clicks don't overwrite it.
const ATTR_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid', 'li_fat_id'];
const attribution = (() => {
  const params = new URLSearchParams(location.search);
  const fromUrl = {};
  ATTR_KEYS.forEach(k => { if (params.get(k)) fromUrl[k] = params.get(k); });

  let stored = null;
  try { stored = JSON.parse(sessionStorage.getItem('xu_broker_attr') || 'null'); } catch (e) {}
  if (stored && !Object.keys(fromUrl).length) return stored;

  const attr = { ...fromUrl, landing_url: location.href, referrer: document.referrer || '' };
  try { sessionStorage.setItem('xu_broker_attr', JSON.stringify(attr)); } catch (e) {}
  return attr;
})();

// ─── Second form in the final CTA block ──────────────────────────────────────
// Cloned from the hero form so the markup lives in one place. IDs get a suffix.
(function cloneFinalForm() {
  const source = document.getElementById('lead');
  const slot = document.getElementById('finalFormSlot');
  if (!source || !slot) return;

  const clone = source.cloneNode(true);
  clone.id = 'lead-final';
  clone.querySelectorAll('[id]').forEach(el => { el.id += '-2'; });
  clone.querySelectorAll('label[for]').forEach(el => { el.htmlFor += '-2'; });
  clone.querySelectorAll('[aria-describedby]').forEach(el => {
    el.setAttribute('aria-describedby', el.getAttribute('aria-describedby').split(' ').map(id => id + '-2').join(' '));
  });
  clone.querySelector('form').dataset.loc = 'final';
  clone.querySelector('.form-register a').dataset.loc = 'final_form';
  clone.querySelector('.lead-h').textContent = 'Get a broker walkthrough';
  slot.replaceChildren(clone);
})();

// ─── Validation ──────────────────────────────────────────────────────────────
// SA mobile numbers: 06x, 07x, 08x. Returns +27 format, or null when invalid.
function normaliseMobile(value) {
  const d = value.replace(/[\s()-]/g, '');
  if (/^0[6-8]\d{8}$/.test(d)) return '+27' + d.slice(1);
  if (/^\+?27[6-8]\d{8}$/.test(d)) return '+' + d.replace(/^\+/, '');
  return null;
}

const RULES = {
  firstName: v => v.trim() ? '' : 'Please enter your first name.',
  surname: v => v.trim() ? '' : 'Please enter your surname.',
  mobile: v => normaliseMobile(v) ? '' : 'Please enter a South African mobile number, e.g. 082 123 4567.',
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Please enter a valid email address, e.g. name@brokerage.co.za.',
  brokerage: v => v.trim() ? '' : 'Please enter your brokerage name. If you trade under your own name, use that.',
  fsp: v => !v.trim() || /^\d{3,10}$/.test(v.trim()) ? '' : 'FSP numbers are 3 to 10 digits. Leave it blank if you don\'t have it handy.',
  province: v => v ? '' : 'Please choose your province.'
};

function validateField(input) {
  const rule = RULES[input.name];
  let message = '';
  if (input.name === 'consent') message = input.checked ? '' : 'Please tick the box so we may contact you.';
  else if (rule) message = rule(input.value);
  else return true;
  return setFieldError(input, message);
}

function setFieldError(input, message) {
  const fld = input.closest('.fld');
  const err = document.getElementById(input.getAttribute('aria-describedby'));
  fld.classList.toggle('invalid', !!message);
  fld.classList.toggle('valid', !message && input.type !== 'checkbox' && input.value.trim() !== '');
  input.setAttribute('aria-invalid', message ? 'true' : 'false');
  if (err) err.textContent = message;
  return !message;
}

// ─── Lead submission ─────────────────────────────────────────────────────────
const row = (label, value) =>
  `<tr><td style="padding:6px 12px;border:1px solid #e2e8f0;font-weight:600;background:#f8fafc">${escapeHtml(label)}</td>` +
  `<td style="padding:6px 12px;border:1px solid #e2e8f0">${escapeHtml(value || '-')}</td></tr>`;

function leadEmailHtml(d) {
  return `<h2 style="font-family:sans-serif">New broker lead</h2>
<table style="border-collapse:collapse;font-family:sans-serif;font-size:14px">
${row('First name', d.firstName)}${row('Surname', d.surname)}${row('Mobile', d.mobile)}${row('Email', d.email)}
${row('Brokerage', d.brokerage)}${row('FSP number', d.fsp)}${row('Province', d.province)}${row('Best time to call', d.contactTime)}
${row('POPIA consent', 'Yes, ' + d.consentAt)}${row('Form', d.formLocation)}
${row('CRM submission ID', d.submissionId || 'Not sent to the CRM (lead API not configured), capture manually')}
${row('Page', PAGE_NAME)}${ON_LANDING_PAGE ? row('Headline variant', VARIANT.h) + row('Subheadline variant', VARIANT.s) + row('Variant source', VARIANT.source) : ''}
${ATTR_KEYS.map(k => row(k, attribution[k])).join('')}
${row('Landing URL', attribution.landing_url)}${row('Referrer', attribution.referrer)}
</table>
`;
}

function confirmationEmailHtml(d) {
  const calendly = escapeHtml(LP_CONFIG.calendlyUrl);
  return `<div style="font-family:sans-serif;font-size:15px;color:#334155;line-height:1.6;max-width:560px">
<p>Hi ${escapeHtml(d.firstName)},</p>
<p>Thank you for your interest in becoming an accredited X Underwriting broker.</p>
<p><strong>Our broker team will be in touch soon.</strong></p>
<p>On the call we'll walk you through our 4 gap cover plans, the Xcelerate platform and how accreditation works.</p>
<p>Prefer to pick a time? <a href="${calendly}">Book a demo of Xcelerate</a>.</p>
<p>Questions in the meantime? Call (018) 004 0206 or reply to info@x-underwriting.co.za.</p>
<p>Kind regards,<br>The X Underwriting broker team</p>
<p style="font-size:12px;color:#64748b">X Underwriting Managers (Pty) Ltd is an Authorised Financial Services Provider, FSP 55527. Underwritten by Compass Insurance Company Limited, a licensed non life insurer and authorised financial services provider, FSP 12148. Gap cover is not a medical scheme and is not a substitute for medical scheme membership.</p>
</div>`;
}

// The CRM has no province, contact time, consent or campaign fields, so they
// travel in the free text message (the API truncates at 2,000 characters).
function prospectMessage(d) {
  const source = ATTR_KEYS.filter(k => attribution[k]).map(k => `${k}=${attribution[k]}`).join(', ');
  return [
    `${PAGE_NAME} enquiry.`,
    `Province: ${d.province}.`,
    d.contactTime ? `Best time to call: ${d.contactTime}.` : '',
    `POPIA consent given ${d.consentAt}.`,
    source ? `Source: ${source}.` : '',
    ON_LANDING_PAGE ? `Variant: headline ${VARIANT.h}, subheadline ${VARIANT.s}.` : '',
    `Form: ${d.formLocation}.`
  ].filter(Boolean).join(' ');
}

// Returns { ok, submissionId } on 201, { fieldErrors } on 400, or { message } otherwise.
async function submitProspect(d) {
  const res = await fetch(`${LEAD_API.base}/public/broker/prospect`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': LEAD_API.key },
    body: JSON.stringify({
      companyName: d.brokerage,
      contactPerson: `${d.firstName} ${d.surname}`,
      contactEmail: d.email,
      contactNumber: d.mobile,
      fspNumber: d.fsp || undefined,
      message: prospectMessage(d)
    })
  });
  const body = await res.json().catch(() => ({}));
  // Any 201 is a captured lead; warnings are for our side only.
  if (res.status === 201) return { ok: true, submissionId: body.submissionId };
  if (res.status === 400 && Array.isArray(body.errors)) return { ok: false, fieldErrors: body.errors };
  return { ok: false, message: body.message };
}

// API field name -> form field and the message shown under it.
const API_FIELD_ERRORS = {
  companyName: ['brokerage', 'Please check your brokerage name.'],
  contactPerson: ['firstName', 'Please check your first name and surname.'],
  contactEmail: ['email', 'Please enter a valid email address, e.g. name@brokerage.co.za.'],
  contactNumber: ['mobile', 'Please check your mobile number.'],
  fspNumber: ['fsp', 'FSP numbers are 3 to 10 digits. Leave it blank if you don\'t have it handy.']
};

function showThanks(card, firstName, submissionId) {
  card.querySelector('.lead-body').hidden = true;
  const thanks = card.querySelector('.lead-thanks');
  thanks.querySelector('[data-first-name]').textContent = firstName;
  if (submissionId) {
    thanks.querySelector('[data-ref]').textContent = submissionId;
    thanks.querySelector('.lead-ref').hidden = false;
  }
  thanks.hidden = false;
  thanks.focus();
}

document.querySelectorAll('.lead-card').forEach(card => {
  const form = card.querySelector('.lead-form');
  const button = form.querySelector('button[type=submit]');
  const status = form.querySelector('.form-status');
  const fields = Array.from(form.querySelectorAll('input:not([type=hidden]):not([name=companyUrl]), select'));
  let started = false;

  form.addEventListener('focusin', () => {
    if (started) return;
    started = true;
    track('form_start', { location: form.dataset.loc });
  });

  fields.forEach(input => {
    input.addEventListener('blur', () => { if (input.value || input.closest('.fld').classList.contains('invalid')) validateField(input); });
    input.addEventListener(input.tagName === 'SELECT' || input.type === 'checkbox' ? 'change' : 'input', () => {
      if (input.closest('.fld').classList.contains('invalid')) validateField(input);
    });
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    status.textContent = '';

    const results = fields.map(validateField);
    const firstInvalid = fields[results.indexOf(false)];
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    const f = form.elements;
    const data = {
      firstName: f.firstName.value.trim(),
      surname: f.surname.value.trim(),
      mobile: normaliseMobile(f.mobile.value),
      email: f.email.value.trim(),
      brokerage: f.brokerage.value.trim(),
      fsp: f.fsp.value.trim(),
      province: f.province.value,
      contactTime: f.contactTime.value,
      consentAt: new Date().toISOString(),
      formLocation: form.dataset.loc
    };

    // Bots fill the hidden field or submit instantly. Show success without sending anything.
    if (f.companyUrl.value || Date.now() - PAGE_LOADED_AT < MIN_FILL_MS) { showThanks(card, data.firstName); return; }

    // The API has no idempotency, so the button stays disabled until the response
    // lands. It talks to the CRM before replying, which takes a couple of seconds.
    const label = button.textContent;
    const reset = () => { button.disabled = false; button.textContent = label; };
    button.disabled = true;
    button.textContent = 'Sending…';

    const fallback = 'call us on <a href="tel:+27180040206">(018) 004 0206</a> or email <a href="mailto:info@x-underwriting.co.za">info@x-underwriting.co.za</a>.';
    const subject = `New Broker Lead: ${data.brokerage} (${data.firstName} ${data.surname})`.replace(/[\r\n]+/g, ' ');

    try {
      if (LEAD_API.base && LEAD_API.key) {
        const result = await submitProspect(data);

        if (result.fieldErrors) {
          let first = null;
          result.fieldErrors.forEach(errText => {
            const [name, message] = API_FIELD_ERRORS[errText.split(' ')[0]] || [];
            const input = name && f[name];
            if (input) { setFieldError(input, message); first = first || input; }
          });
          if (first) first.focus();
          else status.innerHTML = 'Please check your details and try again, or ' + fallback;
          reset();
          return;
        }
        if (!result.ok) {
          // The API's 500 message is written for the user and is safe to retry.
          status.innerHTML = escapeHtml(result.message || 'Sorry, something went wrong.') + ' Or ' + fallback;
          reset();
          return;
        }

        data.submissionId = result.submissionId;
        console.info('Broker lead captured, submission', result.submissionId);
        // The CRM has it; this email is only a heads up for the broker team.
        sendEmail(subject, leadEmailHtml(data)).catch(() => {});
      } else {
        // Lead API not configured for this environment: email the lead instead.
        const res = await sendEmail(subject, leadEmailHtml(data));
        if (!res.ok) throw new Error('send-email returned ' + res.status);
      }

      // The broker's confirmation must never block the thank you state.
      sendEmail(`We've received your details, ${data.firstName}`.replace(/[\r\n]+/g, ' '), confirmationEmailHtml(data), { to: [data.email], bcc: [] })
        .catch(() => {});

      if (window.xuIdentify) {
        window.xuIdentify(data.email, { 'First name': data.firstName, 'Last name': data.surname, 'Mobile number': data.mobile });
      }
      track('generate_lead', { location: data.formLocation, province: data.province });
      showThanks(card, data.firstName, data.submissionId);
    } catch (err) {
      console.error('Broker lead failed:', err);
      status.innerHTML = 'Sorry, something went wrong. Please ' + fallback;
      reset();
    }
  });
});

// ─── Mobile sticky bar ───────────────────────────────────────────────────────
// Visible once the hero has scrolled away, hidden while a form is on screen.
(function stickyBar() {
  const bar = document.getElementById('stickyBar');
  const hero = document.getElementById('hero');
  if (!bar || !hero || !('IntersectionObserver' in window)) return;

  let heroVisible = true;
  const formsVisible = new Set();
  const update = () => {
    const show = !heroVisible && formsVisible.size === 0;
    bar.classList.toggle('show', show);
    bar.setAttribute('aria-hidden', String(!show));
    bar.querySelectorAll('a').forEach(a => { a.tabIndex = show ? 0 : -1; });
  };

  new IntersectionObserver(([entry]) => { heroVisible = entry.isIntersecting; update(); }).observe(hero);
  const formObs = new IntersectionObserver(entries => {
    entries.forEach(en => (en.isIntersecting ? formsVisible.add(en.target) : formsVisible.delete(en.target)));
    update();
  }, { threshold: 0.15 });
  document.querySelectorAll('.lead-card').forEach(c => formObs.observe(c));
})();

// ─── Showcase video ──────────────────────────────────────────────────────────
// Plays only while on screen, and never on its own for reduced motion users.
(function showcaseVideo() {
  const video = document.getElementById('xcelVideo');
  if (!video || !('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let tracked = false;
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      video.preload = 'auto';
      video.play().catch(() => {});
      if (!tracked) { tracked = true; track('video_view', { location: 'showcase' }); }
    } else {
      video.pause();
    }
  }, { threshold: 0.5 }).observe(video);
})();

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
