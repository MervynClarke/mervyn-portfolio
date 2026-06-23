import { Home, Dumbbell, ListChecks } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

const NAV = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'setup', label: 'Workout', icon: Dumbbell },
  { id: 'library', label: 'Moves', icon: ListChecks },
];

export default function Header({ view, onNavigate }) {
  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto max-w-4xl px-5">
        {/* Brand + theme toggle, centered together */}
        <div className="flex items-center justify-center gap-3 pt-7">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-coral text-white font-display text-lg font-bold">
            ↻
          </span>
          <span className="font-display text-2xl font-bold tracking-tight">Jump Work</span>
          <ThemeToggle />
        </div>

        {/* Centered nav */}
        <nav className="flex items-center justify-center gap-2 py-4">
          {NAV.map(({ id, label, icon: Icon }) => {
            const active = view === id || (id === 'setup' && ['warmup', 'player', 'cooldown', 'complete'].includes(view));
            return (
              <button
                key={id}
                onClick={() => onNavigate(id)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  active ? 'bg-coral/10 text-coral' : 'text-muted hover:bg-surface-2 hover:text-text'
                }`}
              >
                <Icon size={18} /> {label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
