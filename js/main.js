// Scroll reveal
const obs = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.08 }
);
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// Nav border on scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('sc', window.scrollY > 50));

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
    'Cancer Boost',
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
