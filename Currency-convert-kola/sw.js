

const cacheName = 'static-cache-v2';

const filesToCache = [
  './',
  './index.html',
  './manifest.json',
  './style.css',
  './style.css.map',
  './icon-fav.png',
  './index.js',
  './index.js.map',
  './icon-app.png',
  './icon-app1.png',
  './icon-app2.png',
];
self.addEventListener('install', e => {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    }),
  );
});
self.addEventListener('activate', e => {
  console.log('[ServiceWorker] Activated');
  e.waitUntil(
    caches.keys().then(keyList =>
      Promise.all(
        keyList.map(key => {
          if (key !== cacheName) {
            return caches.delete(key);
          }
        }),
      ),
    ),
  );
});
self.addEventListener('fetch', event => {
  event.respondWith(
    caches
      .match(event.request)
      .then(response => response || fetch(event.request)),
  );
});