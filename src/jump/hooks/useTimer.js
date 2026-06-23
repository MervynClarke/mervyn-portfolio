import { useCallback, useEffect, useRef, useState } from 'react';
import { sound } from '../lib/sound.js';

/**
 * Drives a workout made of timed segments.
 * Uses a timestamp-based loop (not naive setInterval counting) so the clock
 * stays accurate even when the tab is throttled.
 */
export function useTimer(segments, { onComplete } = {}) {
  const [index, setIndex] = useState(0);
  const [remaining, setRemaining] = useState(segments[0]?.seconds ?? 0);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  const deadlineRef = useRef(null);
  const rafRef = useRef(null);
  const lastWholeRef = useRef(remaining);

  const current = segments[index];
  const next = segments[index + 1];

  const goTo = useCallback((i) => {
    const clamped = Math.max(0, Math.min(i, segments.length - 1));
    setIndex(clamped);
    setRemaining(segments[clamped].seconds);
    lastWholeRef.current = segments[clamped].seconds;
    deadlineRef.current = running ? performance.now() + segments[clamped].seconds * 1000 : null;
  }, [segments, running]);

  const advance = useCallback(() => {
    setIndex((i) => {
      const ni = i + 1;
      if (ni >= segments.length) {
        setRunning(false);
        setDone(true);
        sound.finish();
        onComplete?.();
        return i;
      }
      const seg = segments[ni];
      setRemaining(seg.seconds);
      lastWholeRef.current = seg.seconds;
      deadlineRef.current = performance.now() + seg.seconds * 1000;
      sound.go();
      return ni;
    });
  }, [segments, onComplete]);

  // Animation-frame loop.
  useEffect(() => {
    if (!running) return;
    if (deadlineRef.current == null) {
      deadlineRef.current = performance.now() + remaining * 1000;
    }
    const tick = () => {
      const msLeft = deadlineRef.current - performance.now();
      const secLeft = Math.max(0, msLeft / 1000);
      setRemaining(secLeft);

      const whole = Math.ceil(secLeft);
      if (whole < lastWholeRef.current) {
        lastWholeRef.current = whole;
        if (whole > 0 && whole <= 3) sound.tick();
      }
      if (msLeft <= 0) { advance(); return; }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // `index` is included so the loop restarts on each segment: when advance()
    // moves to the next segment the effect re-runs and resumes ticking.
  }, [running, advance, index]); // eslint-disable-line react-hooks/exhaustive-deps

  const start = useCallback(() => {
    if (done) return;
    sound.unlock();
    deadlineRef.current = performance.now() + remaining * 1000;
    setRunning(true);
  }, [remaining, done]);

  const pause = useCallback(() => {
    setRunning(false);
    deadlineRef.current = null;
    setRemaining((r) => Math.ceil(r)); // snap to whole seconds while paused
  }, []);

  const toggle = useCallback(() => (running ? pause() : start()), [running, pause, start]);

  const restart = useCallback(() => {
    setRunning(false);
    setDone(false);
    deadlineRef.current = null;
    goTo(0);
  }, [goTo]);

  return {
    index, current, next,
    remaining: Math.ceil(remaining),
    fraction: current ? 1 - remaining / current.seconds : 0,
    running, done,
    total: segments.length,
    start, pause, toggle, restart,
    skipNext: () => advance(),
    skipPrev: () => goTo(index - 1),
  };
}
