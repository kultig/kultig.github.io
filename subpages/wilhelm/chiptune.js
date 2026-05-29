const musicButton = document.querySelector(".music-button");
const musicLabel = document.querySelector(".music-label");

let audioContext;
let stepTimer;
let currentStep = 0;

const melody = [
  262, 330, 392, 523, 392, 330, 294, 392,
  262, 330, 440, 587, 523, 392, 330, 294
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

function startMusic() {
  audioContext = audioContext || new AudioContext();
  currentStep = 0;

  stepTimer = window.setInterval(() => {
    playBeep(melody[currentStep % melody.length], 0.12);

    if (currentStep % 4 === 0) {
      playBeep(98, 0.07);
    }

    currentStep += 1;
  }, 150);

  musicButton.classList.add("is-playing");
  musicButton.setAttribute("aria-pressed", "true");
  musicLabel.textContent = "Musik laeuft";
}

function stopMusic() {
  window.clearInterval(stepTimer);
  stepTimer = null;
  musicButton.classList.remove("is-playing");
  musicButton.setAttribute("aria-pressed", "false");
  musicLabel.textContent = "8-bit Musik";
}

musicButton.addEventListener("click", async () => {
  if (audioContext?.state === "suspended") {
    await audioContext.resume();
  }

  if (stepTimer) {
    stopMusic();
  } else {
    startMusic();
  }
});
