const CACHE_NAME = 'pos-daeng-offline-v2';

// Pasang dan paksa jalan tanpa nunggu
self.addEventListener('install', event => {
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(clients.claim());
});

// Strategi: Network First, Fallback to Cache
self.addEventListener('fetch', event => {
    // Abaikan request yang bukan http/https (misal chrome-extension://)
    if (!event.request.url.startsWith('http')) return;

    event.respondWith(
        fetch(event.request)
        .then(response => {
            // Kalau online: Ambil dari internet, lalu diam-diam simpan ke Cache
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, responseClone);
            });
            return response;
        })
        .catch(() => {
            // Kalau tiba-tiba OFFLINE: Ambil paksa dari Cache
            return caches.match(event.request);
        })
    );
});
