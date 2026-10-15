/* EKAANNTO Safari redirect fix: retire old cache/service-worker behavior. */
self.addEventListener('install', event => { event.waitUntil((async () => { await self.skipWaiting(); })()); });
self.addEventListener('activate', event => { event.waitUntil((async () => { const keys = await caches.keys(); await Promise.all(keys.filter(key => key.startsWith('ekannto-static-')).map(key => caches.delete(key))); await self.clients.claim(); await self.registration.unregister(); })()); });
/* Intentionally no fetch handler: navigation and assets are served directly by Cloudflare Pages. */
