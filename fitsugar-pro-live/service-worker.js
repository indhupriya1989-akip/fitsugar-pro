const CACHE = "fitsugar-pro-v24";
const CORE = ["./", "./landing.html", "./index.html", "./landing.css", "./styles.css?v=22", "./audio.css?v=22", "./install.css?v=22", "./i18n.js?v=22", "./india-foods.js?v=22", "./app.js?v=22", "./workout.js?v=22", "./restart.js?v=22", "./business.js?v=22", "./core.js?v=22", "./audio.js?v=24", "./install.js?v=22", "./manifest.json", "./icon.svg", "./icon-maskable.svg", "./icon-192.png", "./icon-512.png", "./icon-maskable-512.png", "./apple-touch-icon.png", "./assets/workouts/dumbbell-chest-press.png", "./assets/workouts/goblet-squat.png", "./assets/workouts/single-arm-row.png", "./assets/workouts/shoulder-press.png", "./assets/workouts/incline-walking.png", "./assets/workouts/battle-rope-flow.png", "./assets/audio/hi/home.mp3", "./assets/audio/hi/workouts.mp3", "./assets/audio/hi/nutrition.mp3", "./assets/audio/hi/progress.mp3", "./assets/audio/hi/health.mp3", "./assets/audio/hi/coach.mp3", "./assets/audio/hi/restart.mp3", "./assets/audio/hi/business.mp3", "./assets/audio/hi/card-workout.mp3", "./assets/audio/hi/card-meal.mp3", "./assets/audio/hi/card-protein.mp3", "./assets/audio/hi/card-coach.mp3", "./assets/audio/hi/card-modal.mp3", "./assets/audio/hi/generic.mp3"];
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
