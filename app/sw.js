/* PanelPro Web — offline cache. The build writes the cache names and file lists.
 * LIB = Ruby (ruby.wasm) + vendored libraries: named by their content, so an update downloads
 *       them again only when they really change (they are ~19 MB).
 * APP = the screens and the shared module engine code: small, refreshed with every update. */
var CACHE = 'panelpro-app-0.3.30-4465c2170b';
var FILES = ["./","app.css","app.js","cloud.js","compose.js","desk.js","engine.js","engine/lib.json","export.js","fields.js","firebase-config.js","i18n.js","icons/icon-180.png","icons/icon-192.png","icons/icon-512-maskable.png","icons/icon-512.png","manifest.webmanifest","manual.js","materials.js","nooks.js","preview3d.js","reports.js","runpanels.js"];
var LIB = 'panelpro-lib-6893d46631';
var LIB_FILES = ["engine/ruby.wasm","vendor/firebase.js","vendor/jszip.LICENSE.md","vendor/jszip.min.js","vendor/pdf-lib.LICENSE.md","vendor/pdf-lib.min.js","vendor/ruby-wasm.LICENSE.txt","vendor/ruby-wasm.umd.js","vendor/three.LICENSE.txt","vendor/three.min.js"];

function fill(name, list) {
  return caches.open(name).then(function (c) {
    return Promise.all(list.map(function (f) {
      return c.match(f).then(function (hit) { return hit || c.add(new Request(f, { cache: 'reload' })); });
    }));
  });
}

self.addEventListener('install', function (e) {
  e.waitUntil(Promise.all([fill(LIB, LIB_FILES), fill(CACHE, FILES)]).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k.indexOf('panelpro-') === 0 && k !== CACHE && k !== LIB; })
      .map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

// Cache first (the app works with no signal); anything not cached goes to the network.
self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) { return; }
  var key = req.mode === 'navigate' ? './' : req;
  e.respondWith(caches.match(key, { ignoreSearch: true }).then(function (hit) { return hit || fetch(req); }));
});
