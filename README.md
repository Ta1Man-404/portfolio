# Портфолио — фронтенд-работы

Лендинги по макетам Figma: улучшенный дизайн с сохранением концепции,
GSAP-анимации, семантическая вёрстка, SEO-база, локальные шрифты, WebP.

## Сайты

| № | Проект | Демо | Исходники |
|---|--------|------|-----------|
| 01 | Смузи-боулы — лендинг доставки смузи-боулов | [открыть](https://ta1man-404.github.io/portfolio/01-smoothie-bowl/) | [src/01-smoothie-bowl](src/01-smoothie-bowl/) |
| 02 | Суши SYSHI — лендинг «собери свой сет сам» | [открыть](https://ta1man-404.github.io/portfolio/02-sushi-set/) | [src/02-sushi-set](src/02-sushi-set/) |

## Стек

Семантический HTML5 · ванильный CSS (custom properties, адаптив) ·
GSAP 3 + ScrollTrigger (с поддержкой prefers-reduced-motion) · Vite 6 ·
локальные woff2-шрифты (кириллица) · изображения WebP + lazyload ·
CSP-заголовок в production-сборке.

## Структура

- `01-smoothie-bowl/` — собранный статический сайт (то, что отдаёт GitHub Pages)
- `02-sushi-set/` — собранный статический сайт
- `src/01-smoothie-bowl/` — исходники проекта (Vite: `npm i`, `npm run dev`, `npm run build`)
- `src/02-sushi-set/` — исходники проекта
