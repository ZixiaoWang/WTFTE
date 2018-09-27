const CACHE = 'WTFTE_v4';

const CACHE_URLS = [
    './',
    './index.html',
    './main.css',
    './fonts/Minecrafter.Alt.ttf',
    './img/WTF-TO-EAT.png',
    './img/icons/icon-72x72.png',
    './img/icons/icon-96x96.png',
    './img/icons/icon-128x128.png',
    './img/icons/icon-144x144.png',
    './img/icons/icon-152x152.png',
    './img/icons/icon-192x192.png',
    './img/icons/icon-384x384.png',
    './img/icons/icon-512x512.png',
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