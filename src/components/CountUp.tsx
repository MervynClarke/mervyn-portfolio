"use client";

import { useInView } from "@/hooks/useInView";
import { useCountUp } from "@/hooks/useCountUp";

interface CountUpProps {
  target: number;
  prefix?: string;
  suffix?: string;
  label: string;
  duration?: number;
}

function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

export default function CountUp({
  target,
  prefix = "",
  suffix = "",
  label,
  duration = 2000,
}: CountUpProps) {
  const { ref, isInView } = useInView({ threshold: 0.5 });
  const value = useCountUp(target, duration, isInView);

  return (
    <div ref={ref} className="text-center">
      <p className="font-display text-3xl md:text-4xl font-bold text-tea-amber dark:text-tea-amber-light break-words">
        {prefix}
        {formatNumber(value)}
        {suffix}
      </p>
      <p className="mt-2 text-xs md:text-sm font-sans text-charcoal/70 dark:text-ceramic-white/60">
        {label}
      </p>
    </div>
  );
}
