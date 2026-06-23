import { Timer, Shuffle, HeartPulse, ArrowRight } from 'lucide-react';

const FEATURES = [
  { icon: Timer, title: 'Timed, hands-free', body: 'Pick a length and the app counts every round, rest, and cue out loud so you can keep your eyes on the rope.' },
  { icon: Shuffle, title: 'Never the same twice', body: 'Sequences are generated fresh each session, so the work stays varied and you stay engaged.' },
  { icon: HeartPulse, title: 'Train with intent', body: 'Choose endurance, explosive, or interval — each reshapes the work-to-rest rhythm.' },
];

export default function Home({ onStart }) {
  return (
    <div className="mx-auto max-w-4xl px-5 py-10 md:py-16">
      <section className="animate-floatIn">
        <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
          Find your <span className="text-coral">cadence</span>.
          <br />One rope, one timer, zero guesswork.
        </h1>
        <p className="mt-5 max-w-xl text-base text-muted md:text-lg">
          Choose how long you've got — 10 to 30 minutes — and a training style. We'll
          build the workout, walk you through every move, and remind you to stretch.
        </p>
        <button
          onClick={onStart}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-coral px-7 py-3.5 font-semibold text-white transition-transform hover:scale-[1.02] active:scale-95"
        >
          Start a workout <ArrowRight size={18} />
        </button>
      </section>

      <section className="mt-16 grid gap-4 sm:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, body }) => (
          <div key={title} className="rounded-2xl border border-line bg-surface p-5">
            <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-coral/10 text-coral">
              <Icon size={20} />
            </span>
            <h3 className="font-display text-lg font-semibold">{title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{body}</p>
          </div>
        ))}
      </section>

      <section className="mt-12 rounded-2xl border border-line bg-surface-2 p-6">
        <h2 className="font-display text-xl font-semibold">How a session runs</h2>
        <ol className="mt-4 grid gap-3 sm:grid-cols-4">
          {['Warm up with a quick mobility check', 'Work through timed rounds with rest', 'Cool down with guided stretches', 'See your summary and go again'].map((step, i) => (
            <li key={i} className="flex gap-3 text-sm text-muted">
              <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-coral font-display text-xs font-bold text-white">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
