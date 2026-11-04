const VERSION = "marcacoes-pwa-v1";
const SHELL = `${VERSION}-shell`;
const RUNTIME = `${VERSION}-runtime`;
const SHELL_FILES = [
  "./",
  "./index.html",
  "./offline.html",
  "./core.js",
  "./reservas.js",
  "./firebase-config.js",
  "./pwa.js",
  "./manifest.webmanifest",
  "./assets/logo-mark.png",
  "./assets/icon-192.png",
  "./assets/icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(SHELL).then(cache => cache.addAll(SHELL_FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => ![SHELL, RUNTIME].includes(key)).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;

  // Never cache the private administration panel or Firebase data requests.
  const path = new URL(request.url).pathname;
  if (path.endsWith("/painel.html") || path.endsWith("/painel")) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).then(response => {
        const copy = response.clone();
        caches.open(RUNTIME).then(cache => cache.put(request, copy));
        return response;
      }).catch(() => caches.match(request).then(cached => cached || caches.match("./offline.html")))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => {
      const fresh = fetch(request).then(response => {
        if (response.ok) caches.open(RUNTIME).then(cache => cache.put(request, response.clone()));
        return response;
      }).catch(() => cached);
      return cached || fresh;
    })
  );
});

self.addEventListener("push", event => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch { data = { body: event.data?.text() || "Tem uma atualização nas suas marcações." }; }
  const title = data.title || "Marcações";
  const options = {
    body: data.body || "Tem uma atualização sobre a sua marcação.",
    icon: data.icon || "./assets/icon-192.png",
    badge: data.badge || "./assets/icon-192.png",
    tag: data.tag || "marcacoes-atualizacao",
    data: { url: data.url || "./" },
    vibrate: [80, 40, 80]
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", event => {
  event.notification.close();
  const target = new URL(event.notification.data?.url || "./", self.location.origin).href;
  event.waitUntil(clients.matchAll({ type: "window", includeUncontrolled: true }).then(list => {
    const existing = list.find(client => "focus" in client);
    if (existing) { existing.navigate(target); return existing.focus(); }
    return clients.openWindow(target);
  }));
});
