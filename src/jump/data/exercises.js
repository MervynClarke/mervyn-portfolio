// The exercise library.
// `type` groups moves so the generator can build different training styles.
//   steady  – sustainable rhythm work (endurance backbone)
//   cardio  – higher heart-rate movers (good for intervals)
//   power   – explosive / high-skill bursts (short, intense)
//   recovery– active rest, rope still moving but low effort
// `intensity` is a rough 1–3 scale used to balance a session.

export const EXERCISES = [
  { id: 'basic-bounce',   name: 'Basic Bounce',      type: 'steady',   intensity: 1, cue: 'Small two-foot hops. Rope passes once per jump, stay light on the balls of your feet.' },
  { id: 'alt-foot',       name: 'Alternate-Foot Step', type: 'steady', intensity: 1, cue: 'Jog in place over the rope, shifting weight foot to foot.' },
  { id: 'boxer-skip',     name: 'Boxer Skip',        type: 'steady',   intensity: 1, cue: 'Shuffle weight side to side and settle into an easy rhythm.' },
  { id: 'heel-taps',      name: 'Heel Taps',         type: 'steady',   intensity: 1, cue: 'Tap one heel forward each jump, alternating feet.' },
  { id: 'free-skip',      name: 'Free Skip',         type: 'steady',   intensity: 1, cue: 'Your call — keep the rope turning at a comfortable pace.' },

  { id: 'high-knees',     name: 'High Knees',        type: 'cardio',   intensity: 3, cue: 'Drive each knee to hip height. Quick feet, tall chest.' },
  { id: 'skier',          name: 'Side-to-Side Skier', type: 'cardio',  intensity: 2, cue: 'Feet together, hop side to side over an imaginary line.' },
  { id: 'front-back',     name: 'Front-to-Back',     type: 'cardio',   intensity: 2, cue: 'Feet together, hop forward and back over a line.' },
  { id: 'mummy-kicks',    name: 'Mummy Kicks',       type: 'cardio',   intensity: 2, cue: 'Alternate light front kicks while you skip.' },
  { id: 'jack-jump',      name: 'Jumping-Jack Jump', type: 'cardio',   intensity: 2, cue: 'Feet out, feet in, in time with the rope.' },

  { id: 'double-unders',  name: 'Double Unders',     type: 'power',    intensity: 3, cue: 'One taller jump, two rope passes. Snap from the wrists.' },
  { id: 'criss-cross',    name: 'Criss-Cross',       type: 'power',    intensity: 3, cue: 'Cross the arms on the downswing, open on the next jump.' },
  { id: 'single-leg',     name: 'Single-Leg Hops',   type: 'power',    intensity: 3, cue: 'Balance and hop on one foot. Switch legs halfway.' },

  { id: 'side-swings',    name: 'Side Swings',       type: 'recovery', intensity: 1, cue: 'No jumping — swing the rope at your side and catch your breath.' },
];

export const REST = {
  id: 'rest', name: 'Rest', type: 'rest', intensity: 0,
  cue: 'Shake out the legs, breathe, sip water. Reset for the next round.',
};

export const byType = (type) => EXERCISES.filter((e) => e.type === type);
export const findExercise = (id) => EXERCISES.find((e) => e.id === id) || REST;

// Stretch routines shown before and after every workout.
export const WARMUP_STRETCHES = [
  'Wrist & ankle circles — 20 sec',
  'Arm swings, forward and back — 20 sec',
  'Leg swings, each side — 20 sec',
  'Light marching or jogging in place — 30 sec',
  'A few easy bounces without the rope',
];

export const COOLDOWN_STRETCHES = [
  'Standing calf stretch — 30 sec each leg',
  'Quad stretch — 30 sec each leg',
  'Forward fold for hamstrings — 30 sec',
  'Shoulder & wrist rolls — 30 sec',
  'Slow deep breaths until your heart rate settles',
];
