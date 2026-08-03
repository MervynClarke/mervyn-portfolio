import type { Metadata } from "next";
import YogaTrackerApp from "@/yogatracker/YogaTrackerApp";

export const metadata: Metadata = {
  title: "Yoga Tracker — Mervyn Clarke Jr.",
  description:
    "A low-friction log for the yoga you practise: paste a screenshot of a class and it fills itself in, then watch the streak, the hours, and which parts of the body you keep coming back to.",
};

export default function Page() {
  return <YogaTrackerApp />;
}
