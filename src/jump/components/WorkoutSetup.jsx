import { useMemo, useState } from 'react';
import { TRAINING_TYPES, generateWorkout, totalRounds } from '../lib/workoutGenerator.js';
import { RefreshCw, Play } from 'lucide-react';

const DURATIONS = [10, 15, 20, 30];

const fmt = (s) => {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return r ? `${m}:${String(r).padStart(2, '0')}` : `${m} min`;
};

export default function WorkoutSetup({ onBegin }) {
  const [minutes, setMinutes] = useState(15);
  const [type, setType] = useState('interval');
  const [seed, setSeed] = useState(() => Date.now());

  const workout = useMemo(() => generateWorkout(minutes, type, seed), [minutes, type, seed]);

  return (
    <div className="mx-auto max-w-4xl px-5 py-8 md:py-12">
      <h1 className="font-display text-3xl font-bold tracking-tight">Build your workout</h1>
      <p className="mt-2 text-muted">Pick a length and a style. Preview updates live.</p>

      {/* Duration */}
      <fieldset className="mt-8">
        <legend className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">Length</legend>
        <div className="grid grid-cols-4 gap-3">
          {DURATIONS.map((m) => (
            <button
              key={m}
              onClick={() => setMinutes(m)}
              aria-pressed={minutes === m}
              className={`rounded-2xl border py-5 text-center transition-all ${
                minutes === m
                  ? 'border-coral bg-coral/10'
                  : 'border-line bg-surface hover:border-coral/40'
              }`}
            >
              <span className="font-display text-2xl font-bold">{m}</span>
              <span className="block text-xs text-muted">minutes</span>
            </button>
          ))}
        </div>
      </fieldset>

      {/* Training style */}
      <fieldset className="mt-8">
        <legend className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">Style</legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {Object.entries(TRAINING_TYPES).map(([key, t]) => (
            <button
              key={key}
              onClick={() => setType(key)}
              aria-pressed={type === key}
              className={`rounded-2xl border p-4 text-left transition-all ${
                type === key ? 'border-coral bg-coral/10' : 'border-line bg-surface hover:border-coral/40'
              }`}
            >
              <span className="font-display text-lg font-semibold">{t.label}</span>
              <span className="mt-1 block text-sm leading-snug text-muted">{t.tagline}</span>
            </button>
          ))}
        </div>
      </fieldset>

      {/* Preview */}
      <div className="mt-8 rounded-2xl border border-line bg-surface">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div>
            <h2 className="font-display text-lg font-semibold">Session preview</h2>
            <p className="text-sm text-muted">
              {totalRounds(workout)} rounds · {fmt(workout.totalSeconds)} of work
            </p>
          </div>
          <button
            onClick={() => setSeed(Date.now())}
            className="flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-medium transition-colors hover:bg-surface-2"
          >
            <RefreshCw size={15} /> Shuffle
          </button>
        </div>
        <ol className="max-h-72 overflow-y-auto px-5 py-3">
          {workout.segments.map((seg, i) => {
            const work = seg.kind === 'work';
            return (
              <li key={i} className="flex items-center gap-3 py-1.5 text-sm">
                <span
                  className="h-2 w-2 flex-none rounded-full"
                  style={{ background: work ? '#34D399' : '#D99A3C' }}
                />
                <span className={work ? 'font-medium' : 'text-muted'}>{seg.exercise.name}</span>
                <span className="ml-auto tnum text-muted">{fmt(seg.seconds)}</span>
              </li>
            );
          })}
        </ol>
      </div>

      <button
        onClick={() => onBegin(workout)}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-coral py-4 font-semibold text-white transition-transform hover:scale-[1.01] active:scale-95"
      >
        <Play size={18} /> Warm up & start
      </button>
    </div>
  );
}
