import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Шапка: стекло при скролле */
const header = document.querySelector('[data-header]');
const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* Бургер-меню */
const burger = document.querySelector('.header__burger');
const nav = document.querySelector('#main-nav');
if (burger && nav) {
  const setMenu = (open) => {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    nav.classList.toggle('is-open', open);
  };
  burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
  window.addEventListener('resize', () => { if (window.innerWidth > 720) setMenu(false); });
}

if (!reduceMotion) {
  /* Каскадное появление hero */
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from('[data-hero="eyebrow"]', { y: 24, opacity: 0, duration: 0.7 }, 0.15)
    .from('[data-hero="line"]', { y: 60, opacity: 0, duration: 0.9, stagger: 0.12 }, 0.25)
    .from('[data-hero="subtitle"]', { y: 30, opacity: 0, duration: 0.8 }, 0.7)
    .from('[data-hero="actions"] .btn', { y: 24, opacity: 0, duration: 0.7 }, 0.85)
    .from('[data-hero="chip"]', { scale: 0.85, opacity: 0, duration: 0.6, ease: 'back.out(1.7)' }, 1.0)
    .from('[data-hero="bowl"]', { scale: 0.86, opacity: 0, duration: 1.1, ease: 'power2.out' }, 0.35)
    .from('.hero__berry', { y: 60, opacity: 0, rotate: 8, duration: 1 }, 0.8);

  /* Медленное «дыхание» боула */
  gsap.to('.hero__bowl', {
    scale: 1.14,
    duration: 8,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
  });

  /* Параллакс за курсором для малины и боула */
  const hero = document.querySelector('.hero');
  const berry = document.querySelector('.hero__berry');
  const bowlWrap = document.querySelector('.hero__bowl-wrap');

  const setBerry = gsap.quickTo(berry, 'x', { duration: 0.8, ease: 'power2.out' });
  const setBerryY = gsap.quickTo(berry, 'y', { duration: 0.8, ease: 'power2.out' });
  const setBowl = gsap.quickTo(bowlWrap, 'x', { duration: 1.1, ease: 'power2.out' });
  const setBowlY = gsap.quickTo(bowlWrap, 'y', { duration: 1.1, ease: 'power2.out' });

  hero.addEventListener('pointermove', (e) => {
    const r = hero.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    setBerry(nx * 42);
    setBerryY(ny * 30);
    setBowl(nx * -14);
    setBowlY(ny * -10);
  });

  /* Лёгкий параллакс при скролле */
  gsap.to('.hero__visual', {
    y: 90,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
  });

  /* Появление блоков при скролле */
  gsap.utils.toArray('[data-reveal]').forEach((el) => {
    gsap.from(el, {
      y: 44,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 86%' },
    });
  });

  /* Карточки преимуществ — stagger-волной */
  gsap.from('.adv-card', {
    y: 60,
    opacity: 0,
    duration: 0.85,
    ease: 'power3.out',
    stagger: 0.14,
    scrollTrigger: { trigger: '.advantages__grid', start: 'top 82%' },
  });

  /* Декор-авокадо: въезд + дрейф при скролле */
  gsap.from('[data-reveal-deco]', {
    x: 80,
    opacity: 0,
    rotate: 10,
    duration: 1.1,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.advantages', start: 'top 70%' },
  });
  gsap.to('[data-reveal-deco]', {
    y: -70,
    ease: 'none',
    scrollTrigger: { trigger: '.advantages', start: 'top bottom', end: 'bottom top', scrub: true },
  });

  /* Карточки меню — появление сеткой */
  gsap.from('.menu-card', {
    y: 70,
    opacity: 0,
    duration: 0.9,
    ease: 'power3.out',
    stagger: 0.12,
    scrollTrigger: { trigger: '.menu__grid', start: 'top 80%' },
  });
}

/* Лёгкий 3D-tilt карточек меню (без зависимости от reduced-motion блока выше,
   но уважаем настройку) */
