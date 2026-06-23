// Lightweight audio cues using the Web Audio API — no asset files needed.
// A short higher beep counts down the final seconds; a longer lower tone
// marks the start of a new segment.

let ctx = null;
function audioCtx() {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  // Browsers suspend audio until a user gesture; resume on demand.
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function beep(frequency, duration, volume = 0.15) {
  const ac = audioCtx();
  if (!ac) return;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = 'sine';
  osc.frequency.value = frequency;
  gain.gain.setValueAtTime(volume, ac.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + duration);
  osc.connect(gain).connect(ac.destination);
  osc.start();
  osc.stop(ac.currentTime + duration);
}

export const sound = {
  tick: () => beep(880, 0.12),       // final-seconds countdown
  go: () => beep(660, 0.28, 0.2),    // new work/rest segment begins
  finish: () => {                    // workout complete fanfare
    beep(523, 0.18); setTimeout(() => beep(659, 0.18), 160);
    setTimeout(() => beep(784, 0.32), 320);
  },
  // Call once from a user gesture to unlock audio on mobile browsers.
  unlock: () => audioCtx(),
};
