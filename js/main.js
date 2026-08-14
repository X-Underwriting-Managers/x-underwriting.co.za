// Scroll reveal
const obs = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.08 }
);
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// Nav border on scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('sc', window.scrollY > 50));

// Login dropdown
const loginWrap = document.getElementById('loginWrap');
const loginToggle = document.getElementById('loginToggle');
if (loginWrap && loginToggle) {
  loginToggle.addEventListener('click', e => {
    e.stopPropagation();
    const isOpen = loginWrap.classList.toggle('open');
    loginToggle.setAttribute('aria-expanded', String(isOpen));
  });
  document.addEventListener('click', () => {
    loginWrap.classList.remove('open');
    loginToggle.setAttribute('aria-expanded', 'false');
  });
}

// Mobile hamburger menu
const burger = document.getElementById('navBurger');
const mobileMenu = document.getElementById('navMobile');
burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  burger.classList.remove('open');
  mobileMenu.classList.remove('open');
}));

// Benefits show more / show less toggle
const benefitsGrid = document.getElementById('benefitsGrid');
const benefitsToggle = document.getElementById('benefitsToggle');

if (benefitsGrid && benefitsToggle) {
  // Shown before "Show more" is pressed — titles must match the .ben-title text
  const defaultBenefits = new Set([
    'Gap Cover',
    'Co-Payments',
    'Penalty Fees',
    'Emergency Room',
    'Cancer Co-Payments',
    'Cancer Top-Up'
  ]);

  const allCards = Array.from(benefitsGrid.querySelectorAll('.ben-card'));
  const extraCards = allCards.filter(card => {
    const title = card.querySelector('.ben-title');
    return !title || !defaultBenefits.has(title.textContent.trim());
  });

  let expanded = false;
  const updateBenefits = () => {
    extraCards.forEach(card => card.classList.toggle('ben-card-hidden', !expanded));
    benefitsToggle.setAttribute('aria-expanded', String(expanded));
    benefitsToggle.textContent = expanded ? 'Show less' : 'Show more';
  };

  if (extraCards.length === 0) {
    benefitsToggle.style.display = 'none';
  } else {
    updateBenefits();
    benefitsToggle.addEventListener('click', () => {
      expanded = !expanded;
      updateBenefits();
    });
  }
}

// FAQ accordion
document.querySelectorAll('.faq-item').forEach(item => {
  const q = item.querySelector('.faq-q');
  if (!q) return;
  q.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    // Close all
    document.querySelectorAll('.faq-item.open').forEach(open => open.classList.remove('open'));
    // Open this one if it wasn't open
    if (!isOpen) item.classList.add('open');
  });
});

// ─── Segmented controls (comparison tables, benefit views) ───────────────────
// A control declares its targets with data-seg; each button carries data-value.
document.querySelectorAll('[data-seg]').forEach(seg => {
  const targetSel = seg.getAttribute('data-seg-target');
  const buttons = Array.from(seg.querySelectorAll('.seg-btn'));

  buttons.forEach(btn => btn.addEventListener('click', () => {
    const value = btn.getAttribute('data-value');
    buttons.forEach(b => b.classList.toggle('active', b === btn));

    if (seg.getAttribute('data-seg') === 'view') {
      // Filter mode — set the view state on the wrapper, CSS hides the columns
      document.querySelectorAll(targetSel).forEach(el => el.setAttribute('data-view', value));
    } else {
      // Panel mode — show only the matching panel
      document.querySelectorAll(targetSel).forEach(el =>
        el.classList.toggle('active', el.getAttribute('data-panel') === value)
      );
    }
  }));
});

// A link may name the comparison panel it wants, e.g. gap-cover.html#compare-all.
// The target panel is display:none when the browser resolves the hash, so we
// activate it and scroll to the section ourselves.
function openPanelFromHash() {
  const id = (location.hash || '').replace('#', '');
  if (!id) return;
  const panel = document.getElementById(id);
  if (!panel || !panel.classList.contains('cmp-panel')) return;

  const value = panel.getAttribute('data-panel');
  document.querySelectorAll('[data-seg="panel"] .seg-btn').forEach(b =>
    b.classList.toggle('active', b.getAttribute('data-value') === value)
  );
  document.querySelectorAll('.cmp-panel').forEach(p => p.classList.toggle('active', p === panel));

  const section = panel.closest('section') || panel;
  requestAnimationFrame(() => section.scrollIntoView({ block: 'start' }));
}

