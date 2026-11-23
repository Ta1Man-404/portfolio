import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reducedMotion) document.documentElement.classList.add('no-motion');

/* ============================================================
   Данные меню
   ============================================================ */
const SIZES = [24, 30, 36];
const PIZZAS = [
  { id: 'vegetarian', name: 'Вегетарианская', img: 'pizza-vegetarian',
    ingredients: ['bell-pepper', 'mushroom', 'tomato', 'zucchini', 'olives'],
    prices: { 24: 390, 30: 450, 36: 510 } },
  { id: 'chicken', name: 'Курица и грибы', img: 'pizza-chicken',
    ingredients: ['chicken', 'mushroom', 'cheese'],
    prices: { 24: 420, 30: 490, 36: 560 } },
  { id: 'ham', name: 'Ветчина и грибы', img: 'pizza-ham',
    ingredients: ['ham', 'mushroom', 'cheese'],
    prices: { 24: 420, 30: 490, 36: 560 } },
  { id: 'margarita', name: 'Маргарита', img: 'pizza-margarita',
    ingredients: ['tomato', 'cheese', 'basil'],
    prices: { 24: 360, 30: 420, 36: 480 } },
  { id: 'pepperoni', name: 'Пепперони', img: 'pizza-pepperoni',
    ingredients: ['pepperoni', 'cheese', 'chilli'],
    prices: { 24: 420, 30: 480, 36: 550 } },
  { id: 'salami', name: 'Салями', img: 'pizza-salami',
    ingredients: ['salami', 'cheese', 'olives'],
    prices: { 24: 420, 30: 480, 36: 550 } },
];

const INGREDIENT_LABELS = {
  'bell-pepper': 'Болгарский перец', 'mushroom': 'Грибы', 'tomato': 'Томаты',
  'zucchini': 'Цукини', 'olives': 'Оливки', 'chicken': 'Курица',
  'ham': 'Ветчина', 'cheese': 'Сыр', 'basil': 'Базилик',
  'pepperoni': 'Пепперони', 'chilli': 'Чили', 'salami': 'Салями',
};

/* Иконки ингредиентов — наши статические SVG, безопасны для innerHTML */
const ICONS = {
  'tomato': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="13.5" r="7.5"/><path d="M12 6c-1-2 0-3 0-3M9.5 6.5 12 8l2.5-1.5M12 8V6"/></svg>',
  'cheese': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17 17 5l4 2-2 10-12 3v-3Z"/><circle cx="10" cy="14" r="1.4"/><circle cx="14" cy="11" r="1.4"/></svg>',
  'basil': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M12 20C6 18 5 11 8 5c6 1 9 7 8 13-.5 1.6-2 2.4-4 2Z"/><path d="M12 20c0-5 1.5-9 4-13"/></svg>',
  'bell-pepper': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M12 8c4.5 0 7 2.5 7 6.5S16 21 12 21s-7-2.5-7-6.5S7.5 8 12 8Z"/><path d="M12 8V5.5A1.5 1.5 0 0 1 13.5 4H15"/><path d="M12 8c-1.5.8-2 2-2 4M12 8c1.5.8 2 2 2 4"/></svg>',
  'mushroom': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11a8 8 0 0 1 16 0c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2Z"/><path d="M9.5 13l-.8 6.2A2 2 0 0 0 10.7 21h2.6a2 2 0 0 0 2-1.8L14.5 13"/></svg>',
  'zucchini': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M5 19C5 11 11 5 19 5c0 8-6 14-14 14Z"/><path d="M5 19c2-5 5-8 10-10"/><path d="M18 4l2-1-1 2"/></svg>',
  'olives': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="9" cy="14" r="5"/><circle cx="16.5" cy="10" r="4"/><path d="M13 5c2-1.5 4.5-1.5 6 0"/></svg>',
  'chicken': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M15 13a6 6 0 1 0-8.6-5.4C9.9 10.4 12.6 12 15 13Z"/><path d="M15 13l4 4M19 17l1.8-1M19 17l1 1.8"/></svg>',
  'ham': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M4 14a8 6 0 0 1 16 0 8 6 0 0 1-16 0Z"/><path d="M8 13.5c1-1 2.5-1 3.5 0M14 12.5c1-1 2.5-1 3.5 0"/></svg>',
  'pepperoni': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="8"/><circle cx="9.5" cy="10" r="1.3"/><circle cx="14.5" cy="13.5" r="1.3"/><circle cx="10.5" cy="15" r="1"/></svg>',
  'chilli': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M7 8C6 14 9 19 15 20c3.5.6 5-1 4.5-2.5C15 18 11 15 10 9"/><path d="M7 8c.5-2 2-3.5 4-4-.3 2-1 3.5-1 5"/></svg>',
  'salami': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><ellipse cx="12" cy="12" rx="8" ry="6.5"/><circle cx="9" cy="11" r="1.2"/><circle cx="14" cy="13" r="1.2"/><circle cx="13" cy="9.5" r=".9"/></svg>',
};

