const CACHE = 'WTFTE_v3';

const CACHE_URLS = [
    './',
    './index.html',
    './main.css',
    './fonts/Minecrafter.Alt.ttf',
    './img/WTF-TO-EAT.png',
    './index.js',
    './preload-results/results.json',
    './preload-results/results2.json'
];


self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE)
        .then(cache => cache.addAll(CACHE_URLS))
        .then(self.skipWaiting())
    );
});


self.addEventListener('activate', event => {
    const currentCaches = [CACHE];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
        }).then(cachesToDelete => {
            return Promise.all(cachesToDelete.map(cacheToDelete => {
                return caches.delete(cacheToDelete);
            }));
        }).then(() => self.clients.claim())
    );
});


self.addEventListener('fetch', event => {
    if (event.request.url.startsWith(self.location.origin)) {
        event.respondWith(
            caches.match(event.request).then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                } else {
                    return fetch(event.request);
                }
            })
        );
    }
});