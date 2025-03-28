const cacheName = 'bluey-snake-v1';
const assets = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './bluey.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => cache.addAll(assets))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});