/* ============================================================
   Рендер карточек меню
   ============================================================ */
let currentSize = 24;
const grid = document.getElementById('menu-grid');

function renderMenu() {
  grid.innerHTML = '';
  PIZZAS.forEach((p) => {
    const li = document.createElement('li');
    li.className = 'pizza-card reveal';
    li.dataset.id = p.id;

    const wrap = document.createElement('div');
    wrap.className = 'pizza-card__imgwrap';
    const img = document.createElement('img');
    img.className = 'pizza-card__img';
    img.src = `./img/${p.img}.webp`;
    img.srcset = `./img/${p.img}.webp 512w, ./img/${p.img}@2x.webp 1024w`;
    img.sizes = '(max-width: 720px) 64vw, (max-width: 1000px) 40vw, 26vw';
    img.alt = `Пицца «${p.name}»`;
    img.width = 512; img.height = 512;
    img.loading = 'lazy';
    wrap.append(img);

    const name = document.createElement('h3');
    name.className = 'pizza-card__name';
    name.textContent = p.name;

    const ing = document.createElement('div');
    ing.className = 'pizza-card__ingredients';
    p.ingredients.forEach((key) => {
      const s = document.createElement('span');
      s.innerHTML = ICONS[key] || '';
      s.setAttribute('role', 'img');
      s.setAttribute('aria-label', INGREDIENT_LABELS[key] || key);
      s.title = INGREDIENT_LABELS[key] || key;
      ing.append(s);
    });

    const size = document.createElement('p');
    size.className = 'pizza-card__size';
    size.textContent = `${currentSize} см`;

    const price = document.createElement('p');
    price.className = 'pizza-card__price';
    price.textContent = `${p.prices[currentSize]} ₽`;

    const btn = document.createElement('button');
    btn.className = 'btn btn--small pizza-card__btn';
    btn.type = 'button';
    btn.textContent = 'Заказать';
    btn.addEventListener('click', () => selectPizza(p.id));

    li.append(wrap, name, ing, size, price, btn);
    grid.append(li);
  });
}
renderMenu();

/* ============================================================
   Свитчер размеров: цены flip + пиццы растут
   ============================================================ */
const SCALE_BY_SIZE = { 24: 0.92, 30: 1, 36: 1.08 };
const tabs = document.getElementById('size-tabs');
const thumb = tabs.querySelector('.size-tabs__thumb');

function moveThumb(tab) {
  thumb.style.width = `${tab.offsetWidth}px`;
  thumb.style.transform = `translateX(${tab.offsetLeft - 5}px)`;
}

function setSize(size, focusTab = null) {
  currentSize = size;
  const tabList = [...tabs.querySelectorAll('.size-tabs__tab')];
  tabList.forEach((t) => t.setAttribute('aria-checked', String(+t.dataset.size === size)));
  const active = tabList.find((t) => +t.dataset.size === size);
  moveThumb(active);
  if (focusTab) active.focus();

  document.querySelectorAll('.pizza-card').forEach((card) => {
    const p = PIZZAS.find((x) => x.id === card.dataset.id);
    card.style.setProperty('--pizza-scale', SCALE_BY_SIZE[size]);
    const img = card.querySelector('.pizza-card__img');
    const priceEl = card.querySelector('.pizza-card__price');
    card.querySelector('.pizza-card__size').textContent = `${size} см`;

    if (reducedMotion) {
      priceEl.textContent = `${p.prices[size]} ₽`;
      return;
    }
    // рост/уменьшение пиццы
    gsap.to(img, { scale: SCALE_BY_SIZE[size], duration: 0.6, ease: 'back.out(1.6)' });
    // цены — flip-перелистывание
    gsap.to(priceEl, {
      rotateX: 90, duration: 0.18, ease: 'power2.in',
      onComplete() {
        priceEl.textContent = `${p.prices[size]} ₽`;
        gsap.fromTo(priceEl, { rotateX: -90 }, { rotateX: 0, duration: 0.28, ease: 'power2.out' });
      },
    });
  });
}

