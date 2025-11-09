const CACHE_NAME = "pv-static-v3";
const SCOPE_PATH = new URL(self.registration.scope).pathname.replace(
  /\/$/,
  "/"
);
const asset = (p) =>
  p.startsWith("/") ? `${SCOPE_PATH}${p.slice(1)}` : `${SCOPE_PATH}${p}`;
const ASSETS = [
  asset(""),
  asset("index.html"),
  asset("icon192.png"),
  asset("icon512.png"),
  asset("icon180.png"),
  asset("manifest.json"),
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
  if (url.pathname.startsWith(`${SCOPE_PATH}api/`)) {
    event.respondWith(fetch(request));
    return;
  }

  // Navigation (SPA): retourner index.html
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(asset("index.html")).catch(() => caches.match(asset("index.html")))
    );
    return;
  }

  // Static: cache-first
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request))
  );
});
