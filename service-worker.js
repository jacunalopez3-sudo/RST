const CACHE_VERSION = "bennu-shell-v26";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./offline.js",
  "./sync-queue.js",
  "./draft-recovery.js",
  "./connection-status.css",
  "./connection-status.js",
  "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.57.4/dist/umd/supabase.min.js",
  "https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js",
  "https://cdn.jsdelivr.net/npm/signature_pad@5.0.10/dist/signature_pad.umd.min.js"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => Promise.allSettled(
        APP_SHELL.map(url =>
          fetch(url, { cache: "reload" })
            .then(response => {
              if (!response.ok && response.type !== "opaque") {
                throw new Error(`No se pudo almacenar ${url}`);
              }
              return cache.put(url, response);
            })
        )
      ))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys
        .filter(key => key !== CACHE_VERSION)
        .map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

function canCache(request, response) {
  if (request.method !== "GET") return false;
  if (!response || (!response.ok && response.type !== "opaque")) return false;
  const url = new URL(request.url);
  return !url.hostname.endsWith("supabase.co");
}

self.addEventListener("fetch", event => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.hostname.endsWith("supabase.co")) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (canCache(request, response)) {
            caches.open(CACHE_VERSION).then(cache => cache.put("./index.html", response.clone()));
          }
          return response;
        })
        .catch(async () =>
          (await caches.match(request)) ||
          (await caches.match("./index.html")) ||
          (await caches.match("./"))
        )
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => {
      const network = fetch(request)
        .then(response => {
          if (canCache(request, response)) {
            caches.open(CACHE_VERSION).then(cache => cache.put(request, response.clone()));
          }
          return response;
        });
      return cached || network;
    })
  );
});
