import './style.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(ScrollTrigger, Flip);

// JS доступен — снимаем no-js (при выключенном JS контент виден статично)
document.documentElement.classList.remove('no-js');

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reducedMotion) document.body.classList.add('reduced-motion');

/* ---------- Header: стекло при скролле ---------- */
const header = document.getElementById('header');
const onScroll = () => header.classList.toggle('header--scrolled', window.scrollY > 24);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Бургер-меню ---------- */
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
const closeMenu = () => {
  nav.classList.remove('is-open');
  burger.setAttribute('aria-expanded', 'false');
  burger.setAttribute('aria-label', 'Открыть меню');
};
burger.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
});
nav.addEventListener('click', (e) => {
  if (e.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && nav.classList.contains('is-open')) {
    closeMenu();
    burger.focus();
  }
});

/* ---------- Выбор зёрен → форма ---------- */
const beansInput = document.getElementById('f-beans');
document.querySelectorAll('.card__btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const product = btn.dataset.product || '';
    beansInput.value = product;
    beansInput.dispatchEvent(new Event('input', { bubbles: true }));
    document.dispatchEvent(new CustomEvent('beans:select', { detail: { product } }));
    document.getElementById('order').scrollIntoView(
      reducedMotion ? {} : { behavior: 'smooth' }
    );
  });
});

/* ---------- Фильтр каталога (FLIP) ---------- */
const chips = document.querySelectorAll('.chip');
const cards = document.querySelectorAll('.card');
chips.forEach((chip) => {
  chip.addEventListener('click', () => {
    chips.forEach((c) => {
      c.classList.toggle('is-active', c === chip);
      c.setAttribute('aria-pressed', String(c === chip));
    });
    const filter = chip.dataset.filter;

    if (reducedMotion) {
      cards.forEach((card) => {
        card.style.display = filter === 'all' || card.dataset.line === filter ? '' : 'none';
      });
      return;
    }
    const state = Flip.getState(cards);
    cards.forEach((card) => {
      card.style.display = filter === 'all' || card.dataset.line === filter ? '' : 'none';
    });
    Flip.from(state, {
      duration: 0.55,
      ease: 'power2.inOut',
      absolute: true,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.4 }),
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.9, duration: 0.3 }),
    });
    ScrollTrigger.refresh();
  });
});

/* ---------- Форма: маска, валидация, успех ---------- */
const form = document.getElementById('order-form');
const success = document.getElementById('order-success');
const nameInput = document.getElementById('f-name');
const phoneInput = document.getElementById('f-phone');

const setError = (input, msg) => {
  const field = input.closest('.field');
  const err = field.querySelector('.field__error');
  field.classList.toggle('field--invalid', Boolean(msg));
  err.textContent = msg || ''; // только textContent — без innerHTML
};

// Маска +7 (___) ___-__-__
phoneInput.addEventListener('input', () => {
  let digits = phoneInput.value.replace(/\D/g, '');
  if (digits.startsWith('8')) digits = '7' + digits.slice(1);
  if (!digits.startsWith('7')) digits = '7' + digits;
  digits = digits.slice(0, 11);
  let out = '';
  if (digits.length > 0) out = '+7';
  if (digits.length > 1) out += ' (' + digits.slice(1, 4);
  if (digits.length >= 4) out += ') ' + digits.slice(4, 7);
  if (digits.length >= 7) out += '-' + digits.slice(7, 9);
  if (digits.length >= 9) out += '-' + digits.slice(9, 11);
  phoneInput.value = out;
});

const validators = {
  name: () => (nameInput.value.trim().length >= 2 ? '' : 'Введите имя (минимум 2 буквы)'),
  phone: () => {
    const d = phoneInput.value.replace(/\D/g, '');
    return d.length === 11 ? '' : 'Введите телефон полностью';
  },
  beans: () => (beansInput.value.trim().length >= 2 ? '' : 'Укажите интересующие зёрна'),
};

