import type { Metadata } from "next";
import JumpApp from "@/jump/JumpApp";

export const metadata: Metadata = {
  title: "Jump Work — Guided Jump Rope Workouts",
  description:
    "Jump Work — timed, hands-free jump rope sessions. Pick a length and a training style; the app builds the workout, cues every move, and bookends it with stretches.",
};

export default function JumpPage() {
  return <JumpApp />;
}
