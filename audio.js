(function () {
  const panel = document.getElementById("audioPanel");
  const trigger = document.getElementById("audioBtn");
  const close = document.getElementById("audioClose");
  const readPage = document.getElementById("readPageBtn");
  const pause = document.getElementById("pauseAudioBtn");
  const stop = document.getElementById("stopAudioBtn");
  const speed = document.getElementById("audioSpeed");
  const speedOutput = document.getElementById("speedOutput");
  const status = document.getElementById("audioStatus");
  const pulse = document.getElementById("audioPulse");
  const localeLabel = document.getElementById("audioLocale");
  let synthesis = null;
  let utterance = null;

  const locales = {
    en: ["en-IN", "English"], ta: ["ta-IN", "தமிழ்"], hi: ["hi-IN", "हिन्दी"],
    te: ["te-IN", "తెలుగు"], ml: ["ml-IN", "മലയാളം"], kn: ["kn-IN", "ಕನ್ನಡ"],
    bn: ["bn-IN", "বাংলা"], mr: ["mr-IN", "मराठी"], gu: ["gu-IN", "ગુજરાતી"]
  };

  function locale() { return locales[FitSugarI18n.code] || locales.en; }
  function engine() { return synthesis || (synthesis = window.speechSynthesis); }
  function setStatus(message, playing = false) {
    status.textContent = message;
    pulse.classList.toggle("playing", playing);
    trigger.classList.toggle("playing", playing);
  }
  function updateLocale() {
    localeLabel.textContent = `${locale()[1]} audio`;
  }
  function cleanText(text) {
    return text.replace(/[◷⚡●✓⌁◒♟ϟ→＋■Ⅱ]/g, " ").replace(/\s+/g, " ").trim();
  }
  function closestVoice() {
    const voices = engine()?.getVoices?.() || [];
    const language = locale()[0].toLowerCase();
    return voices.find(voice => voice.lang.toLowerCase() === language)
      || voices.find(voice => voice.lang.toLowerCase().startsWith(language.split("-")[0]))
      || voices.find(voice => voice.lang.toLowerCase().startsWith("en-in"))
      || voices[0];
  }
  function speak(text) {
    const content = cleanText(text).slice(0, 2600);
    if (!("speechSynthesis" in window) || !window.SpeechSynthesisUtterance) {
      setStatus("Audio is not supported in this browser");
      toast("Voice Guide is unavailable on this device.");
      return;
    }
    if (!content) {
      setStatus("Nothing to read on this screen");
      return;
    }
    const activeEngine = engine();
    activeEngine.cancel();
    utterance = new SpeechSynthesisUtterance(content);
    utterance.lang = locale()[0];
    utterance.rate = Number(speed.value);
    utterance.pitch = 1;
    const voice = closestVoice();
    if (voice) utterance.voice = voice;
    utterance.onstart = () => setStatus("Playing audio…", true);
    utterance.onend = () => setStatus("Finished. Ready to listen.");
    utterance.onerror = event => {
      if (event.error !== "canceled" && event.error !== "interrupted") setStatus("This voice could not be played");
      else setStatus("Audio stopped");
    };
    setStatus("Starting audio…", true);
    activeEngine.speak(utterance);
  }
  function visibleScreenText() {
    const active = document.querySelector(".view.active");
    if (!active) return "";
    const items = active.querySelectorAll("h1,h2,h3,p,.tag,.eyebrow,.timeline-item>span,.meal-macros");
    return [...items].filter(element => element.offsetParent !== null && !element.closest(".alternatives-panel,.protein-panel"))
      .map(element => element.textContent.trim()).filter(Boolean).join(". ");
  }
  function cardText(button) {
    const container = button.closest(".modal,.message,article");
    if (!container) return "";
    return [...container.querySelectorAll("h1,h2,h3,p,.tag,.meal-macros")]
      .filter(element => element.offsetParent !== null && !element.closest(".alternatives-panel,.protein-panel"))
      .map(element => element.textContent.trim()).filter(Boolean).join(". ");
  }

  function togglePanel() {
    const open = panel.classList.toggle("open");
    trigger.setAttribute("aria-expanded", String(open));
    return open;
  }
  trigger.onclick = togglePanel;
  close.addEventListener("click", () => {
    panel.classList.remove("open");
    trigger.setAttribute("aria-expanded", "false");
  });
  readPage.addEventListener("click", () => speak(visibleScreenText()));
  pause.addEventListener("click", () => {
    const activeEngine = engine();
    if (!activeEngine?.speaking && !activeEngine?.paused) return setStatus("No audio is playing");
    if (activeEngine.paused) {
      activeEngine.resume(); pause.querySelector("small").textContent = "Pause"; setStatus("Playing audio…", true);
    } else {
      activeEngine.pause(); pause.querySelector("small").textContent = "Resume"; setStatus("Audio paused");
    }
  });
  stop.addEventListener("click", () => {
    if(synthesis)synthesis.cancel(); pause.querySelector("small").textContent = "Pause"; setStatus("Audio stopped");
  });
  speed.addEventListener("input", () => { speedOutput.value = `${speed.value}×`; });
  document.addEventListener("click", event => {
    const cardButton = event.target.closest(".speak-card");
    if (cardButton) speak(cardText(cardButton));
    const nearby = event.target.closest(".speak-nearby");
    if (nearby) speak(nearby.closest(".message")?.querySelector("p")?.textContent || "");
  });
  window.addEventListener("fitsugar:language", () => {
    if(synthesis)synthesis.cancel(); updateLocale(); setStatus("Ready in your selected language");
  });

  updateLocale();
  window.FitSugarAudio = {
    speak,
    stop: () => { if(synthesis)synthesis.cancel(); setStatus("Audio stopped"); },
    readScreen: () => speak(visibleScreenText()),
    toggle: togglePanel,
    get supported(){ return Boolean("speechSynthesis" in window && window.SpeechSynthesisUtterance); }
  };
  document.documentElement.dataset.audioReady = "true";
  if (!("speechSynthesis" in window) || !window.SpeechSynthesisUtterance) {
    trigger.disabled = true;
    trigger.title = "Voice Guide is not supported by this browser";
    setStatus("Audio is not supported in this browser");
  }
})();