tabs.addEventListener('click', (e) => {
  const tab = e.target.closest('.size-tabs__tab');
  if (tab) setSize(+tab.dataset.size);
});
tabs.addEventListener('keydown', (e) => {
  if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
  e.preventDefault();
  const i = SIZES.indexOf(currentSize);
  const next = SIZES[(i + (e.key === 'ArrowRight' ? 1 : SIZES.length - 1)) % SIZES.length];
  setSize(next, true);
});
// стартовая позиция «пилюли»
requestAnimationFrame(() => moveThumb(tabs.querySelector('[data-size="24"]')));
window.addEventListener('resize', () => {
  moveThumb(tabs.querySelector(`[data-size="${currentSize}"]`));
});

/* ============================================================
   Выбор пиццы → форма
   ============================================================ */
const choiceEl = document.getElementById('order-choice');
let selected = null;

function selectPizza(id) {
  const p = PIZZAS.find((x) => x.id === id);
  selected = { name: p.name, size: currentSize, price: p.prices[currentSize] };
  choiceEl.hidden = false;
  choiceEl.textContent = `Ваш выбор: ${p.name}, ${currentSize} см — ${p.prices[currentSize]} ₽`;
  document.getElementById('order').scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
  document.getElementById('order').dispatchEvent(new CustomEvent('pizza:select', { detail: selected }));
}

/* ============================================================
   Шапка + бургер
   ============================================================ */
const header = document.getElementById('header');
const onScrollHeader = () => header.classList.toggle('header--scrolled', window.scrollY > 30);
window.addEventListener('scroll', onScrollHeader, { passive: true });
onScrollHeader();

