const CACHE_NAME = 'yestograph-hub-v1.0'; 
const ASSETS = [
  '/',                // The homepage root
  '/index.html',       // The homepage file
  '/icon-main.png'      // The main icon
];

// 1. Install
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// 2. Activate (Clean up only the HUB caches)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          // Only delete caches that belong to the Hub, 
          // don't touch "relationmap-v10.7"
          if (cache.startsWith('yestograph-hub-') && cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// 3. Fetch with "Subfolder Exclusion"
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // STRATEGY: If the request is for the relationmap folder, 
  // IGNORE IT and let the other sw.js handle it.
  if (url.pathname.startsWith('/relationmap')) {
    return; 
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        // Only cache if the request was successful
        if (networkResponse && networkResponse.status === 200) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
          });
        }
        return networkResponse;
      });
      return cachedResponse || fetchPromise;
    })
  );
});

