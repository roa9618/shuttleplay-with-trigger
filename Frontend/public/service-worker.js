const CACHE_NAME = 'shuttleplay-shell-v1';
const APP_SHELL = ['/', '/index.html', '/site.webmanifest'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)),
    )),
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode !== 'navigate') return;

  event.respondWith(
    fetch(event.request).catch(() => caches.match('/index.html')),
  );
});

self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {};

  event.waitUntil(self.registration.showNotification(data.title ?? '셔틀플레이 알림', {
    body: data.message ?? '',
    icon: '/shuttleplay-icon-192.png',
    badge: '/shuttleplay-icon-192.png',
    data: {
      targetPath: data.targetPath ?? '/notifications',
    },
  }));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = new URL(event.notification.data?.targetPath ?? '/notifications', self.location.origin).href;

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      const existingClient = clients.find(client => new URL(client.url).origin === self.location.origin);

      if (existingClient) {
        return existingClient.navigate(targetUrl).then(client => client?.focus());
      }

      return self.clients.openWindow(targetUrl);
    }),
  );
});
