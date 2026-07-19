"use client";
// Theme detection + concrete colors for SVG rendering (SVG fills can't use
// CSS vars when we serialize for PNG/PDF export, so both the live wheels and
// the exporters draw from these values; keep in sync with globals.css).
import { useEffect, useState } from "react";

export const THEME = {
  light: {
    bg: "#f5f1e8",
    surface: "#ffffff",
    surface2: "#ece5d6",
    line: "#ddd3bd",
    text: "#2c2c2c",
    muted: "#6b6455",
    accent: "#C4883A",
  },
  dark: {
    bg: "#0a120d",
    surface: "#101c15",
    surface2: "#17281e",
    line: "#23372b",
    text: "#faf7f2",
    muted: "#9aa89d",
    accent: "#D4993A",
  },
};

export function useDark() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const el = document.documentElement;
    const update = () => setDark(el.classList.contains("dark"));
    update();
    const obs = new MutationObserver(update);
    obs.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);
  return dark;
}

export function useThemeColors() {
  const dark = useDark();
  return { dark, colors: dark ? THEME.dark : THEME.light };
}
