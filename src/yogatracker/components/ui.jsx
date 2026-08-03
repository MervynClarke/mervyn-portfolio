"use client";
// Shared primitives for /YogaTracker. The Tailwind tokens bg/surface/surface-2/
// line/text/muted resolve to CSS vars scoped on .yogatracker-app (globals.css),
// so everything here follows the site's light/dark toggle. Same surfaces as
// /TeaTasting; the accent is sage rather than amber.
import { forwardRef, useEffect, useRef, useState } from "react";

const inputCls =
  "w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-[15px] text-text placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-yoga-sage/50 min-h-[44px]";

export function TextInput({ className = "", ...props }) {
  return <input {...props} className={`${inputCls} ${className}`} />;
}

export function TextArea({ className = "", rows = 3, ...props }) {
  return <textarea rows={rows} {...props} className={`${inputCls} min-h-[72px] ${className}`} />;
}

export function Select({ options, value, onChange, className = "", ...rest }) {
  return (
    <select value={value ?? ""} onChange={onChange} {...rest} className={`${inputCls} ${className}`}>
      {options.map((o) => {
        const opt = typeof o === "string" ? { value: o, label: o } : o;
        return (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        );
      })}
    </select>
  );
}

export function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium uppercase tracking-wide text-muted mb-1">
        {label}
        {hint && <span className="normal-case font-normal ml-2 tracking-normal">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

/** Single-select chip row. Tapping the active chip clears it. */
export function Chips({ options, value, onChange, ariaLabel, size = "md" }) {
  const pad = size === "sm" ? "px-2.5 py-1.5 min-h-[36px] text-[13px]" : "px-3 py-2 min-h-[44px] text-sm";
  return (
    <div role="radiogroup" aria-label={ariaLabel} className="flex flex-wrap gap-1.5">
      {options.map((o) => {
        const opt = typeof o === "string" ? { value: o, label: o } : o;
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(active ? "" : opt.value)}
            className={`${pad} rounded-lg border transition-colors ${
              active
                ? "border-yoga-sage bg-yoga-sage/15 text-text font-medium"
                : "border-line bg-surface text-muted hover:border-yoga-sage/60 hover:text-text"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/** Multi-select chip row, backed by an array. */
export function MultiChips({ options, values = [], onChange, ariaLabel }) {
  const set = new Set(values);
  return (
    <div role="group" aria-label={ariaLabel} className="flex flex-wrap gap-1.5">
      {options.map((label) => {
        const active = set.has(label);
        return (
          <button
            key={label}
            type="button"
            aria-pressed={active}
            onClick={() =>
              onChange(active ? values.filter((v) => v !== label) : [...values, label])
            }
            className={`px-2.5 py-1.5 min-h-[36px] rounded-lg border text-[13px] transition-colors ${
              active
                ? "border-yoga-sage bg-yoga-sage/15 text-text font-medium"
                : "border-line bg-surface text-muted hover:border-yoga-sage/60 hover:text-text"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

export function Button({ variant = "primary", className = "", ...props }) {
  const styles = {
    primary: "bg-yoga-sage text-white hover:bg-yoga-sage-deep border border-transparent",
    ghost: "bg-transparent text-text border border-line hover:border-yoga-sage/60",
    subtle: "bg-surface-2 text-text border border-transparent hover:border-line",
    danger:
      "bg-transparent text-red-700 dark:text-red-400 border border-red-300 dark:border-red-900 hover:bg-red-500/10",
  };
  return (
    <button
      type="button"
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 min-h-[44px] text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${styles[variant]} ${className}`}
    />
  );
}

// forwardRef so callers can scroll a freshly-created card into view.
export const Card = forwardRef(function Card({ className = "", children, ...rest }, ref) {
  return (
    <section
      ref={ref}
      {...rest}
      className={`rounded-xl border border-line bg-surface shadow-sm ${className}`}
    >
      {children}
    </section>
  );
});

/** Bottom sheet on mobile, centered dialog on desktop. */
export function Sheet({ open, onClose, title, children }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    document.body.style.overflow = "hidden";
    ref.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center" role="presentation">
      <div className="absolute inset-0 bg-black/45" onClick={onClose} aria-hidden="true" />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className="relative w-full sm:max-w-md max-h-[85vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl border border-line bg-surface p-4 pb-6 shadow-xl animate-floatIn focus:outline-none"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-lg font-semibold">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="min-h-[44px] min-w-[44px] rounded-lg text-muted hover:bg-surface-2 text-xl"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/** Transient confirmation, bottom-center. Announced politely. */
export function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[80] rounded-full border border-line bg-surface px-4 py-2.5 text-sm shadow-lg animate-floatIn max-w-[90vw]"
    >
      {toast.message}
    </div>
  );
}

export function useToast() {
  const [toast, setToast] = useState(null);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const show = (message) => {
    clearTimeout(timer.current);
    setToast({ message, id: Date.now() });
    timer.current = setTimeout(() => setToast(null), 2600);
  };
  return [toast, show];
}
