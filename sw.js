const CACHE_NAME = 'mindmap-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/icon-512.png'
];

// Install Event: Save files to phone storage
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// Fetch Event: Serve files from storage if offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});
