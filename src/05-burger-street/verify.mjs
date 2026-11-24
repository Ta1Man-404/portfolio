// CDP-проверка лендинга: скриншоты секций + интерактив
import puppeteer from 'puppeteer-core';

const URL = 'http://127.0.0.1:5199/';
const OUT = '../m5_out/';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
  args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars'],
});

async function shoot(page, name) {
  await page.screenshot({ path: OUT + name });
  console.log('shot:', name);
}

// ---------- ДЕСКТОП ----------
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 1000 });
const errors = [];
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });

await page.goto(URL, { waitUntil: 'networkidle0' });
await sleep(2500); // даём отыграть hero-анимациям
await shoot(page, 'v-01-hero.png');

// шрифты загрузились?
const fonts = await page.evaluate(() => [...document.fonts].map((f) => `${f.family} ${f.status}`));
console.log('fonts:', fonts.join(' | '));

// мини-шапка не должна быть видна на верху
const miniAtTop = await page.evaluate(() => document.querySelector('.mini-header').classList.contains('visible'));
console.log('mini-header at top (ожидаем false):', miniAtTop);

// преимущества
await page.evaluate(() => document.getElementById('advantages').scrollIntoView());
await sleep(1400);
await shoot(page, 'v-02-adv.png');

// меню
await page.evaluate(() => document.getElementById('menu').scrollIntoView());
await sleep(1400);
const miniOnCraft = await page.evaluate(() => ({
  visible: document.querySelector('.mini-header').classList.contains('visible'),
  dark: document.querySelector('.mini-header').classList.contains('mini-header--dark'),
}));
console.log('mini-header на крафтовой секции (ожидаем visible+dark):', miniOnCraft);
await shoot(page, 'v-03-menu.png');

// клик «Добавить в заказ» по 2-й карточке
await page.evaluate(() => document.querySelectorAll('.ticket .btn--stub')[1].click());
await sleep(1800);
const chip = await page.evaluate(() => ({
  hidden: document.getElementById('orderChip').hidden,
  text: document.getElementById('orderChip').textContent,
  select: document.getElementById('burgerSelect').value,
  torn: document.querySelectorAll('.ticket')[1].classList.contains('ticket--torn'),
}));
console.log('после выбора бургера:', chip);
await shoot(page, 'v-04-order-chip.png');

// валидация: submit с пустыми полями
await page.evaluate(() => document.getElementById('order').scrollIntoView());
await sleep(600);
await page.evaluate(() => document.querySelector('.receipt__submit').click());
await sleep(400);
const errs = await page.evaluate(() => [...document.querySelectorAll('.receipt__error')].map((e) => e.textContent));
console.log('ошибки валидации:', errs);
await shoot(page, 'v-05-validation.png');

// заполняем и отправляем
await page.type('#nameInput', 'Анатолий');
await page.type('#phoneInput', '89261234567');
await sleep(300);
const masked = await page.evaluate(() => document.getElementById('phoneInput').value);
console.log('маска телефона:', masked);
await page.evaluate(() => document.querySelector('.receipt__submit').click());
await sleep(1200);
const success = await page.evaluate(() => ({
  formHidden: document.getElementById('orderForm').hidden,
  successVisible: !document.getElementById('orderSuccess').hidden,
  burger: document.getElementById('successBurger').textContent,
  price: document.getElementById('successPrice').textContent,
  num: document.getElementById('successNum').textContent,
}));
console.log('экран успеха:', success);
await shoot(page, 'v-06-success.png');

// футер
await page.evaluate(() => document.querySelector('.footer').scrollIntoView());
await sleep(800);
await shoot(page, 'v-07-footer.png');

// горизонтальное переполнение
const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
console.log('h-overflow px (ожидаем 0):', overflow);

// ---------- МОБАЙЛ ----------
const mob = await browser.newPage();
await mob.setViewport({ width: 390, height: 844 });
await mob.goto(URL, { waitUntil: 'networkidle0' });
await sleep(2500);
await shoot(mob, 'm-01-hero.png');
await mob.evaluate(() => document.getElementById('menu').scrollIntoView());
await sleep(1400);
await shoot(mob, 'm-02-menu.png');
// бургер-меню из мини-пилюли (после скролла)
await mob.tap('.mini-header__burger');
await sleep(600);
await shoot(mob, 'm-03-burger-open.png');
const menuOpen = await mob.evaluate(() => document.querySelector('.mini-header__burger').getAttribute('aria-expanded'));
console.log('бургер aria-expanded:', menuOpen);
await mob.tap('.mini-header__burger');
await sleep(500);
const mOverflow = await mob.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
console.log('mobile h-overflow px (ожидаем 0):', mOverflow);

console.log('JS errors:', errors.length ? errors : 'нет');
await browser.close();
