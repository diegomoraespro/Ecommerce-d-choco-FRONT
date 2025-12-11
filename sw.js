// Service Worker para D'Choco PWA
const CACHE_NAME = 'dchoco-v3';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/carrinho.html',
  '/catalogo.html',
  '/contrate.html',
  '/login.html',
  '/cadastro.html',
  '/detalhe.html',
  '/esqueci-senha.html',
  '/produto.html',
  '/tela-admin.html',
  '/assets/css/main.css',
  '/assets/css/icone.css',
  '/assets/css/carrinho.css',
  '/assets/css/mobile-nav.css',
  '/assets/css/fontawesome-all.min.css',
  '/assets/js/jquery.min.js',
  '/assets/js/jquery.dropotron.min.js',
  '/assets/js/browser.min.js',
  '/assets/js/breakpoints.min.js',
  '/assets/js/util.js',
  '/assets/js/main.js',
  '/assets/js/slider.js',
  '/assets/js/carrinho.js'
];

// Instalar Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('Alguns assets não puderam ser cacheados:', err);
        return cache.addAll(ASSETS_TO_CACHE.filter((url) => !url.includes('assets/images')));
      });
    })
  );
  self.skipWaiting();
});

// Ativar Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Estratégia: Network First, Fall back to Cache
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache a resposta se for bem-sucedida
        if (response.ok) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Se a requisição falhar, tenta a cache
        return caches.match(event.request).then((cachedResponse) => {
          return cachedResponse || new Response('Offline - Página não disponível', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/plain'
            })
          });
        });
      })
  );
});
