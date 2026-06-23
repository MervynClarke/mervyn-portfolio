import { EXERCISES } from '../data/exercises.js';

const GROUPS = [
  { key: 'steady', title: 'Steady', note: 'Sustainable rhythm — the backbone of endurance work.' },
  { key: 'cardio', title: 'Cardio', note: 'Heart-rate movers, great for intervals.' },
  { key: 'power', title: 'Power', note: 'Explosive, higher-skill bursts. Keep them short.' },
  { key: 'recovery', title: 'Recovery', note: 'Active rest — keep the rope moving, effort low.' },
];

export default function Library() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-8 md:py-12">
      <h1 className="font-display text-3xl font-bold tracking-tight">The moves</h1>
      <p className="mt-2 text-muted">Every exercise the generator can pull from, grouped by how it's used.</p>

      {GROUPS.map(({ key, title, note }) => {
        const items = EXERCISES.filter((e) => e.type === key);
        const accent = key === 'recovery' ? '#D99A3C' : '#34D399';
        return (
          <section key={key} className="mt-9">
            <div className="flex items-baseline gap-3">
              <h2 className="font-display text-xl font-semibold">{title}</h2>
              <span className="text-sm text-muted">{note}</span>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {items.map((e) => (
                <div key={e.id} className="rounded-2xl border border-line bg-surface p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-semibold">{e.name}</h3>
                    <span className="flex gap-1" aria-label={`Intensity ${e.intensity} of 3`}>
                      {[1, 2, 3].map((n) => (
                        <span
                          key={n}
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ background: n <= e.intensity ? accent : 'var(--surface-2)' }}
                        />
                      ))}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{e.cue}</p>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
