"use client";

import { useCallback, useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, X } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import TimerRing from './components/TimerRing.jsx';
import { useCountdown } from './hooks/useCountdown.js';
import { sound } from './lib/sound.js';
import { WORK_OPTIONS, breakFor, formatTime } from './data/durations.js';

const FOCUS_ACCENT = '#34D399'; // green = focus
const BREAK_ACCENT = '#D99A3C'; // gold = break

// Phase flow:  idle → focus → break → idle
//
// Theme is intentionally NOT managed here — the app lives inside the portfolio,
// which already controls light/dark via the `.dark` class on <html>. The
// `.justwork-app` wrapper (see globals.css) maps that to this app's tokens.
export default function JustWorkApp() {
  const [phase, setPhase] = useState('idle'); // 'idle' | 'focus' | 'break'
  const [workMinutes, setWorkMinutes] = useState(null);

  const duration =
    phase === 'focus' ? workMinutes * 60 :
    phase === 'break' ? breakFor(workMinutes) * 60 :
    0;

  const handleComplete = useCallback(() => {
    setPhase((p) => {
      if (p === 'focus') { sound.break(); return 'break'; }
      sound.done();
      return 'idle';
    });
  }, []);

  const timer = useCountdown(duration, {
    onComplete: handleComplete,
    autoStart: phase !== 'idle',
  });

  const startFocus = (minutes) => {
    sound.unlock();
    setWorkMinutes(minutes);
    setPhase('focus');
  };

  const endSession = () => {
    setPhase('idle');
    setWorkMinutes(null);
  };

  // Skip straight to the break (or end it early if already on break).
  const skip = () => handleComplete();

  // Space toggles play/pause while a timer is on screen.
  useEffect(() => {
    if (phase === 'idle') return;
    const onKey = (e) => {
      if (e.code === 'Space') { e.preventDefault(); timer.toggle(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, timer]);

  const isFocus = phase === 'focus';
  const accent = isFocus ? FOCUS_ACCENT : BREAK_ACCENT;

  return (
    <div className="justwork-app flex min-h-screen flex-col">
      {/* Minimal top bar — just the theme toggle, centered. */}
      <header className="flex w-full items-center justify-center px-5 pt-6">
        <ThemeToggle />
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-5 py-10">
        {phase === 'idle' ? (
          <IdleScreen onStart={startFocus} />
        ) : (
          <RunScreen
            isFocus={isFocus}
            accent={accent}
            time={formatTime(timer.remaining)}
            fraction={timer.fraction}
            running={timer.running}
            breakMinutes={breakFor(workMinutes)}
            onToggle={timer.toggle}
            onReset={timer.reset}
            onSkip={skip}
            onEnd={endSession}
          />
        )}
      </main>
    </div>
  );
}

function IdleScreen({ onStart }) {
  return (
    <div className="w-full max-w-xl text-center animate-floatIn">
      <p className="text-xs font-medium uppercase tracking-[0.25em] text-muted">Focus timer</p>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight">
        Pick a focus length
      </h1>
      <p className="mx-auto mt-3 max-w-md text-muted">
        Choose how long to work. When the timer ends, a matching break begins
        automatically — then you&apos;re back here, ready to go again.
      </p>

      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {WORK_OPTIONS.map((m) => (
          <button
            key={m}
            onClick={() => onStart(m)}
            className="group flex flex-col items-center rounded-2xl border border-line bg-surface px-4 py-6
                       transition-all hover:-translate-y-0.5 hover:border-coral hover:shadow-md"
          >
            <span className="font-display text-4xl font-bold text-text group-hover:text-coral">
              {m}
            </span>
            <span className="mt-1 text-xs font-medium uppercase tracking-wider text-muted">
              minutes
            </span>
            <span className="mt-3 text-xs text-muted">
              +{breakFor(m)} min break
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function RunScreen({
  isFocus, accent, time, fraction, running,
  breakMinutes, onToggle, onReset, onSkip, onEnd,
}) {
  return (
    <div className="flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-8">
      {/* Phase pill + end */}
      <div className="flex w-full items-center justify-between">
        <span
          className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider"
          style={{ background: `${accent}1a`, color: accent }}
        >
          {isFocus ? 'Focus' : 'Break'}
        </span>
        <button
          onClick={onEnd}
          className="flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-text"
        >
          <X size={16} /> End
        </button>
      </div>

      <TimerRing
        fraction={fraction}
        time={time}
        accent={accent}
        label={isFocus ? 'focus' : 'break'}
      />

      {isFocus && (
        <div className="rounded-full border border-line bg-surface px-4 py-2 text-sm text-muted">
          Next · <span className="font-medium text-text">{breakMinutes} min break</span>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-center gap-5">
        <button
          onClick={onReset}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-surface text-text transition-colors hover:bg-surface-2"
          aria-label="Reset timer"
        >
          <RotateCcw size={20} />
        </button>
        <button
          onClick={onToggle}
          className="flex h-20 w-20 items-center justify-center rounded-full text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
          style={{ background: accent }}
          aria-label={running ? 'Pause' : 'Start'}
        >
          {running ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
        </button>
        <button
          onClick={onSkip}
          className="flex h-12 items-center justify-center gap-1.5 rounded-full border border-line bg-surface px-4 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-text"
          aria-label={isFocus ? 'Skip to break' : 'Skip break'}
        >
          Skip
        </button>
      </div>
      <p className="text-center text-xs text-muted">Space to play / pause</p>
    </div>
  );
}