openPanelFromHash();

// Arriving from another page runs the call above, but the same link clicked
// while already on this page only changes the fragment — no reload, so re-run
// it. This also covers the back and forward buttons.
window.addEventListener('hashchange', openPanelFromHash);

// And if the fragment is already the one being asked for, no hashchange fires
// at all — so handle the click itself. Matters when the reader has since
// switched panels with the segmented control and clicks the link to come back.
document.addEventListener('click', e => {
  const link = e.target.closest && e.target.closest('a[href*="#compare-"]');
  if (!link) return;

  const url = new URL(link.href, location.href);
  if (url.pathname !== location.pathname) return;  // another page — let it navigate

  const panel = document.getElementById(url.hash.replace('#', ''));
  if (!panel || !panel.classList.contains('cmp-panel')) return;

  e.preventDefault();
  if (location.hash === url.hash) openPanelFromHash();
  else location.hash = url.hash;                   // fires hashchange
});

// ─── Per-life premium calculator ─────────────────────────────────────────────
// Nexus is rated per life, so the only honest way to show a premium is to add
// up the actual lives on the policy. Figures mirror the current rate tables.
const NEXUS_BANDS = [
  { label: '0 to 21',     child: true,  tier: '18-54', n1: 30,  n2: 50  },
  { label: '22 to 24',    child: false, tier: '18-54', n1: 113, n2: 130 },
  { label: '25 to 34',    child: false, tier: '18-54', n1: 140, n2: 161 },
  { label: '35 to 44',    child: false, tier: '18-54', n1: 157, n2: 181 },
  { label: '45 to 54',    child: false, tier: '18-54', n1: 184, n2: 212 },
  { label: '55 to 59',    child: false, tier: '55-64', n1: 420, n2: 483 },
  { label: '60 to 64',    child: false, tier: '55-64', n1: 580, n2: 667 },
  { label: '65 and over', child: false, tier: '65+',   n1: 730, n2: 840 }
];

// Vertex and Apex are rated per policy on the eldest life.
const POLICY_RATES = {
  vertex: { '18-54': { ind: 450, fam: 560 }, '55-64': { ind: 550, fam: 700 }, '65+': { ind: 950,  fam: 1150 }, child: 40 },
  apex:   { '18-54': { ind: 550, fam: 700 }, '55-64': { ind: 650, fam: 800 }, '65+': { ind: 1100, fam: 1450 }, child: 50 }
};
const TIER_ORDER = ['18-54', '55-64', '65+'];
const MAX_LIVES = 8;

const calcLives = document.getElementById('calcLives');
const calcAdd = document.getElementById('calcAdd');

