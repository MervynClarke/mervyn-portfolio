// The signature element: a countdown ring whose colour encodes effort
// (green = work, gold = recovery) with a small rope-arc that swings while
// the timer runs — a nod to the turning rope.

export default function ProgressRing({ fraction, seconds, accent, label, running }) {
  const size = 280;
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = Math.min(1, Math.max(0, fraction)) * c;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke="var(--surface-2)" strokeWidth={stroke}
        />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={accent} strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - dash}
          style={{ transition: 'stroke-dashoffset 0.15s linear, stroke 0.3s ease' }}
        />
      </svg>

      {/* Centre readout */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-display text-7xl font-bold tnum leading-none"
          style={{ color: accent }}
        >
          {seconds}
        </span>
        <span className="mt-2 text-xs font-medium uppercase tracking-[0.2em] text-muted">
          {label}
        </span>
      </div>

      {/* Rope arc that swings on the beat */}
      <svg
        width={size} height={size}
        className={`pointer-events-none absolute inset-0 ${running ? 'animate-ropeSwing' : ''}`}
        style={{ transformOrigin: '50% 18%' }}
        aria-hidden="true"
      >
        <path
          d={`M ${size * 0.5} ${stroke / 2 + 2}
              Q ${size * 0.5} ${size * 0.62} ${size * 0.5} ${size - stroke / 2 - 2}`}
          fill="none" stroke={accent} strokeOpacity="0.18" strokeWidth="3"
        />
      </svg>
    </div>
  );
}
