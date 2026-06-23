import { TRAINING_TYPES, totalRounds } from '../lib/workoutGenerator.js';
import { Trophy, RotateCcw, Home as HomeIcon } from 'lucide-react';

export default function WorkoutComplete({ workout, onAgain, onHome }) {
  const minutes = Math.round(workout.totalSeconds / 60);
  const rounds = totalRounds(workout);
  const style = TRAINING_TYPES[workout.type]?.label ?? '';

  const stats = [
    { value: `${minutes}`, label: 'minutes' },
    { value: `${rounds}`, label: 'rounds' },
    { value: style, label: 'style' },
  ];

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col justify-center px-5 py-10">
      <div className="animate-floatIn rounded-2xl border border-line bg-surface p-8 text-center">
        <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-coral/10 text-coral">
          <Trophy size={30} />
        </span>
        <h1 className="font-display text-3xl font-bold">Workout done</h1>
        <p className="mt-2 text-muted">You stretched, you skipped, you finished. That's the whole loop.</p>

        <div className="mt-7 grid grid-cols-3 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl bg-surface-2 py-4">
              <div className="font-display text-2xl font-bold text-coral">{s.value}</div>
              <div className="text-xs uppercase tracking-wider text-muted">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-7 flex gap-3">
          <button
            onClick={onHome}
            className="flex flex-1 items-center justify-center gap-2 rounded-full border border-line py-3 font-semibold transition-colors hover:bg-surface-2"
          >
            <HomeIcon size={18} /> Home
          </button>
          <button
            onClick={onAgain}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-coral py-3 font-semibold text-white transition-transform hover:scale-[1.02] active:scale-95"
          >
            <RotateCcw size={18} /> Go again
          </button>
        </div>
      </div>
    </div>
  );
}