if (!reduceMotion) {
  document.querySelectorAll('.menu-card').forEach((card) => {
    const rx = gsap.quickTo(card, 'rotationX', { duration: 0.5, ease: 'power2.out' });
    const ry = gsap.quickTo(card, 'rotationY', { duration: 0.5, ease: 'power2.out' });
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      rx(ny * -7);
      ry(nx * 9);
    });
    card.addEventListener('pointerleave', () => { rx(0); ry(0); });
  });
}

/* Выбор боула: скролл к форме + подстановка названия */
document.querySelectorAll('.menu-card__btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.menu-card');
    const bowl = card?.dataset.bowl || '';
    /* форма появится следующим этапом — сохраняем выбор для неё */
    window.__selectedBowl = bowl;
    const order = document.querySelector('#order');
    if (order) {
      order.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
      order.dispatchEvent(new CustomEvent('bowl:select', { detail: bowl }));
      updateChosenBowl(bowl);
    }
  });
});

/* ========== Форма заказа ========== */
const chosenEl = document.querySelector('[data-chosen]');
const chosenNameEl = document.querySelector('[data-chosen-name]');

function updateChosenBowl(bowl) {
  if (!chosenEl || !bowl) return;
  chosenNameEl.textContent = bowl; /* textContent — безопасно, без innerHTML */
  chosenEl.hidden = false;
}
document.querySelector('#order')?.addEventListener('bowl:select', (e) => updateChosenBowl(e.detail));
if (window.__selectedBowl) updateChosenBowl(window.__selectedBowl);

const form = document.querySelector('[data-order-form]');
if (form) {
  const nameInput = form.querySelector('#order-name');
  const phoneInput = form.querySelector('#order-phone');

  /* Маска телефона +7 (___) ___-__-__ */
  const formatPhone = (raw) => {
    let d = raw.replace(/\D/g, '');
    if (d.startsWith('8')) d = '7' + d.slice(1);
    if (!d.startsWith('7')) d = '7' + d;
    d = d.slice(0, 11);
    const p = ['+7'];
    if (d.length > 1) p.push(' (' + d.slice(1, 4));
    if (d.length >= 4) p.push(') ' + d.slice(4, 7));
    if (d.length >= 7) p.push('-' + d.slice(7, 9));
    if (d.length >= 9) p.push('-' + d.slice(9, 11));
    return p.join('');
  };
  phoneInput.addEventListener('input', () => {
    phoneInput.value = phoneInput.value ? formatPhone(phoneInput.value) : '';
    validateField(phoneInput, true);
  });

  const setInvalid = (input, msg) => {
    const field = input.closest('[data-field]');
    field.classList.toggle('is-invalid', Boolean(msg));
    field.querySelector('[data-error]').textContent = msg || '';
    return !msg;
  };

  function validateField(input, silent = false) {
    if (input === nameInput) {
      const ok = /^[А-Яа-яЁёA-Za-z\s-]{2,40}$/.test(input.value.trim());
      return silent && !input.value ? true
        : setInvalid(input, ok ? '' : 'Введите имя (минимум 2 буквы)');
    }
    const digits = input.value.replace(/\D/g, '');
    const ok = digits.length === 11;
    return silent && !input.value ? true
      : setInvalid(input, ok ? '' : 'Введите телефон полностью');
  }

  nameInput.addEventListener('input', () => validateField(nameInput, true));
  nameInput.addEventListener('blur', () => nameInput.value && validateField(nameInput));
  phoneInput.addEventListener('blur', () => phoneInput.value && validateField(phoneInput));

  form.addEventListener('submit', (e) => {
    e.preventDefault(); /* бэкенда нет — ничего не уходит в сеть */
    const okName = validateField(nameInput);
    const okPhone = validateField(phoneInput);
    if (!okName || !okPhone) return;

    const bowl = window.__selectedBowl;
    const success = document.querySelector('[data-success]');
    if (bowl) {
      success.querySelector('[data-success-text]').textContent =
        `«${bowl}» — мы перезвоним в течение 15 минут для подтверждения.`;
    }
    form.hidden = true;
    success.hidden = false;
    if (!reduceMotion) {
      gsap.from(success, { y: 24, opacity: 0, duration: 0.6, ease: 'power3.out' });
    }
  });
}
