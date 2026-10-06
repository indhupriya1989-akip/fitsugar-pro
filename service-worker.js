const CACHE = "fitsugar-pro-v26";
const CORE = ["./", "./landing.html", "./index.html", "./landing.css", "./styles.css?v=22", "./audio.css?v=22", "./install.css?v=22", "./error-handler.css?v=1", "./error-handler.js?v=1", "./tour.css?v=1", "./tour.js?v=1", "./i18n.js?v=22", "./india-foods.js?v=22", "./app.js?v=22", "./workout.js?v=22", "./restart.js?v=22", "./business.js?v=22", "./core.js?v=22", "./audio.js?v=24", "./install.js?v=22", "./manifest.json", "./icon.svg", "./icon-maskable.svg", "./icon-192.png", "./icon-512.png", "./icon-maskable-512.png", "./apple-touch-icon.png", "./assets/workouts/dumbbell-chest-press.png", "./assets/workouts/goblet-squat.png", "./assets/workouts/single-arm-row.png", "./assets/workouts/shoulder-press.png", "./assets/workouts/incline-walking.png", "./assets/workouts/battle-rope-flow.png", "./assets/audio/hi/home.mp3", "./assets/audio/hi/workouts.mp3", "./assets/audio/hi/nutrition.mp3", "./assets/audio/hi/progress.mp3", "./assets/audio/hi/health.mp3", "./assets/audio/hi/coach.mp3", "./assets/audio/hi/restart.mp3", "./assets/audio/hi/business.mp3", "./assets/audio/hi/card-workout.mp3", "./assets/audio/hi/card-meal.mp3", "./assets/audio/hi/card-protein.mp3", "./assets/audio/hi/card-coach.mp3", "./assets/audio/hi/card-modal.mp3", "./assets/audio/hi/generic.mp3"];
self.addEventListener("install", event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE))));
self.addEventListener("activate", event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))));
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith((async () => {
    try {
      const response = await fetch(event.request);
      if (response && response.ok) {
        const copy = response.clone();
        caches.open(CACHE).then(cache => cache.put(event.request, copy)).catch(() => {});
      }
      return response;
    } catch (error) {
      const cached = await caches.match(event.request);
      if (cached) return cached;
      if (event.request.mode === "navigate") {
        return (await caches.match("./index.html")) || (await caches.match("./"));
      }
      return new Response("FitSugar Pro is offline and this resource is not cached yet.", {
        status: 503,
        headers: {"Content-Type":"text/plain; charset=utf-8"}
      });
    }
  })());
});
