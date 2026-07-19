"use client";
// Shared primitives for /TeaTasting. Tailwind tokens bg/surface/surface-2/
// line/text/muted resolve to CSS vars scoped on .teatasting-app (globals.css),
// so everything here follows the site's light/dark toggle.
import { useEffect, useRef, useState } from "react";

export function Panel({ title, subtitle, badge, defaultOpen = true, children, id }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section id={id} className="rounded-xl border border-line bg-surface shadow-sm">
      <button
        type="button"
        className="w-full flex items-center justify-between gap-3 px-4 py-3 min-h-[48px] text-left"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <span className="flex items-baseline gap-2 min-w-0">
          <span className="font-display text-lg font-semibold">{title}</span>
          {subtitle && <span className="text-xs text-muted truncate">{subtitle}</span>}
        </span>
        <span className="flex items-center gap-2 shrink-0">
          {badge != null && badge !== "" && (
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-surface-2 text-muted">
              {badge}
            </span>
          )}
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            aria-hidden="true"
            className={`transition-transform ${open ? "rotate-180" : ""}`}
          >
            <path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </span>
      </button>
      {open && <div className="px-4 pb-4 space-y-4">{children}</div>}
    </section>
  );
}

export function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium uppercase tracking-wide text-muted mb-1">
        {label}
        {hint && <span className="normal-case font-normal ml-2">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-[15px] text-text placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-tea-amber/50 min-h-[44px]";

export function TextInput(props) {
  return <input {...props} className={`${inputCls} ${props.className || ""}`} />;
}

export function TextArea(props) {
  return <textarea rows={props.rows || 3} {...props} className={`${inputCls} min-h-[72px] ${props.className || ""}`} />;
}

export function Select({ options, value, onChange, ...rest }) {
  return (
    <select value={value ?? ""} onChange={onChange} {...rest} className={inputCls}>
      {options.map((o) =>
        typeof o === "string" ? (
          <option key={o} value={o}>
            {o}
          </option>
        ) : (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        )
      )}
    </select>
  );
}

// Horizontal scrollable segmented control; large tap targets.
export function Segmented({ options, value, onChange, ariaLabel }) {
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
            onClick={() => onChange(active ? null : opt.value)}
            className={`px-3 py-2 min-h-[44px] rounded-lg border text-sm transition-colors ${
              active
                ? "border-tea-amber bg-tea-amber/15 text-text font-medium"
                : "border-line bg-surface text-muted hover:border-tea-amber/50"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

// 0–5 intensity as six large tap targets. 0 = absent … 5 = dominant.
const INTENSITY_WORDS = ["absent", "trace", "light", "moderate", "strong", "dominant"];
export function IntensityButtons({ value, onChange, color, ariaLabel }) {
  return (
    <div role="radiogroup" aria-label={ariaLabel || "Intensity, 0 to 5"} className="grid grid-cols-6 gap-1.5">
      {[0, 1, 2, 3, 4, 5].map((v) => {
        const active = value === v;
        return (
          <button
            key={v}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={`${v} — ${INTENSITY_WORDS[v]}`}
            onClick={() => onChange(v)}
            className={`min-h-[52px] min-w-[44px] rounded-lg border flex flex-col items-center justify-center gap-0.5 transition-colors ${
              active ? "border-transparent" : "border-line bg-surface hover:border-tea-amber/60"
            }`}
            style={
              active
                ? { backgroundColor: color || "#C4883A", color: "#fff" }
                : v > 0
                  ? { backgroundColor: `color-mix(in srgb, ${color || "#C4883A"} ${v * 7}%, transparent)` }
                  : undefined
            }
          >
            <span className="text-lg font-semibold leading-none">{v}</span>
            <span className={`text-[9px] leading-none ${active ? "" : "text-muted"}`}>
              {INTENSITY_WORDS[v]}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// Bipolar mouthfeel slider: both poles labeled, center = unset until touched.
export function BipolarSlider({ leftLabel, rightLabel, value, onChange }) {
  const set = value != null;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className={set && value < 0 ? "text-text font-medium" : "text-muted"}>{leftLabel}</span>
        <span className={`text-muted ${set ? "" : "italic"}`}>{set ? "" : "not set"}</span>
        <span className={set && value > 0 ? "text-text font-medium" : "text-muted"}>{rightLabel}</span>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="range"
          min={-3}
          max={3}
          step={1}
          value={set ? value : 0}
          aria-label={`${leftLabel} to ${rightLabel}`}
          aria-valuetext={set ? String(value) : "not set"}
          onChange={(e) => onChange(Number(e.target.value))}
          className="tt-range w-full"
          style={{ opacity: set ? 1 : 0.45 }}
        />
        {set && (
          <button
            type="button"
            className="text-xs text-muted underline min-h-[44px] px-1"
            onClick={() => onChange(null)}
            aria-label={`Clear ${leftLabel}/${rightLabel}`}
          >
            clear
          </button>
        )}
      </div>
    </div>
  );
}

export function StarRating({ value, onChange, readOnly = false }) {
  return (
    <div role={readOnly ? "img" : "radiogroup"} aria-label={`Overall rating${value ? `: ${value} of 5 stars` : ""}`} className="flex gap-1">
      {[1, 2, 3, 4, 5].map((v) => (
        <button
          key={v}
          type="button"
          disabled={readOnly}
          role={readOnly ? undefined : "radio"}
          aria-checked={value === v}
          aria-label={`${v} star${v > 1 ? "s" : ""}`}
          onClick={() => !readOnly && onChange(value === v ? null : v)}
          className={`${readOnly ? "" : "min-h-[44px] min-w-[44px]"} text-2xl leading-none ${
            value >= v ? "text-tea-amber dark:text-tea-amber-light" : "text-line"
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

// Bottom sheet on mobile, centered dialog on desktop.
export function Sheet({ open, onClose, title, children }) {
  const ref = useRef(null);
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      // Move focus into the dialog for keyboard/screen-reader users.
      ref.current?.focus();
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);
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

export function Button({ variant = "primary", className = "", ...props }) {
  const styles = {
    primary:
      "bg-tea-amber text-white hover:bg-tea-amber-light border border-transparent",
    ghost: "bg-transparent text-text border border-line hover:border-tea-amber/60",
    subtle: "bg-surface-2 text-text border border-transparent hover:border-line",
    danger: "bg-transparent text-red-700 dark:text-red-400 border border-red-300 dark:border-red-900",
  };
  return (
    <button
      type="button"
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 min-h-[44px] text-sm font-medium transition-colors disabled:opacity-50 ${styles[variant]} ${className}`}
    />
  );
}