const burger = document.getElementById('burger');
const nav = document.querySelector('.nav');
function setMenu(open) {
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  nav.classList.toggle('nav--open', open);
}
burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
nav.addEventListener('click', (e) => { if (e.target.closest('.nav__link')) setMenu(false); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

/* ============================================================
   Hero: каскад заголовка + искры
   ============================================================ */
if (!reducedMotion) {
  gsap.from('.hero__word', {
    yPercent: 110, opacity: 0, duration: 1, stagger: 0.14, ease: 'power3.out', delay: 0.2,
  });
  gsap.from('.hero__subtitle, .hero__cta', {
    y: 26, opacity: 0, duration: 0.9, stagger: 0.15, ease: 'power2.out', delay: 0.7,
  });
}

/* Искры-угли */
(function embers() {
  if (reducedMotion) return;
  const canvas = document.getElementById('embers');
  const ctx = canvas.getContext('2d');
  let w, h, particles = [], running = false, raf = null;
  const DPR = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * DPR; canvas.height = h * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  function spawn() {
    return {
      x: Math.random() * w,
      y: h + 10,
      r: 0.8 + Math.random() * 1.9,
      vy: 0.4 + Math.random() * 0.9,
      vx: (Math.random() - 0.5) * 0.35,
      life: 0,
      maxLife: 300 + Math.random() * 300,
      hue: 24 + Math.random() * 14,
    };
  }
  function tick() {
    if (!running) return;
    ctx.clearRect(0, 0, w, h);
    particles.forEach((p) => {
      p.life++;
      p.x += p.vx + Math.sin((p.life + p.y) * 0.02) * 0.3;
      p.y -= p.vy;
      const fade = 1 - p.life / p.maxLife;
      const flicker = 0.7 + Math.sin(p.life * 0.25) * 0.3;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 90%, 58%, ${Math.max(fade * flicker, 0) * 0.85})`;
      ctx.shadowColor = 'rgba(232,145,45,.8)';
      ctx.shadowBlur = 8;
      ctx.fill();
      if (p.y < -12 || p.life > p.maxLife) Object.assign(p, spawn());
    });
    ctx.shadowBlur = 0;
    raf = requestAnimationFrame(tick);
  }
  function start() { if (!running) { running = true; tick(); } }
  function stop() { running = false; if (raf) cancelAnimationFrame(raf); }

  resize();
  particles = Array.from({ length: 22 }, () => {
    const p = spawn(); p.y = Math.random() * h; p.life = Math.random() * p.maxLife; return p;
  });
  window.addEventListener('resize', resize);
  new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()))
    .observe(document.querySelector('.hero'));
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
})();

/* ============================================================
   Reveal-анимации + draw-on иконки
   ============================================================ */
if (!reducedMotion) {
  document.querySelectorAll('.why__list, .menu__grid').forEach((listEl) => {
    gsap.to(listEl.querySelectorAll('.reveal'), {
      opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power2.out',
      scrollTrigger: { trigger: listEl, start: 'top 78%', once: true },
    });
  });

  // draw-on: иконки рисуются при появлении
  document.querySelectorAll('.draw').forEach((svg) => {
    const shapes = svg.querySelectorAll('path, circle');
    shapes.forEach((sh) => {
      const len = sh.getTotalLength ? sh.getTotalLength() : 300;
      sh.style.strokeDasharray = len;
      sh.style.strokeDashoffset = len;
    });
    gsap.to(shapes, {
      strokeDashoffset: 0, duration: 1.4, stagger: 0.18, ease: 'power2.inOut',
      scrollTrigger: { trigger: svg, start: 'top 82%', once: true },
    });
  });

  // заголовки секций
  gsap.utils.toArray('.section__title').forEach((t) => {
    gsap.from(t, {
      y: 34, opacity: 0, duration: 0.9, ease: 'power2.out',
      scrollTrigger: { trigger: t, start: 'top 84%', once: true },
    });
  });
} else {
  document.querySelectorAll('.reveal').forEach((el) => { el.style.opacity = 1; el.style.transform = 'none'; });
}

/* ============================================================
   Параллакс куска пиццы за курсором + «дыхание»
   ============================================================ */
(function sliceParallax() {
  if (reducedMotion) return;
  const slice = document.getElementById('order-slice');
  const section = document.getElementById('order');
  if (!slice || !section) return;
  const qx = gsap.quickTo(slice, 'x', { duration: 0.9, ease: 'power3.out' });
  const qy = gsap.quickTo(slice, 'y', { duration: 0.9, ease: 'power3.out' });
  section.addEventListener('pointermove', (e) => {
    const r = section.getBoundingClientRect();
    qx(((e.clientX - r.left) / r.width - 0.5) * 26);
    qy(((e.clientY - r.top) / r.height - 0.5) * 20);
  });
  gsap.to(slice, { scale: 1.035, duration: 2.6, yoyo: true, repeat: -1, ease: 'sine.inOut' });
})();

/* ============================================================
   Dev-хук для проверок: ?snap=<id> — мгновенный переход к секции
   ============================================================ */
const snapTarget = new URLSearchParams(location.search).get('snap');
if (snapTarget) {
  window.addEventListener('load', () => {
    const el = document.getElementById(snapTarget);
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
}

/* ============================================================
   Форма: маска +7, валидация, успех
   ============================================================ */
const form = document.getElementById('order-form');
const phone = document.getElementById('phone');
const phoneError = document.getElementById('phone-error');
const field = phone.closest('.field');
const success = document.getElementById('order-success');

function maskPhone(value) {
  let digits = value.replace(/\D/g, '');
  if (digits.startsWith('8')) digits = `7${digits.slice(1)}`;
  if (!digits.startsWith('7')) digits = `7${digits}`;
  digits = digits.slice(0, 11);
  const d = digits.slice(1);
  let out = '+7';
  if (d.length > 0) out += ` (${d.slice(0, 3)}`;
  if (d.length >= 3) out += ')';
  if (d.length > 3) out += ` ${d.slice(3, 6)}`;
  if (d.length > 6) out += `-${d.slice(6, 8)}`;
  if (d.length > 8) out += `-${d.slice(8, 10)}`;
  return out;
}
phone.addEventListener('input', () => {
  phone.value = maskPhone(phone.value);
  field.classList.remove('field--invalid');
  phoneError.hidden = true;
});
phone.addEventListener('focus', () => { if (!phone.value) phone.value = '+7 ('; });

form.addEventListener('submit', (e) => {
  e.preventDefault(); // данные не уходят в сеть
  const digits = phone.value.replace(/\D/g, '');
  if (digits.length !== 11) {
    field.classList.add('field--invalid');
    phoneError.textContent = 'Введите номер полностью: +7 (___) ___-__-__';
    phoneError.hidden = false;
    phone.focus();
    return;
  }
  form.hidden = true;
  choiceEl.hidden = true;
  const successText = document.getElementById('order-success-text');
  successText.textContent = selected
    ? `${selected.name}, ${selected.size} см — ${selected.price} ₽. Перезвоним на ${phone.value} и подтвердим бронь столика.`
    : `Перезвоним на ${phone.value} и подтвердим бронь столика.`;
  success.hidden = false;
  if (!reducedMotion) {
    gsap.from(success, { scale: 0.9, opacity: 0, duration: 0.5, ease: 'back.out(1.5)' });
  }
});
