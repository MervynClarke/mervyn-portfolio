import { WARMUP_STRETCHES, COOLDOWN_STRETCHES } from '../data/exercises.js';
import { Wind, CheckCircle2, ArrowRight } from 'lucide-react';

export default function StretchReminder({ phase, onContinue }) {
  const warmup = phase === 'warmup';
  const list = warmup ? WARMUP_STRETCHES : COOLDOWN_STRETCHES;
  const accent = warmup ? '#34D399' : '#D99A3C';

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col justify-center px-5 py-10">
      <div className="animate-floatIn rounded-2xl border border-line bg-surface p-7 text-center">
        <span
          className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
          style={{ background: `${accent}1a`, color: accent }}
        >
          {warmup ? <Wind size={26} /> : <CheckCircle2 size={26} />}
        </span>
        <h1 className="font-display text-2xl font-bold">
          {warmup ? 'Warm up first' : 'Cool down'}
        </h1>
        <p className="mt-2 text-muted">
          {warmup
            ? 'A minute of mobility now protects your ankles, knees, and wrists.'
            : "Nice work. Ease your heart rate down and stretch out what you just trained."}
        </p>

        <ul className="mt-6 space-y-2 text-left">
          {list.map((item, i) => (
            <li key={i} className="flex items-start gap-3 rounded-xl bg-surface-2 px-4 py-3 text-sm">
              <span className="mt-0.5 font-display text-xs font-bold" style={{ color: accent }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              {item}
            </li>
          ))}
        </ul>

        <button
          onClick={onContinue}
          className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full py-3.5 font-semibold text-white transition-transform hover:scale-[1.01] active:scale-95"
          style={{ background: accent }}
        >
          {warmup ? "I'm warmed up — let's go" : 'Finish & see summary'} <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
