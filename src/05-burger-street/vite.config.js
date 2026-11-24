import { defineConfig } from 'vite';

/* base './' — сайт должен работать из подпапки GitHub Pages
   (user.github.io/portfolio/04-pizza-oven/) без абсолютных путей */
export default defineConfig({
  base: './',
  plugins: [
    {
      name: 'inject-csp',
      apply: 'build', // только в production: в dev CSP сломал бы HMR
      transformIndexHtml(html) {
        const csp = [
          "default-src 'self'",
          "script-src 'self'",
          "style-src 'self' 'unsafe-inline'", // GSAP анимирует через style-атрибуты
          "img-src 'self' data:",
          "font-src 'self'",
          "connect-src 'self'",
          "object-src 'none'",
          "base-uri 'none'",
          "form-action 'none'", // форма не отправляется на сервер
          "frame-ancestors 'none'",
        ].join('; ');
        return html.replace(
          '<meta name="viewport"',
          `<meta http-equiv="Content-Security-Policy" content="${csp}">\n    <meta name="viewport"`,
        );
      },
    },
  ],
});
