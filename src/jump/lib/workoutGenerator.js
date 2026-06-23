import { EXERCISES, REST, byType } from '../data/exercises.js';

// Training-style profiles. Each describes the shape of a round:
//   work    – seconds of effort
//   rest    – seconds of recovery between rounds
//   pools   – which exercise groups to draw from (weighted by repetition)
//   activeRest – use Side Swings instead of full Rest (keeps the rope moving)
export const TRAINING_TYPES = {
  endurance: {
    label: 'Endurance',
    tagline: 'Long, steady rounds. Build a engine you can rely on.',
    work: [45, 60],
    rest: [15, 20],
    pools: ['steady', 'steady', 'cardio'],
    activeRest: true,
  },
  explosive: {
    label: 'Explosive',
    tagline: 'Short maximal bursts with full recovery. Train power and speed.',
    work: [20, 30],
    rest: [30, 40],
    pools: ['power', 'power', 'cardio'],
    activeRest: false,
  },
  interval: {
    label: 'Interval',
    tagline: 'Classic HIIT. Alternate hard and easy in even rounds.',
    work: [30, 40],
    rest: [20, 30],
    pools: ['cardio', 'steady', 'power'],
    activeRest: false,
  },
};

// Small seeded RNG so a given seed reproduces the same workout (handy for
// "regenerate" giving fresh variety while staying testable).
function makeRng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}
const pick = (rng, arr) => arr[Math.floor(rng() * arr.length)];
const between = (rng, [lo, hi]) => Math.round(lo + rng() * (hi - lo));

/**
 * Generate a workout.
 * @param {number} minutes   10 | 15 | 20 | 30
 * @param {string} typeKey   'endurance' | 'explosive' | 'interval'
 * @param {number} [seed]    optional seed for reproducible variety
 * @returns {{ segments: Array, totalSeconds: number, type: string, minutes: number }}
 */
export function generateWorkout(minutes, typeKey, seed = Date.now()) {
  const profile = TRAINING_TYPES[typeKey];
  if (!profile) throw new Error(`Unknown training type: ${typeKey}`);

  const rng = makeRng(seed);
  const target = minutes * 60;
  const segments = [];
  let elapsed = 0;
  let lastExerciseId = null;
  let poolIndex = 0;

  // Build a shuffled queue from a pool group, refilling as needed, and never
  // repeat the same exercise back-to-back so sequences feel varied.
  const drawExercise = (poolName) => {
    const pool = byType(poolName);
    const choices = pool.filter((e) => e.id !== lastExerciseId);
    const exercise = pick(rng, choices.length ? choices : pool);
    lastExerciseId = exercise.id;
    return exercise;
  };

  while (elapsed < target - 5) {
    const poolName = profile.pools[poolIndex % profile.pools.length];
    poolIndex += 1;

    let workSec = between(rng, profile.work);
    // Don't overshoot the target with the work block.
    workSec = Math.min(workSec, target - elapsed);
    if (workSec < 10) break; // not enough time left for a meaningful round

    const exercise = drawExercise(poolName);
    segments.push({ kind: 'work', exercise, seconds: workSec });
    elapsed += workSec;

    // Add a rest block if there's room and it isn't the very end.
    let restSec = between(rng, profile.rest);
    restSec = Math.min(restSec, target - elapsed);
    if (restSec >= 8 && elapsed < target) {
      const restMove = profile.activeRest
        ? EXERCISES.find((e) => e.id === 'side-swings')
        : REST;
      segments.push({ kind: 'rest', exercise: restMove, seconds: restSec });
      elapsed += restSec;
    }
  }

  // Top up any small remainder onto the last segment so totals are exact.
  const remainder = target - elapsed;
  if (remainder > 0 && segments.length) {
    segments[segments.length - 1].seconds += remainder;
    elapsed = target;
  }

  // Attach round numbers for display.
  let round = 0;
  for (const seg of segments) {
    if (seg.kind === 'work') round += 1;
    seg.round = round;
  }

  return { segments, totalSeconds: elapsed, type: typeKey, minutes };
}

export const totalRounds = (workout) =>
  workout.segments.filter((s) => s.kind === 'work').length;
