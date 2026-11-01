/* PanelPro Web — offline cache. The build writes the cache name and the file list. */
var CACHE = 'panelpro-0.3.24-43f231bec7';
var FILES = ["./","app.css","app.js","engine.js","engine/lib.json","engine/ruby.wasm","export.js","i18n.js","icons/icon-180.png","icons/icon-192.png","icons/icon-512-maskable.png","icons/icon-512.png","manifest.webmanifest","preview3d.js","vendor/jszip.LICENSE.md","vendor/jszip.min.js","vendor/pdf-lib.LICENSE.md","vendor/pdf-lib.min.js","vendor/ruby-wasm.LICENSE.txt","vendor/ruby-wasm.umd.js","vendor/three.LICENSE.txt","vendor/three.min.js"];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILES); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k.indexOf('panelpro-') === 0 && k !== CACHE; })
      .map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

// Cache first (the app works with no signal); anything not in the cache goes to the network.
self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) { return; }
  e.respondWith(caches.open(CACHE).then(function (c) {
    var key = req.mode === 'navigate' ? './' : req;
    return c.match(key, { ignoreSearch: true }).then(function (hit) { return hit || fetch(req); });
  }));
});
