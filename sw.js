Sw · JS
Copy

// Rishabh Traders — Service Worker v1
const CACHE_NAME = 'rishabh-traders-v1';
 
// Cache the app shell on install
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        './',
        './index.html',
        'https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700;800&family=Noto+Sans:wght@400;500;600&display=swap'
      ]).catch(() => {});
    })
  );
});
 
// Clean up old caches on activate
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});
 
// Serve from cache, fall back to network, cache new responses
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type === 'opaque') return response;
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      }).catch(() => cached || new Response('Offline', {status: 503}));
    })
  );
});
 

