// A clean countdown ring whose colour encodes the phase
// (green = focus, gold = break). No ornament — just the time and a label.

export default function TimerRing({ fraction, time, accent, label }) {
  const size = 300;
  const stroke = 12;
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
          style={{ transition: 'stroke-dashoffset 0.2s linear, stroke 0.3s ease' }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-display text-7xl font-bold tnum leading-none"
          style={{ color: accent }}
        >
          {time}
        </span>
        <span className="mt-3 text-xs font-medium uppercase tracking-[0.25em] text-muted">
          {label}
        </span>
      </div>
    </div>
  );
}
