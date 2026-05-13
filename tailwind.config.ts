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
      },
    },
  },
  plugins: [],
};

export default config;
