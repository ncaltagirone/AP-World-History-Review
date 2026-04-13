const CACHE_NAME = 'ap-world-history-v1';
const BASE = '/AP-World-History-Review/';

const ASSETS = [
  BASE,
  BASE + 'index.html',
  BASE + 'manifest.json',
  BASE + 'icon-192.svg',
  BASE + 'icon-512.svg',
  BASE + 'catalan_atlas.jpg',
  BASE + 'sistine_chapel.jpg',
  BASE + 'mehmed_II_bellini.jpg',
  BASE + 'aztec_sun_stone.jpg',
  BASE + 'vermeer_woman_balance.jpg',
  BASE + 'rubens_judith.jpg',
  BASE + 'bichitr_jahangir.jpg',
  BASE + 'rembrandt_anatomy_lesson.jpg',
  BASE + 'david_death_of_marat.jpg',
  BASE + 'manet_folies_bergere.jpg',
  BASE + 'chikanobu_plum_blossom.jpg',
];

// Install — cache all assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate — delete old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch — cache-first strategy
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cached => {
        if (cached) return cached;
        return fetch(event.request)
          .then(response => {
            // Cache valid responses for same-origin requests
            if (response && response.status === 200 && response.type === 'basic') {
              const clone = response.clone();
              caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
            }
            return response;
          })
          .catch(() => {
            // Offline fallback for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match(BASE + 'index.html');
            }
          });
      })
  );
});