form.addEventListener('submit', (e) => {
  e.preventDefault(); // данные не уходят в сеть — демо-лендинг
  const errors = [
    [nameInput, validators.name()],
    [phoneInput, validators.phone()],
    [beansInput, validators.beans()],
  ];
  let firstInvalid = null;
  errors.forEach(([input, msg]) => {
    setError(input, msg);
    if (msg && !firstInvalid) firstInvalid = input;
  });
  if (firstInvalid) {
    firstInvalid.focus();
    return;
  }
  const product = beansInput.value.trim();
  document.getElementById('order-success-text').textContent =
    `Мы перезвоним вам для уточнения информации по «${product}».`;
  form.hidden = true;
  success.hidden = false;
  if (!reducedMotion) {
    gsap.from(success, { opacity: 0, y: 24, duration: 0.6, ease: 'power3.out' });
    gsap.from('.order__success-icon', { scale: 0.4, opacity: 0, duration: 0.7, ease: 'back.out(2)' });
  }
});

[nameInput, phoneInput, beansInput].forEach((input) => {
  input.addEventListener('input', () => setError(input, ''));
});

/* ---------- Анимации (только без reduced-motion) ---------- */
if (!reducedMotion) {
  // Hero: каскадное появление
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  heroTl
    .from('.hero__title-line', { y: 60, opacity: 0, duration: 0.9, stagger: 0.15 })
    .to('.hero__underline path', { strokeDashoffset: 0, duration: 0.7, ease: 'power2.out' }, '-=0.3')
    .from('.hero__text', { y: 30, opacity: 0, duration: 0.7 }, '-=0.45')
    .from('.hero__actions .btn', { y: 24, opacity: 0, duration: 0.55, stagger: 0.1 }, '-=0.4')
    .from('.hero__visual', { opacity: 0, scale: 0.92, duration: 1.1 }, 0.25);

  // «Дыхание» чашки
  gsap.to('.hero__cup', {
    y: -14,
    duration: 3.2,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
  });

  // Параллакс hero за курсором
  const heroVisual = document.querySelector('.hero__visual');
  const cupX = gsap.quickTo('.hero__cup', 'x', { duration: 0.8, ease: 'power2.out' });
  const beansX = gsap.quickTo('.hero__beans-float--1', 'x', { duration: 1.1, ease: 'power2.out' });
  const beansY = gsap.quickTo('.hero__beans-float--1', 'y', { duration: 1.1, ease: 'power2.out' });
  document.querySelector('.hero').addEventListener('pointermove', (e) => {
    const r = heroVisual.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
    const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
    cupX(dx * 18);
    beansX(dx * -46);
    beansY(dy * -30);
  });

  // Reveal-анимации секций: после завершения снимаем класс и inline-стили,
  // чтобы CSS-состояние .reveal не «откатывало» элемент (конфликт с Flip-очисткой)
  gsap.utils.toArray('.reveal').forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.85,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 86%', once: true },
      onComplete: () => {
        el.classList.remove('reveal');
        el.style.opacity = '';
        el.style.transform = '';
        if (el.classList.contains('card')) gsap.set(el, { transformPerspective: 900 });
      },
    });
  });

  // Кольца преимуществ: дорисовка по скроллу
  gsap.utils.toArray('.advantages__ring-progress').forEach((ring, i) => {
    gsap.to(ring, {
      strokeDashoffset: 0,
      duration: 1.1,
      delay: i * 0.18,
      ease: 'power2.inOut',
      scrollTrigger: { trigger: '.advantages__list', start: 'top 82%' },
    });
  });

  // Параллакс фото преимуществ
  gsap.to('.advantages__photo img', {
    y: -34,
    ease: 'none',
    scrollTrigger: { trigger: '.advantages', start: 'top bottom', end: 'bottom top', scrub: 1.2 },
  });

  // 3D-tilt карточек за курсором
  cards.forEach((card) => {
    const rx = gsap.quickTo(card, 'rotationX', { duration: 0.5, ease: 'power2.out' });
    const ry = gsap.quickTo(card, 'rotationY', { duration: 0.5, ease: 'power2.out' });
    gsap.set(card, { transformPerspective: 900 });
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      ry(((e.clientX - r.left) / r.width - 0.5) * 10);
      rx(-((e.clientY - r.top) / r.height - 0.5) * 10);
    });
    card.addEventListener('pointerleave', () => { rx(0); ry(0); });
  });
} else {
  // Без анимаций контент сразу доступен
  document.querySelectorAll('.hero__underline path').forEach((p) => {
    p.style.strokeDashoffset = '0';
  });
  document.querySelectorAll('.advantages__ring-progress').forEach((r) => {
    r.style.strokeDashoffset = '0';
  });
}
