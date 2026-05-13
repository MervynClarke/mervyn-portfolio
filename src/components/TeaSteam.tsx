"use client";

export default function TeaSteam({ className = "" }: { className?: string }) {
  return (
    <svg
      width="60"
      height="40"
      viewBox="0 0 60 40"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        className="steam-path"
        d="M15 38 C15 28, 8 25, 10 15 C12 5, 18 8, 16 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.4"
      />
      <path
        className="steam-path"
        d="M30 38 C30 30, 24 24, 28 14 C32 4, 34 10, 30 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.3"
      />
      <path
        className="steam-path"
        d="M45 38 C45 30, 50 22, 46 14 C42 6, 38 10, 42 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.35"
      />
    </svg>
  );
}
