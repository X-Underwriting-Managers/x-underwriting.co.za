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
