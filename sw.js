const cacheName = 'to-do';
const staticAssets = [
    '.', 'index.html', 'script.js', 'sw.js', 'manifest.webmanifest', 'style.css', 'images/', 'images/bg-desktop-dark.jpg', 'images/bg-desktop-light.jpg', 'images/logo.png', 'images/icon-check.svg', 'images/icon-cross.svg', 'images/icon-sun.svg', 'images/icon-moon.svg', 'images/icon-cross-dark.svg'
];

self.addEventListener('install', async s =>{
    const cache  = await caches.open(cacheName);
    await cache.addAll(staticAssets);
    return self.skipWaiting();
});

self.addEventListener('activate', s =>{
    self.clients.claim();
});

async function cacheFirst(req){
    const cache = await caches.open(cacheName);
    const cached = await cache.match(req);
    return cached || fetch(req);
}
async function networkAndCache(req) {
    const cache = await caches.open(cacheName);
    try {
        const fresh = await fetch(req);
        await cache.put(req, fresh.clone());
        return fresh;
    } catch (err) {
        const cached = await cache.match(req);
        return cached;
    } 
}
self.addEventListener('fetch', async s =>{
    const req = s.request;
    const url = new URL(req.url);
    if (url.origin === location.origin) {
        s.respondWith(cacheFirst(req));
    }
    else{
        s.respondWith(networkAndCache(req));
    }
});

