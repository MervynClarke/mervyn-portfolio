import type { Metadata } from "next";
import TeaTastingApp from "@/teatasting/TeaTastingApp";

export const metadata: Metadata = {
  title: "Tea Tasting — Mervyn Clarke Jr.",
  description:
    "An interactive tea flavor wheel and tasting log: rate aromas on a sunburst taxonomy, read the session as a radar fingerprint, and export tasting sheets.",
};

export default function Page() {
  return <TeaTastingApp />;
}
