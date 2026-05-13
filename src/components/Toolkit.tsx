"use client";

import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import SectionHeading from "./SectionHeading";
import { TOOLKIT, CERTIFICATIONS, EDUCATION } from "@/lib/data";

const ease = [0.25, 0.1, 0.25, 1];

function ProficiencyBar({ level }: { level: number }) {
  return (
    <div className="flex gap-1 mt-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 w-6 rounded-full transition-colors ${
            i < level
              ? "bg-tea-amber dark:bg-tea-amber-light"
              : "bg-bamboo-light/50 dark:bg-deep-forest/60"
          }`}
        />
      ))}
    </div>
  );
}

export default function Toolkit() {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <section
      id="toolkit"
      className="py-24 md:py-32 px-6 bg-sage-soft/10 dark:bg-deep-forest/20 scroll-mt-20"
    >
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          id="toolkit-heading"
          title="The Tea Set"
          subtitle="Every craftsman needs the right instruments"
        />

        {/* Tool Categories Grid */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {TOOLKIT.map((category, ci) => (
            <motion.div
              key={category.label}
              className="p-6 rounded-2xl border border-bamboo-light/40 dark:border-deep-forest/50
                         bg-white dark:bg-dark-card"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: ci * 0.12, duration: 0.6, ease }}
            >
              <div className="flex items-center gap-2 mb-5">
                <span className="text-xl">{category.emoji}</span>
                <h3 className="font-sans font-bold text-charcoal dark:text-ceramic-white">
                  {category.label}
                </h3>
              </div>
              <div className="space-y-4">
                {category.tools.map((tool) => (
                  <div key={tool.name}>
                    <div className="flex items-center justify-between">
                      <span className="font-sans text-sm font-semibold text-charcoal dark:text-ceramic-white">
                        {tool.name}
                      </span>
                    </div>
                    <ProficiencyBar level={tool.proficiency} />
                    <p className="mt-1 text-xs font-sans text-charcoal/55 dark:text-ceramic-white/45 leading-relaxed">
                      {tool.context}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Certifications */}
        <div className="mt-20">
          <h3 className="font-display text-2xl font-bold text-center text-charcoal dark:text-ceramic-white mb-8">
            Certifications
          </h3>
          <div className="flex overflow-x-auto gap-4 pb-4 -mx-6 px-6 scrollbar-hide">
            {CERTIFICATIONS.map((cert, i) => (
              <motion.div
                key={cert.name}
                className="flex-shrink-0 w-64 p-5 rounded-xl border border-bamboo-light/40 dark:border-deep-forest/50
                           bg-white dark:bg-dark-card"
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.8 + i * 0.08, duration: 0.5, ease }}
              >
                <p className="font-sans text-sm font-semibold text-charcoal dark:text-ceramic-white leading-snug">
                  {cert.name}
                </p>
                <p className="mt-2 text-xs font-sans text-charcoal/50 dark:text-ceramic-white/40">
                  {cert.issuer}
                  {cert.year ? ` \u00b7 ${cert.year}` : ""}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="mt-16">
          <h3 className="font-display text-2xl font-bold text-center text-charcoal dark:text-ceramic-white mb-8">
            Education
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {EDUCATION.map((edu, i) => (
              <motion.div
                key={edu.degree}
                className="p-6 rounded-xl border border-bamboo-light/40 dark:border-deep-forest/50
                           bg-white dark:bg-dark-card text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1.2 + i * 0.1, duration: 0.5, ease }}
              >
                <p className="text-3xl font-display font-bold text-tea-amber dark:text-tea-amber-light">
                  {edu.year}
                </p>
                <p className="mt-3 font-sans text-sm font-bold text-charcoal dark:text-ceramic-white">
                  {edu.degree}
                </p>
                <p className="mt-1 text-xs font-sans text-charcoal/60 dark:text-ceramic-white/50">
                  {edu.institution}
                </p>
                {edu.detail && (
                  <p className="mt-1 text-xs font-sans italic text-clay-warm dark:text-bamboo-light">
                    {edu.detail}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
