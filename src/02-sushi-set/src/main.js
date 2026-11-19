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
  tl.from('[data-hero="line"]', { y: 64, opacity: 0, duration: 0.9, stagger: 0.14 }, 0.2)
    .from('.hero__underline path', { strokeDasharray: 300, strokeDashoffset: 300, duration: 0.8, ease: 'power2.out' }, 0.75)
    .from('[data-hero="subtitle"]', { y: 28, opacity: 0, duration: 0.8 }, 0.85)
    .from('[data-hero="actions"] .btn', { y: 24, opacity: 0, duration: 0.7 }, 1.0)
    .from('[data-hero="plate"]', { scale: 0.85, opacity: 0, duration: 1.15, ease: 'power2.out' }, 0.35)
    .from('.hero__leaf', { y: 60, opacity: 0, rotate: 12, duration: 1, stagger: 0.12 }, 0.9);

  /* Тарелка медленно «парит» */
  gsap.to('.hero__plate', {
    y: -16,
    rotation: 1.6,
    duration: 5,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
  });

  /* Параллакс листьев и тарелки за курсором — три слоя глубины */
  const hero = document.querySelector('.hero');
  const leaves = gsap.utils.toArray('.hero__leaf');
  const leafSetters = leaves.map((leaf) => ({
    x: gsap.quickTo(leaf, 'x', { duration: 0.9, ease: 'power2.out' }),
    y: gsap.quickTo(leaf, 'y', { duration: 0.9, ease: 'power2.out' }),
  }));
  const plateX = gsap.quickTo('.hero__visual', 'x', { duration: 1.2, ease: 'power2.out' });
  const plateY = gsap.quickTo('.hero__visual', 'y', { duration: 1.2, ease: 'power2.out' });

  hero.addEventListener('pointermove', (e) => {
    const r = hero.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    const depth = [46, 30, 62];
    leafSetters.forEach((set, i) => {
      set.x(nx * depth[i % depth.length]);
      set.y(ny * depth[i % depth.length] * 0.7);
    });
    plateX(nx * -14);
    plateY(ny * -10);
  });

  /* Лёгкий параллакс визуала при скролле */
  gsap.to('.hero__visual', {
    y: 80,
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

  /* Преимущества — stagger-волной */
  gsap.from('.why-card', {
    y: 60,
    opacity: 0,
    duration: 0.85,
    ease: 'power3.out',
    stagger: 0.15,
    scrollTrigger: { trigger: '.why__list', start: 'top 82%' },
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

  /* Декор секции заказа: въезд + дрейф */
  gsap.from('.order__nigiri', {
    x: -90,
    opacity: 0,
    rotate: -8,
    duration: 1.1,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.order', start: 'top 70%' },
  });
  gsap.from('.order__set', {
    x: 90,
    opacity: 0,
    rotate: 6,
    duration: 1.1,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.order', start: 'top 70%' },
  });
  gsap.to('.order__leaf', {
    y: -60,
    ease: 'none',
    scrollTrigger: { trigger: '.order', start: 'top bottom', end: 'bottom top', scrub: true },
  });
}

/* 3D-tilt карточек меню */
if (!reduceMotion) {
  document.querySelectorAll('.menu-card__inner').forEach((inner) => {
    const rx = gsap.quickTo(inner, 'rotationX', { duration: 0.5, ease: 'power2.out' });
    const ry = gsap.quickTo(inner, 'rotationY', { duration: 0.5, ease: 'power2.out' });
    inner.addEventListener('pointermove', (e) => {
      const r = inner.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      rx(ny * -6);
      ry(nx * 8);
    });
    inner.addEventListener('pointerleave', () => { rx(0); ry(0); });
  });
}

/* Мобильная лента меню: точки-индикатор по позиции скролла */
const menuGrid = document.querySelector('[data-menu-grid]');
const menuDots = document.querySelectorAll('[data-menu-dots] .menu__dot');
if (menuGrid && menuDots.length) {
  menuGrid.addEventListener('scroll', () => {
    const max = menuGrid.scrollWidth - menuGrid.clientWidth;
    const p = max > 0 ? menuGrid.scrollLeft / max : 0;
    const idx = Math.round(p * (menuDots.length - 1));
    menuDots.forEach((d, i) => d.classList.toggle('is-active', i === idx));
  }, { passive: true });
}

/* Выбор позиции: скролл к форме + подстановка названия */
function updateChosenDish(dish) {
  const chosenEl = document.querySelector('[data-chosen]');
  const chosenNameEl = document.querySelector('[data-chosen-name]');
  if (!chosenEl || !dish) return;
  chosenNameEl.textContent = dish; /* textContent — безопасно, без innerHTML */
  chosenEl.hidden = false;
}
document.querySelectorAll('.menu-card__btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.menu-card');
    const dish = card?.dataset.dish || '';
    window.__selectedDish = dish;
    const order = document.querySelector('#order');
    if (order) {
      order.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
      updateChosenDish(dish);
    }
  });
});

/* ========== Форма заказа ========== */
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

    const dish = window.__selectedDish;
    const success = document.querySelector('[data-success]');
    if (dish) {
      success.querySelector('[data-success-text]').textContent =
        `«${dish}» — мы перезвоним в течение 15 минут для подтверждения.`;
    }
    form.hidden = true;
    success.hidden = false;
    if (!reduceMotion) {
      gsap.from(success, { y: 24, opacity: 0, duration: 0.6, ease: 'power3.out' });
      gsap.from('.order__success-icon', { scale: 0.6, duration: 0.7, ease: 'back.out(2)' });
    }
  });
}
