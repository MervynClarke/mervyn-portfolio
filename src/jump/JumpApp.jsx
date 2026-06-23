"use client";

import { useState, useCallback } from 'react';
import Header from './components/Header.jsx';
import Home from './components/Home.jsx';
import WorkoutSetup from './components/WorkoutSetup.jsx';
import StretchReminder from './components/StretchReminder.jsx';
import WorkoutPlayer from './components/WorkoutPlayer.jsx';
import WorkoutComplete from './components/WorkoutComplete.jsx';
import Library from './components/Library.jsx';

// View flow:
//  home → setup → warmup → player → cooldown → complete
//  (library is a standalone reference view)
//
// Theme is intentionally NOT managed here — the app lives inside the portfolio,
// which already controls light/dark via the `.dark` class on <html>. The
// `.jump-app` wrapper (see globals.css) maps that to this app's surface tokens.
export default function JumpApp() {
  const [view, setView] = useState('home');
  const [workout, setWorkout] = useState(null);

  const navigate = useCallback((v) => setView(v), []);

  const beginWorkout = (w) => { setWorkout(w); setView('warmup'); };
  const restartSame = () => setView('warmup');

  return (
    <div className="jump-app flex min-h-screen flex-col">
      <Header view={view} onNavigate={navigate} />

      <main className="flex-1 pb-12">
        {view === 'home' && <Home onStart={() => setView('setup')} />}

        {view === 'setup' && <WorkoutSetup onBegin={beginWorkout} />}

        {view === 'warmup' && (
          <StretchReminder phase="warmup" onContinue={() => setView('player')} />
        )}

        {view === 'player' && workout && (
          <WorkoutPlayer
            workout={workout}
            onComplete={() => setView('cooldown')}
            onQuit={() => setView('cooldown')}
          />
        )}

        {view === 'cooldown' && (
          <StretchReminder phase="cooldown" onContinue={() => setView('complete')} />
        )}

        {view === 'complete' && workout && (
          <WorkoutComplete
            workout={workout}
            onAgain={restartSame}
            onHome={() => setView('home')}
          />
        )}

        {view === 'library' && <Library />}
      </main>
    </div>
  );
}
