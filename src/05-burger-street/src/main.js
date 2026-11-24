import './style.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ============================================================
   Мобильное меню (инфраструктура)
   ============================================================ */
const burgerBtns = document.querySelectorAll('.burger-btn');
const mobileMenu = document.getElementById('mobileMenu');

function setBurgerState(open) {
  burgerBtns.forEach((btn) => {
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  });
}
function closeMobileMenu() {
  setBurgerState(false);
  mobileMenu.classList.remove('open');
  setTimeout(() => { mobileMenu.hidden = true; }, 350);
}
burgerBtns.forEach((btn) => btn.addEventListener('click', () => {
  const isOpen = btn.getAttribute('aria-expanded') === 'true';
  if (isOpen) { closeMobileMenu(); return; }
  mobileMenu.hidden = false;
  requestAnimationFrame(() => mobileMenu.classList.add('open'));
  setBurgerState(true);
}));
mobileMenu.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMobileMenu));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeMobileMenu();
});

/* ============================================================
   Мини-шапка-пилюля: появление после скролла + инверсия
   на светлой (крафтовой) секции
   ============================================================ */
const miniHeader = document.querySelector('.mini-header');
const lightSections = document.querySelectorAll('[data-theme="light"]');

function onScrollMini() {
  miniHeader.classList.toggle('visible', window.scrollY > 480);
}
window.addEventListener('scroll', onScrollMini, { passive: true });
onScrollMini();

const themeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      miniHeader.classList.toggle('mini-header--dark', entry.target.dataset.theme === 'light');
    }
  });
}, { rootMargin: '-70px 0px -85% 0px' });
lightSections.forEach((s) => themeObserver.observe(s));

/* ============================================================
   Hero: «оттиск штампа» + дрейф декора
   ============================================================ */
