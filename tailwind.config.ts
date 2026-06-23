import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{ts,tsx,js,jsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "tea-amber":     "#C4883A",
        "tea-amber-light":"#D4993A",
        "clay-warm":     "#8B5E3C",
        "sage-soft":     "#B5C4A1",
        "ceramic-white": "#FAF7F2",
        charcoal:        "#2C2C2C",
        "bamboo-light":  "#D4C9A8",
        "deep-forest":   "#2D4A3E",
        "dark-card":     "#243330",
        "dark-bg":       "#1A2A23",

        // ── Jump Work app tokens ──────────────────────────────
        // Surfaces/text are driven by CSS variables scoped to `.jump-app`
        // (see globals.css) so the app follows the site's light/dark toggle.
        bg:          "var(--bg)",
        surface:     "var(--surface)",
        "surface-2": "var(--surface-2)",
        line:        "var(--line)",
        text:        "var(--text)",
        muted:       "var(--muted)",
        // Semantic accents — "coral" = work (green = GO), "teal" = recovery (gold).
        coral: { DEFAULT: "#34D399", soft: "#5FE0AD", deep: "#10B981" },
        teal:  { DEFAULT: "#D99A3C", soft: "#E6B25A", deep: "#BE8125" },
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        sans:    ["var(--font-inter)", "system-ui", "sans-serif"],
        mono:    ["var(--font-jetbrains)", "Menlo", "monospace"],
      },
      animation: {
        "steam":       "steam 3s ease-in-out infinite",
        "fade-in-up":  "fadeInUp 0.8s ease-out forwards",
        "count":       "count 2s ease-out forwards",
        "ropeSwing":   "ropeSwing 1.2s ease-in-out infinite",
        "floatIn":     "floatIn 0.4s ease forwards",
      },
      keyframes: {
        steam: {
          "0%, 100%": { opacity: "0", transform: "translateY(0) scaleX(1)" },
          "50%":      { opacity: "0.6", transform: "translateY(-20px) scaleX(1.2)" },
        },
        fadeInUp: {
          from: { opacity: "0", transform: "translateY(30px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        ropeSwing: {
          "0%, 100%": { transform: "rotate(-6deg)" },
          "50%":      { transform: "rotate(6deg)" },
        },
        floatIn: {
          "0%":   { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
