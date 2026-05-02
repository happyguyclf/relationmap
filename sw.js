const CACHE_NAME = 'mindmap-v10.7'; // Change this number every time you update!
const ASSETS = [
  '/',
  '/index.html',
  '/iconApp.png'
];

// 1. Install: Save files and skip waiting
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Forces the new service worker to become active
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// 2. Activate: Delete old caches (Cleanup)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// 3. Fetch: Stale-While-Revalidate (Fast + Always Updating)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        // Update the cache with the new version from the network
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
        });
        return networkResponse;
      });
      // Return the cached version if we have it, otherwise wait for network
      return cachedResponse || fetchPromise;
    })
  );
});
