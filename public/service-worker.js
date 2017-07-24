console.log('Service Worker Started', self);

var cacheName = 'pwaCache';
var filesToCache = [
  './',
  './index.html',
  './assets/css/main.css',
  './assets/css/bootstrap.css',
  './assets/img/ipad-hand.png',
  './assets/img/PWA-logo.jpg',
  './assets/js/app.js',
  './assets/js/bootstrap.min.js',
  './assets/js/hardwares.js',
  './assets/js/notifications.js'
];

self.addEventListener('install', function (event) {
  self.skipWaiting();
  console.log('Service Worker Installed', event);
  event.waitUntil(
    // Open the Cache
    caches.open(cacheName).then(function (cache) {
      console.log('Service Worker: Caching App Shell at the moment......');
      // Add Files to the Cache
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function (event) {
  console.log('Service Worker Activated', event);
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(cacheNames.map(function (key) {
        if (key !== cacheName) {
          console.log('Service Worker: Removing Old Cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
    console.log('Service Worker: Fetch', event.request.url);
    console.log("Url", event.request.url);
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});


self.addEventListener('push', function (event) {
  var title = 'Clicked to open push message';
  event.waitUntil(
    self.registration.showNotification(title, {
      'body': "This message is being loaded from sw.js",//event.data.text(),
      'icon': 'assets/img/PWA-logo.jpg'
    }));
});

self.addEventListener('notificationclick', function (event) {
  console.log('Notification click: tag', event.notification.tag);
  event.notification.close();
  var url = 'https://pwademo-ff008.firebaseapp.com';
  event.waitUntil(
    clients.matchAll({
      type: 'window'
    })
      .then(function (windowClients) {
        console.log('WindowClients', windowClients);
        for (var i = 0; i < windowClients.length; i++) {
          var client = windowClients[i];
          console.log('WindowClient', client);
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});