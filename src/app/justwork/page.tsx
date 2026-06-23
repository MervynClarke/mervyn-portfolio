import type { Metadata } from "next";
import JustWorkApp from "@/justwork/JustWorkApp";

export const metadata: Metadata = {
  title: "Just Work — Minimal Pomodoro Timer",
  description:
    "Just Work — a minimalist focus timer. Pick a length (2, 10, 15, 20, or 30 minutes), work until it ends, and a matching break starts automatically.",
};

export default function JustWorkPage() {
  return <JustWorkApp />;
}
