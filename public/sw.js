const CACHE_NAME = "pv-static-v1";
const ASSETS = [
  "/",
  "/index.html",
  "/icon192.png",
  "/icon512.png",
  "/icon180.png",
  "/manifest.json",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.map((k) => k !== CACHE_NAME && caches.delete(k)))
      )
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);

  // API: toujours réseau
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(fetch(request));
    return;
  }

  // Navigation (SPA): retourner index.html
  if (request.mode === "navigate") {
    event.respondWith(
      fetch("/index.html").catch(() => caches.match("/index.html"))
    );
    return;
  }

  // Static: cache-first
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request))
  );
});
