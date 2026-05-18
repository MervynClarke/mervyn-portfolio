
"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  RESOLUTION_STORIES,
  STATS,
  type ResolutionStory,
} from "@/lib/research-data";

/* Dynamically import the map (skip SSR — fetches remote TopoJSON) */
const JurisdictionMap = dynamic(
  () => import("@/components/JurisdictionMap"),
  { ssr: false, loading: () => <MapSkeleton /> }
);

function MapSkeleton() {
  return (
    <div
      className="w-full h-[500px] rounded-2xl animate-pulse flex items-center justify-center"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
    >
      <p className="text-sm text-[#C4883A] opacity-50">Loading map…</p>
    </div>
  );
}

/* ── Resolution Card (glass-morphism dark style) ──────────── */
function ResolutionCard({ story }: { story: ResolutionStory }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      className="rounded-xl p-5 sm:p-6 cursor-pointer
                  transition-all duration-300 hover:shadow-2xl hover:shadow-[#C4883A]/5"
      style={{
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start gap-3 mb-3">
        <span className="text-3xl">{story.icon}</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-lg text-[#FAF7F2] font-semibold">
            {story.industry}
          </h3>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {story.jurisdictions.map((j) => (
              <span
                key={j}
                className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full
                            bg-[#C4883A] text-[#0f1f1b]"
              >
                {j}
              </span>
            ))}
            <span className="text-[10px] text-[#D4C9A8]/50 ml-1 self-center">
              {story.year}
            </span>
          </div>
        </div>
        <motion.span
          animate={{ rotate: expanded ? 180 : 0 }}
          className="text-[#C4883A] text-xl mt-1 select-none"
        >
          ▾
        </motion.span>
      </div>

      <p className="text-sm text-[#D4C9A8] leading-relaxed">{story.issueSummary}</p>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#C4883A] mb-1">
                  What I Did
                </p>
                <p className="text-sm text-[#D4C9A8] leading-relaxed">
                  {story.whatIDid}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#C4883A]/70 mb-1">
                  Outcome
                </p>
                <p className="text-sm text-[#D4C9A8] leading-relaxed">
                  {story.outcome}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
  
}



/* ═══════════════════════════════════════════════════════════
   PAGE COMPONENT
   ═══════════════════════════════════════════════════════════ */
export default function ResearchDeskPage() {
  return (
    <main className="min-h-screen bg-[#1a2f2a]">      
      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="relative pt-20 py-20 sm:py-28 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f1f1b] via-[#1a2f2a] to-[#1a2f2a]" />
        <div className="relative z-10 max-w-3xl mx-auto">

          {/* Back Link */}
          <div className="mb-6 text-left">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-body text-[#C4883A]
                        hover:opacity-80 transition-all hover:-translate-x-1"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Back to Portfolio
            </Link>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl text-[#FAF7F2] font-bold leading-tight"
          >
            The Research{" "}
            <span className="text-[#C4883A]">Desk</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-4 text-lg sm:text-xl text-[#C4883A] font-body"
          >
            A Decade of Tax Law Research &amp; Customer Issue Resolution
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-6 text-sm sm:text-base text-[#D4C9A8]/70 font-body max-w-2xl mx-auto leading-relaxed"
          >
            Every state. Every Canadian province. Every territory. For over a decade
            I have researched indirect tax law across North America — monitoring daily
            legislative changes, contacting Departments of Revenue directly, resolving
            enterprise customer escalations, and translating complex statutes into
            production-ready tax content powering Fortune&nbsp;500 compliance engines.
          </motion.p>
        </div>
      </section>

      {/* ── JURISDICTION MAP ───────────────────────────────── */}
      <section className="py-16 sm:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-2xl sm:text-3xl text-[#FAF7F2] text-center font-bold mb-2">
            Jurisdiction Coverage
          </h2>
          <p className="text-center text-sm text-[#D4C9A8]/60 mb-8 font-body">
            Hover any state or province to see the work performed there
          </p>
          <JurisdictionMap />
        </div>
      </section>

      {/* ── RESOLUTION STORIES ─────────────────────────────── */}
      <section className="py-16 sm:py-20 px-4 bg-[#2D4A3E]">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-2xl sm:text-3xl text-[#FAF7F2] text-center font-bold mb-2">
            Resolution Stories
          </h2>
          <p className="text-center text-sm text-[#D4C9A8]/60 mb-10 font-body">
            Real issues, real research, real outcomes — anonymized by industry
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {RESOLUTION_STORIES.map((story) => (
              <ResolutionCard key={story.id} story={story} />
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BAR ──────────────────────────────────────── */}
      <section className="py-16 sm:py-20 px-4 bg-[#0f1f1b]">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="font-display text-2xl sm:text-3xl font-bold text-[#C4883A]">
                {s.value}
              </p>
              <p className="text-xs text-[#D4C9A8]/60 mt-1 font-body">{s.label}</p>
            </div>
          ))}
        </div>
        <div>
        <motion.footer
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center space-y-6 mt-16"
          
        >
          <p className="text-xs font-sans italic text-charcoal/40 dark:text-ceramic-white/30">
            All examples are anonymized or synthetic. No proprietary data is disclosed. Generated by AI.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-sans text-tea-amber dark:text-tea-amber-light
                       hover:text-clay-warm dark:hover:text-tea-amber transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to Portfolio
          </Link>
        </motion.footer>
        </div>
      </section>
    </main>
  );
}
