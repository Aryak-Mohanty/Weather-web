const CACHE_NAME = 'weather-cache-v2';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        // Array of resources to cache
        const resourcesToCache = [
          '/',
          'index.html',
          'style.css',
          'script.js',
          'weather-icon.png',
          'manifest.json'
        ];

        // Loop through the resources and cache each one individually
        return Promise.all(
          resourcesToCache.map((resource) => {
            return fetch(resource)
              .then((response) => {
                if (response.status === 200) {
                  return cache.put(resource, response);
                }
              })
              .catch((error) => {
                console.error('Cache put error:', error);
              });
          })
        );
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});