if (calcLives && calcAdd) {
  // One adult plus two children — the profile both rating models express cleanly
  let lives = [3, 0, 0];

  const rand = n => 'R' + n.toLocaleString('en-ZA').replace(/,/g, ' ');

  const eldestTier = () => lives
    .map(i => NEXUS_BANDS[i].tier)
    .reduce((a, b) => (TIER_ORDER.indexOf(b) > TIER_ORDER.indexOf(a) ? b : a), '18-54');

  const nexusTotal = key => lives.reduce((sum, i) => sum + NEXUS_BANDS[i][key], 0);

  const childCount = () => lives.filter(i => NEXUS_BANDS[i].child).length;
  const adultCount = () => lives.length - childCount();

  // Vertex and Apex are rated per policy on the eldest life: the individual rate
  // for a single life, otherwise the family rate. Family cover is the principal
  // member plus one adult dependant and up to three children. Extra children add
  // to the premium; a third adult cannot be added at all.
  const MAX_POLICY_ADULTS = 2;

  function policyIneligibleReason() {
    const adults = adultCount();
    if (adults === 0) return 'No per-policy equivalent: Vertex and Apex require an adult principal member.';
    if (adults > MAX_POLICY_ADULTS) {
      return 'No per-policy equivalent: Vertex and Apex family cover is the principal member plus one adult dependant. Further adults cannot be added to the policy.';
    }
    return null;
  }

  // Caveats worth surfacing that do not invalidate the quote
  function policyCaveat() {
    if (policyIneligibleReason()) return null;
    if (childCount() > 3 && eldestTier() !== '18-54') {
      return 'Additional child dependants beyond three are not rated above age 54, so the figure shown is the family rate alone.';
    }
    return null;
  }

  function policyTotal(plan) {
    if (policyIneligibleReason()) return null;
    const rates = POLICY_RATES[plan];
    const tier = eldestTier();
    if (lives.length === 1) return rates[tier].ind;
    // Additional-child rates are only published for the 18 to 54 band
    const extra = tier === '18-54' ? Math.max(0, childCount() - 3) * rates.child : 0;
    return rates[tier].fam + extra;
  }

  function renderLives() {
    calcLives.innerHTML = '';
    lives.forEach((bandIndex, position) => {
      const row = document.createElement('div');
      row.className = 'calc-life';

      const select = document.createElement('select');
      select.className = 'sel';
      select.setAttribute('aria-label', 'Age band for life ' + (position + 1));
      NEXUS_BANDS.forEach((band, i) => {
        const option = document.createElement('option');
        option.value = String(i);
        option.textContent = 'Age ' + band.label;
        option.selected = i === bandIndex;
        select.appendChild(option);
      });
      select.addEventListener('change', () => {
        lives[position] = Number(select.value);
        renderOutput();
      });

      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'calc-remove';
      remove.textContent = '×';
      remove.setAttribute('aria-label', 'Remove life ' + (position + 1));
      remove.disabled = lives.length <= 1;
      remove.addEventListener('click', () => {
        lives.splice(position, 1);
        render();
      });

      row.appendChild(select);
      row.appendChild(remove);
      calcLives.appendChild(row);
    });
    calcAdd.disabled = lives.length >= MAX_LIVES;
  }

  function renderOutput() {
    const set = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    };
    set('calcN1', rand(nexusTotal('n1')));
    set('calcN2', rand(nexusTotal('n2')));

    const reason = policyIneligibleReason();
    const vertex = policyTotal('vertex');
    const apex = policyTotal('apex');
    set('calcVertex', vertex === null ? '—' : rand(vertex));
    set('calcApex', apex === null ? '—' : rand(apex));

    const basis = document.getElementById('calcPolicyBasis');
    if (basis) {
      const tierLabel = { '18-54': '18 to 54', '55-64': '55 to 64', '65+': '65 and over' }[eldestTier()];
      basis.textContent = reason ? '' : (lives.length === 1 ? 'individual' : 'family') + ', ' + tierLabel;
    }

    const message = reason || policyCaveat();
    const note = document.getElementById('calcPolicyNote');
    if (note) {
      note.textContent = message || '';
      note.style.display = message ? 'block' : 'none';
    }
  }

  function render() {
    renderLives();
    renderOutput();
  }

  calcAdd.addEventListener('click', () => {
    if (lives.length >= MAX_LIVES) return;
    lives.push(3);
    render();
  });

  render();
}

// ─── Email API ───────────────────────────────────────────────────────────────
const API_BASE_URL = 'https://u4t3h7elpc.execute-api.af-south-1.amazonaws.com';

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// opts lets a form override the default recipients, e.g.
// sendEmail(subject, body, { to: ['someone@x-underwriting.co.za'], bcc: [] })
function sendEmail(subject, htmlBody, opts = {}) {
  return fetch(`${API_BASE_URL}/dev/utilities/send-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: opts.to || ['info@x-underwriting.co.za'],
      subject,
      htmlBody,
      cc: opts.cc || [],
      bcc: opts.bcc || ['ceazare@x-underwriting.co.za'],
      attachments: [],
      saveToSentItems: true
    })
  });
}