if (!reducedMotion) {
  gsap.fromTo('.stamp-line',
    { scale: 1.7, opacity: 0, rotate: -4, filter: 'blur(6px)' },
    {
      scale: 1, opacity: 1, rotate: 0, filter: 'blur(0px)',
      duration: 0.5, ease: 'power4.in', stagger: 0.28, delay: 0.2,
      onComplete() {
        // микро-встряска «бумаги» после оттиска
        gsap.fromTo('.hero__title', { y: 0 }, { y: 2, duration: 0.06, yoyo: true, repeat: 3, clearProps: 'y' });
      },
    });

  gsap.fromTo('.hero__text, .hero__actions, .hero__badge',
    { opacity: 0, y: 18 },
    { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', stagger: 0.12, delay: 0.9 });

  gsap.fromTo('.hero__visual',
    { opacity: 0, scale: 0.92 },
    { opacity: 1, scale: 1, duration: 0.9, ease: 'power3.out', delay: 0.4 });

  // декор: ленивый дрейф по таймеру (не за курсором)
  gsap.to('.hero__pepper--1', { y: 16, rotation: -8, duration: 3.4, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  gsap.to('.hero__pepper--2', { y: -12, rotation: 30, duration: 4.1, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  gsap.to('.hero__burger', { y: -8, duration: 3.8, ease: 'sine.inOut', yoyo: true, repeat: -1 });

  // magnetic CTA
  const magnetic = document.querySelector('.btn--magnetic');
  if (magnetic && window.matchMedia('(pointer: fine)').matches) {
    const xTo = gsap.quickTo(magnetic, 'x', { duration: 0.3, ease: 'power3' });
    const yTo = gsap.quickTo(magnetic, 'y', { duration: 0.3, ease: 'power3' });
    magnetic.addEventListener('mousemove', (e) => {
      const r = magnetic.getBoundingClientRect();
      xTo((e.clientX - r.left - r.width / 2) * 0.25);
      yTo((e.clientY - r.top - r.height / 2) * 0.35);
    });
    magnetic.addEventListener('mouseleave', () => { xTo(0); yTo(0); });
  }
}

/* ============================================================
   Wipe-reveal секций: clip-path снизу вверх, один раз
   (fromTo + immediateRender:false + once:true — урок макета 1)
   ============================================================ */
if (!reducedMotion) {
  gsap.utils.toArray('.wipe').forEach((el) => {
    gsap.fromTo(el,
      { clipPath: 'inset(100% 0% 0% 0%)', y: 26 },
      {
        clipPath: 'inset(0% 0% 0% 0%)', y: 0,
        duration: 0.85, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        immediateRender: false,
      });
  });
}

/* ============================================================
   Выбор бургера: отрыв талона → перелёт в форму → чип + селект
   ============================================================ */
const burgerSelect = document.getElementById('burgerSelect');
const orderChip = document.getElementById('orderChip');
const orderSection = document.getElementById('order');

function selectBurger(name, price) {
  [...burgerSelect.options].forEach((o) => { o.selected = o.text === name || o.value === name; });
  burgerSelect.dispatchEvent(new Event('change'));
  orderChip.hidden = false;
  orderChip.textContent = `Ваш выбор: ${name} — ${price} ₽`;
}

document.querySelectorAll('.ticket').forEach((ticket) => {
  const btn = ticket.querySelector('.btn--stub');
  const stub = ticket.querySelector('.ticket__stub');
  btn.addEventListener('click', () => {
    const name = ticket.dataset.burger;
    const price = ticket.dataset.price;
    selectBurger(name, price);

    if (reducedMotion) {
      ticket.classList.add('ticket--torn');
      orderSection.scrollIntoView({ behavior: 'auto' });
      return;
    }

    // летящий клон талона
    const rect = stub.getBoundingClientRect();
    const fly = stub.cloneNode(true);
    fly.classList.add('stub-fly');
    fly.style.left = `${rect.left}px`;
    fly.style.top = `${rect.top}px`;
    fly.style.width = `${rect.width}px`;
    document.body.appendChild(fly);

    ticket.classList.add('ticket--torn');

    const chipRect = orderChip.hidden
      ? orderSection.getBoundingClientRect()
      : orderChip.getBoundingClientRect();
    const targetY = orderChip.hidden ? chipRect.top + 120 : chipRect.top;
    const targetX = orderChip.hidden ? chipRect.left + 40 : chipRect.left;

    gsap.to(fly, {
      left: targetX,
      top: Math.max(targetY, window.scrollY + 80),
      rotate: 6,
      scale: 0.6,
      opacity: 0,
      duration: 0.85,
      ease: 'power2.inOut',
      onComplete() { fly.remove(); },
    });

    setTimeout(() => {
      orderSection.scrollIntoView({ behavior: 'smooth' });
    }, 250);
  });
});

/* ============================================================
   Телефон: маска +7 (___) ___-__-__
   ============================================================ */
const phoneInput = document.getElementById('phoneInput');

phoneInput.addEventListener('input', () => {
  let digits = phoneInput.value.replace(/\D/g, '');
  if (digits.startsWith('8')) digits = `7${digits.slice(1)}`;
  if (digits && !digits.startsWith('7')) digits = `7${digits}`;
  digits = digits.slice(0, 11);

  let out = '';
  if (digits.length > 0) out = `+${digits[0]}`;
  if (digits.length > 1) out += ` (${digits.slice(1, 4)}`;
  if (digits.length >= 4) out += ')';
  if (digits.length > 4) out += ` ${digits.slice(4, 7)}`;
  if (digits.length > 7) out += `-${digits.slice(7, 9)}`;
  if (digits.length > 9) out += `-${digits.slice(9, 11)}`;
  phoneInput.value = out;
});

/* ============================================================
   Форма: живая валидация (textContent) + чек «пробивается»
   ============================================================ */
const form = document.getElementById('orderForm');
const successReceipt = document.getElementById('orderSuccess');
const nameInput = document.getElementById('nameInput');

function setError(input, message) {
  const field = input.closest('.receipt__field');
  const error = field.querySelector('.receipt__error');
  error.textContent = message;
  field.classList.toggle('invalid', Boolean(message));
}
function validateField(input) {
  const value = input.value.trim();
  if (input === burgerSelect) {
    setError(input, value ? '' : 'Выберите бургер из меню');
    return Boolean(value);
  }
  if (input === nameInput) {
    const ok = value.length >= 2;
    setError(input, ok ? '' : 'Введите имя (минимум 2 буквы)');
    return ok;
  }
  if (input === phoneInput) {
    const digits = value.replace(/\D/g, '');
    const ok = digits.length === 11;
    setError(input, ok ? '' : 'Введите телефон полностью');
    return ok;
  }
  return true;
}
[burgerSelect, nameInput, phoneInput].forEach((input) => {
  input.addEventListener('blur', () => validateField(input));
  input.addEventListener('input', () => {
    if (input.closest('.receipt__field').classList.contains('invalid')) validateField(input);
  });
});
burgerSelect.addEventListener('change', () => validateField(burgerSelect));

form.addEventListener('submit', (e) => {
  e.preventDefault(); // данные не уходят в сеть — демо
  const ok = [burgerSelect, nameInput, phoneInput].map(validateField).every(Boolean);
  if (!ok) return;

  document.getElementById('successBurger').textContent = burgerSelect.value;
  document.getElementById('successName').textContent = nameInput.value.trim();
  document.getElementById('successPhone').textContent = phoneInput.value;
  const ticket = document.querySelector(`.ticket[data-burger="${CSS.escape(burgerSelect.value)}"]`);
  const price = ticket ? `${ticket.dataset.price} ₽` : '—';
  document.getElementById('successPrice').textContent = price;
  document.getElementById('successNum').textContent = `Б-${String(Math.floor(1000 + Math.random() * 9000))}`;

  form.hidden = true;
  successReceipt.hidden = false;

  if (!reducedMotion) {
    gsap.fromTo('.receipt__stamp',
      { scale: 2.2, opacity: 0, rotate: -18 },
      { scale: 1, opacity: 1, rotate: -6, duration: 0.35, ease: 'power4.in' });
    gsap.fromTo(successReceipt,
      { y: 12, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' });
  }
});

document.getElementById('orderAgain').addEventListener('click', () => {
  successReceipt.hidden = true;
  form.hidden = false;
  form.reset();
  orderChip.hidden = true;
  document.querySelectorAll('.ticket--torn').forEach((t) => t.classList.remove('ticket--torn'));
  document.querySelectorAll('.receipt__error').forEach((el) => { el.textContent = ''; });
  document.querySelectorAll('.receipt__field.invalid').forEach((el) => el.classList.remove('invalid'));
});
