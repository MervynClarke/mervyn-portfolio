"use client";

import { useEffect, useState, useRef } from "react";

function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}

export function useCountUp(
  target: number,
  duration: number = 2000,
  shouldStart: boolean = false
): number {
  const [value, setValue] = useState(0);
  const startTime = useRef<number | null>(null);
  const rafId = useRef<number>(0);

  useEffect(() => {
    if (!shouldStart) return;

    startTime.current = null;

    const animate = (timestamp: number) => {
      if (startTime.current === null) startTime.current = timestamp;
      const elapsed = timestamp - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);

      setValue(Math.floor(easedProgress * target));

      if (progress < 1) {
        rafId.current = requestAnimationFrame(animate);
      } else {
        setValue(target);
      }
    };

    rafId.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId.current);
  }, [target, duration, shouldStart]);

  return value;
}
