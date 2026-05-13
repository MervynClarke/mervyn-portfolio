"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import SectionHeading from "./SectionHeading";
import { EXPERIENCE } from "@/lib/data";

const ease = [0.25, 0.1, 0.25, 1] as const;

function TimelineEntry({
  entry,
  index,
}: {
  entry: (typeof EXPERIENCE)[number];
  index: number;
}) {
  const { ref, isInView } = useInView({ threshold: 0.15 });
  const [expanded, setExpanded] = useState(false);
  const isLeft = index % 2 === 0;
  const visibleHighlights = expanded ? entry.highlights : entry.highlights.slice(0, 3);

  return (
    <div
      ref={ref}
      className={`relative flex items-start gap-8 md:gap-0 ${
        isLeft ? "md:flex-row" : "md:flex-row-reverse"
      }`}
    >
      {/* Timeline Node */}
      <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-6 z-10">
        <div className="w-4 h-4 rounded-full bg-tea-amber dark:bg-tea-amber-light ring-4 ring-ceramic-white dark:ring-dark-bg" />
      </div>

      {/* Spacer for desktop alternation */}
      <div className="hidden md:block md:w-1/2" />

      {/* Card */}
      <motion.div
        className={`ml-12 md:ml-0 md:w-1/2 ${
          isLeft ? "md:pr-12" : "md:pl-12"
        }`}
        initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, ease }}
      >
        <div
          className="p-6 rounded-2xl border border-bamboo-light/40 dark:border-deep-forest/50
                     bg-white dark:bg-dark-card shadow-sm
                     hover:shadow-md hover:shadow-tea-amber/5 transition-shadow duration-300"
        >
          {/* Infusion Badge */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg" role="img" aria-label="teapot">
              🫖
            </span>
            <span className="text-xs font-mono uppercase tracking-wider text-tea-amber dark:text-tea-amber-light">
              Infusion {entry.infusionNumber}
            </span>
          </div>

          {/* Infusion Title */}
          <p className="font-display italic text-lg text-clay-warm dark:text-bamboo-light mb-2">
            {entry.infusionTitle}
          </p>

          {/* Job Info */}
          <h3 className="font-sans text-lg font-bold text-charcoal dark:text-ceramic-white">
            {entry.title}
          </h3>
          <p className="font-sans text-sm text-tea-amber dark:text-tea-amber-light font-medium">
            {entry.company}
          </p>
          <p className="font-sans text-xs text-charcoal/50 dark:text-ceramic-white/40 mt-1">
            {entry.period} &middot; {entry.location}
          </p>

          {/* Description */}
          <p className="mt-4 text-sm font-sans text-charcoal/75 dark:text-ceramic-white/65 leading-relaxed">
            {entry.description}
          </p>

          {/* Highlights */}
          <ul className="mt-4 space-y-2">
            {visibleHighlights.map((h, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm font-sans text-charcoal/80 dark:text-ceramic-white/70"
              >
                <span className="text-tea-amber dark:text-tea-amber-light mt-1 shrink-0">
                  &#x2022;
                </span>
                <span>{h}</span>
              </li>
            ))}
          </ul>
          {entry.highlights.length > 3 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-3 text-xs font-sans font-medium text-tea-amber dark:text-tea-amber-light
                         hover:underline transition-colors"
            >
              {expanded
                ? "Show less"
                : `+ ${entry.highlights.length - 3} more`}
            </button>
          )}

          {/* Tags */}
          <div className="mt-4 flex flex-wrap gap-2">
            {entry.tags.map((tag) => (
              <span key={tag} className="tech-tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function Experience() {
  return (
    <section
      id="experience"
      className="py-24 md:py-32 px-6 bg-sage-soft/10 dark:bg-deep-forest/20 scroll-mt-20"
    >
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          id="experience-heading"
          title="The Infusions"
          subtitle="Each role reveals a new layer of depth"
        />

        {/* Timeline */}
        <div className="relative mt-16">
          {/* Central Line */}
          <div
            className="absolute left-4 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5
                        timeline-line"
          />

          <div className="space-y-12">
            {EXPERIENCE.map((entry, i) => (
              <TimelineEntry key={entry.infusionNumber} entry={entry} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
