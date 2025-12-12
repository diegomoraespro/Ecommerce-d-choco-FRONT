module.exports = {
  content: [
    '*.html',
    'assets/**/*.js',
    'assets/**/*.html'
  ],
  css: [
    'assets/css/main.css',
    'assets/css/icone.css',
    'assets/css/carrinho.css',
    'assets/css/mobile-nav.css',
    'assets/css/slider.css',
    'assets/css/pwa.css'
  ],
  output: 'assets/css/',
  fontFace: true,
  keyframes: true,
  safelist: [
    /^fa-/,  // Manter todos os ícones Font Awesome
    /^fa$/,
    /^icon/,
    /^is-/,  // Classes de estado
    /^has-/,
    /^with-/,
    'mobile-bottom-nav',
    'desktop-bottom-nav',
    'active',
    'show',
    'hidden',
    'pwa-install-prompt',
    'pwa-install-content',
    'pwa-install-buttons',
    'offline-indicator',
    'pwa-loading'
  ],
  blocklist: [
    /^html/,
    /^body/,
    /^\.container/
  ]
};
