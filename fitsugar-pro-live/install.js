(function () {
  const installButton = document.getElementById("installAppBtn");
  const sheet = document.getElementById("installSheetBackdrop");
  const closeButton = document.getElementById("installSheetClose");
  const nativeButton = document.getElementById("nativeInstallBtn");
  const title = document.getElementById("installSheetTitle");
  const description = document.getElementById("installSheetDescription");
  const steps = document.getElementById("installSteps");
  let deferredPrompt = null;

  const standalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const android = /android/i.test(navigator.userAgent);

  function markInstalled() {
    installButton.classList.add("installed");
    installButton.querySelector("span:last-child").textContent = "Installed";
    installButton.setAttribute("aria-label", "FitSugar Pro is installed");
  }
  function showInstructions() {
    nativeButton.hidden = !deferredPrompt;
    if (ios) {
      title.textContent = "Install on iPhone or iPad";
      description.textContent = "Use Safari to add FitSugar Pro to your Home Screen as a full-screen web app.";
      steps.innerHTML = `
        <div class="install-step"><span>1</span><div><b>Open this URL in Safari</b><small>Installation from Chrome on iPhone is not supported.</small></div></div>
        <div class="install-step"><span>2</span><div><b>Tap Share</b><small>Use the Share button in Safari’s toolbar.</small></div></div>
        <div class="install-step"><span>3</span><div><b>Choose Add to Home Screen</b><small>Turn on “Open as Web App”, then tap Add.</small></div></div>`;
    } else {
      title.textContent = android ? "Install on Android" : "Install FitSugar Pro";
      description.textContent = "Add the app to your device for a full-screen experience and faster repeat access.";
      steps.innerHTML = `
        <div class="install-step"><span>1</span><div><b>Open the browser menu</b><small>In Chrome, tap the three-dot menu.</small></div></div>
        <div class="install-step"><span>2</span><div><b>Choose Install app</b><small>Some browsers call this “Add to Home screen”.</small></div></div>
        <div class="install-step"><span>3</span><div><b>Confirm Install</b><small>FitSugar Pro will appear with your other apps.</small></div></div>`;
    }
    sheet.classList.add("open");
  }
  async function nativeInstall() {
    if (!deferredPrompt) return showInstructions();
    sheet.classList.remove("open");
    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    if (result.outcome === "accepted") markInstalled();
    deferredPrompt = null;
  }

  window.addEventListener("beforeinstallprompt", event => {
    event.preventDefault();
    deferredPrompt = event;
    installButton.classList.add("ready");
  });
  window.addEventListener("appinstalled", () => { markInstalled(); deferredPrompt = null; });
  installButton.addEventListener("click", () => standalone ? markInstalled() : (deferredPrompt ? nativeInstall() : showInstructions()));
  nativeButton.addEventListener("click", nativeInstall);
  closeButton.addEventListener("click", () => sheet.classList.remove("open"));
  sheet.addEventListener("click", event => { if (event.target === sheet) sheet.classList.remove("open"); });
  document.addEventListener("keydown", event => { if (event.key === "Escape") sheet.classList.remove("open"); });

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => navigator.serviceWorker.register("./service-worker.js").catch(() => {}));
  }
  if (standalone) markInstalled();
})();
