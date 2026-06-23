import { useEffect } from 'react';
import { useTimer } from '../hooks/useTimer.js';
import ProgressRing from './ProgressRing.jsx';
import { totalRounds } from '../lib/workoutGenerator.js';
import { Play, Pause, SkipForward, SkipBack, X } from 'lucide-react';

export default function WorkoutPlayer({ workout, onComplete, onQuit }) {
  const timer = useTimer(workout.segments, { onComplete });
  const { current, next, remaining, fraction, running, done } = timer;

  const isWork = current?.kind === 'work';
  const accent = isWork ? '#34D399' : '#D99A3C';
  const totalR = totalRounds(workout);

  // Keyboard controls: space toggles, arrows skip.
  useEffect(() => {
    const onKey = (e) => {
      if (e.code === 'Space') { e.preventDefault(); timer.toggle(); }
      if (e.code === 'ArrowRight') timer.skipNext();
      if (e.code === 'ArrowLeft') timer.skipPrev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [timer]);

  useEffect(() => { if (done) onComplete(); }, [done, onComplete]);

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-2xl flex-col px-5 py-6">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <span
          className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider"
          style={{ background: `${accent}1a`, color: accent }}
        >
          {isWork ? `Round ${current.round} of ${totalR}` : 'Recovery'}
        </span>
        <button
          onClick={onQuit}
          className="flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-text"
        >
          <X size={16} /> End
        </button>
      </div>

      {/* Ring */}
      <div className="flex flex-1 flex-col items-center justify-center gap-7 py-6">
        <ProgressRing
          fraction={fraction}
          seconds={remaining}
          accent={accent}
          running={running}
          label={isWork ? 'work' : 'rest'}
        />

        <div className="text-center">
          <h1 className="font-display text-3xl font-bold tracking-tight">{current.exercise.name}</h1>
          <p className="mx-auto mt-2 max-w-md text-muted">{current.exercise.cue}</p>
        </div>

        {next && (
          <div className="rounded-full border border-line bg-surface px-4 py-2 text-sm text-muted">
            Next · <span className="font-medium text-text">{next.exercise.name}</span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-5 pb-4">
        <button
          onClick={timer.skipPrev}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-surface text-text transition-colors hover:bg-surface-2"
          aria-label="Previous segment"
        >
          <SkipBack size={20} />
        </button>
        <button
          onClick={timer.toggle}
          className="flex h-20 w-20 items-center justify-center rounded-full text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
          style={{ background: accent }}
          aria-label={running ? 'Pause' : 'Start'}
        >
          {running ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
        </button>
        <button
          onClick={timer.skipNext}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-surface text-text transition-colors hover:bg-surface-2"
          aria-label="Next segment"
        >
          <SkipForward size={20} />
        </button>
      </div>
      <p className="text-center text-xs text-muted">
        Space to play/pause · arrow keys to skip
      </p>
    </div>
  );
}
