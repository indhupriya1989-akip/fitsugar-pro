const CACHE = "fitsugar-pro-v20";
const CORE = ["./", "./landing.html", "./index.html", "./landing.css", "./styles.css?v=20", "./audio.css?v=20", "./install.css?v=20", "./i18n.js?v=20", "./india-foods.js?v=20", "./app.js?v=20", "./workout.js?v=20", "./restart.js?v=20", "./business.js?v=20", "./audio.js?v=20", "./install.js?v=20", "./manifest.json", "./icon.svg", "./icon-maskable.svg", "./icon-192.png", "./icon-512.png", "./icon-maskable-512.png", "./apple-touch-icon.png", "./assets/workouts/dumbbell-chest-press.png", "./assets/workouts/goblet-squat.png", "./assets/workouts/single-arm-row.png", "./assets/workouts/shoulder-press.png", "./assets/workouts/incline-walking.png", "./assets/workouts/battle-rope-flow.png"];
self.addEventListener("install", event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE))));
self.addEventListener("activate", event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))));
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(fetch(event.request).then(response => {
    const copy = response.clone();
    caches.open(CACHE).then(cache => cache.put(event.request, copy));
    return response;
  }).catch(() => caches.match(event.request)));
});
