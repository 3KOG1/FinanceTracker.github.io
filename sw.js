const CACHE_NAME = 'finance-tracker-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/src/output.css',
    '/utils/helpers.js',
    '/utils/backup.js',
    '/components/Sidebar.jsx',
    '/components/UI.jsx',
    '/components/Forms.jsx',
    '/components/Views.jsx',
    '/App.jsx'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
