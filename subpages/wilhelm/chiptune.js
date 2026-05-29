let audioContext;
let stepTimer;
let currentStep = 0;
const musicButton = document.querySelector(".music-button");
const musicLabel = document.querySelector(".music-label");
const scrapbook = document.querySelector(".scrapbook");
const scrapCards = document.querySelectorAll(".scrap-card");

const melody = [
  247, 220, 196, 294, 294, 294, 247, 220, 196,
  330, 330, 330, 220, 262, 330, 294, 294, 294,
  294, 294, 262, 247, 247, 247, 247, 220, 196,
  294, 294, 294, 247, 220, 196, 330, 330, 330,
  220, 262, 330, 294, 294, 392, 247, 247, 220,
  196, 196, 196,
];

function randomDegree(min, max) {
  return `${Math.round(min + Math.random() * (max - min))}deg`;
}

function randomizeCurveRotations() {
  document.body.style.setProperty("--body-curve-left", randomDegree(-30, -8));
  document.body.style.setProperty("--body-curve-right", randomDegree(10, 34));
  scrapbook.style.setProperty("--scrapbook-curve-left", randomDegree(18, 44));
  scrapbook.style.setProperty("--scrapbook-curve-right", randomDegree(-48, -22));
  scrapbook.style.setProperty("--cover-curve", randomDegree(-28, -8));
  scrapbook.style.setProperty("--cover-ribbon", randomDegree(-22, 4));

  scrapCards.forEach((card) => {
    card.style.setProperty("--card-curve-soft", randomDegree(10, 42));
    card.style.setProperty("--card-curve-line", randomDegree(-42, -10));
  });
}

function playBeep(frequency, duration) {
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const now = audioContext.currentTime;

  oscillator.type = "square";
  oscillator.frequency.setValueAtTime(frequency, now);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.09, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(now);
  oscillator.stop(now + duration + 0.02);
}

async function startMusic() {
  audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();

  if (audioContext.state === "suspended") {
    await audioContext.resume();
  }

  if (audioContext.state !== "running") {
    throw new Error("Audio is waiting for browser permission.");
  }

  if (stepTimer) {
    return;
  }

  currentStep = 0;

  stepTimer = window.setInterval(() => {
    playBeep(melody[currentStep % melody.length], 0.12);

    if (currentStep % 4 === 0) {
      playBeep(98, 0.07);
    }

    currentStep += 1;
  }, 400);

  updateDebugButton(true);
}

function stopMusic() {
  window.clearInterval(stepTimer);
  stepTimer = null;
  updateDebugButton(false);
}

function updateDebugButton(isPlaying) {
  musicButton.classList.toggle("is-playing", isPlaying);
  musicButton.setAttribute("aria-pressed", String(isPlaying));
  musicLabel.textContent = isPlaying ? "Stop the music" : "Play my favorite song";
}

function startWhenAllowed() {
  startMusic().catch(() => {
    document.addEventListener("pointerdown", startWhenAllowed, { once: true });
    document.addEventListener("keydown", startWhenAllowed, { once: true });
  });
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopMusic();
    return;
  }

  startWhenAllowed();
});

musicButton.addEventListener("click", () => {
  if (stepTimer) {
    stopMusic();
    return;
  }

  startWhenAllowed();
});

scrapCards.forEach((card) => {
  card.addEventListener("mouseenter", () => {
    card.style.setProperty("--card-curve-soft", randomDegree(10, 42));
    card.style.setProperty("--card-curve-line", randomDegree(-42, -10));
  });
});

randomizeCurveRotations();
startWhenAllowed();
