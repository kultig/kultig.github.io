let audioContext;
let stepTimer;
let currentStep = 0;
const musicButton = document.querySelector(".music-button");
const musicLabel = document.querySelector(".music-label");

const melody = [
  247, 220, 196, 294, 294, 294, 247, 220, 196,
  330, 330, 330, 220, 262, 330, 294, 294, 294,
  294, 294, 262, 247, 247, 247, 247, 220, 196,
  294, 294, 294, 247, 220, 196, 330, 330, 330,
  220, 262, 330, 294, 294, 392, 247, 247, 220,
  196, 196, 196,
];

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
  musicLabel.textContent = isPlaying ? "Play my favorite song" : "Stop the music";
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

startWhenAllowed();
