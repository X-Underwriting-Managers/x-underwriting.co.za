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
  const defaultBenefits = new Set([
    'Gap Cover',
    'Copayment',
    'Penalty Fee',
    'Emergency Room',
    'Cancer Top-Up',
    'Cancer Copayments'
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
