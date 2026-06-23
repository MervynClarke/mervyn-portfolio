import { useCallback, useEffect, useRef, useState } from 'react';
import { sound } from '../lib/sound.js';

/**
 * Counts a single duration down to zero.
 *
 * Uses a timestamp-based loop (not naive setInterval counting) so the clock
 * stays accurate even when the tab is throttled in the background. The parent
 * owns the phase flow (focus → break); this hook just runs one stretch of
 * time and fires `onComplete` when it lands on zero.
 *
 * When `durationSeconds` changes (e.g. focus rolls into a break) the timer
 * resets to the new length and auto-starts when `autoStart` is true.
 */
export function useCountdown(durationSeconds, { onComplete, autoStart = false } = {}) {
  const [remaining, setRemaining] = useState(durationSeconds);
  const [running, setRunning] = useState(autoStart);

  const deadlineRef = useRef(null);
  const rafRef = useRef(null);
  const lastWholeRef = useRef(durationSeconds);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Re-arm whenever the target duration (the phase) changes.
  useEffect(() => {
    setRemaining(durationSeconds);
    lastWholeRef.current = durationSeconds;
    setRunning(autoStart);
    deadlineRef.current = autoStart ? performance.now() + durationSeconds * 1000 : null;
  }, [durationSeconds, autoStart]);

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
      if (msLeft <= 0) {
        setRunning(false);
        deadlineRef.current = null;
        onCompleteRef.current?.();
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [running]); // eslint-disable-line react-hooks/exhaustive-deps

  const start = useCallback(() => {
    sound.unlock();
    deadlineRef.current = performance.now() + remaining * 1000;
    setRunning(true);
  }, [remaining]);

  const pause = useCallback(() => {
    setRunning(false);
    deadlineRef.current = null;
    setRemaining((r) => Math.ceil(r)); // snap to whole seconds while paused
  }, []);

  const toggle = useCallback(() => (running ? pause() : start()), [running, pause, start]);

  const reset = useCallback(() => {
    setRunning(false);
    deadlineRef.current = null;
    setRemaining(durationSeconds);
    lastWholeRef.current = durationSeconds;
  }, [durationSeconds]);

  return {
    remaining,
    fraction: durationSeconds ? 1 - remaining / durationSeconds : 0,
    running,
    start, pause, toggle, reset,
  };
}
