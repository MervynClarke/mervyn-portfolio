// The focus lengths offered on the home screen, in minutes. Kept deliberately
// short and few — the whole point of Just Work is to pick one and start.
export const WORK_OPTIONS = [2, 10, 15, 20, 30];

// Each focus block earns a proportional break (~1/5 of the work, floored at 1).
// Spelled out as a map so the pairing is obvious and easy to tweak.
const BREAKS = { 2: 1, 10: 2, 15: 3, 20: 4, 30: 5 };

export function breakFor(workMinutes) {
  return BREAKS[workMinutes] ?? Math.max(1, Math.round(workMinutes / 5));
}

// mm:ss for the ring readout (durations run up to 30 minutes).
export function formatTime(totalSeconds) {
  const s = Math.max(0, Math.ceil(totalSeconds));
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, '0')}`;
}
