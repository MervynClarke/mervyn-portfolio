"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import SectionHeading from "./SectionHeading";
import { PROJECTS } from "@/lib/data";
import Link from "next/link";

const ease = [0.25, 0.1, 0.25, 1];

function ProjectCard({
  project,
  index,
}: {
  project: (typeof PROJECTS)[number];
  index: number;
}) {
  const [open, setOpen] = useState(false);
  const { ref, isInView } = useInView({ threshold: 0.15 });

  return (
    <motion.div
      ref={ref}
      layout
      className="rounded-2xl border border-bamboo-light/40 dark:border-deep-forest/50
                 bg-white dark:bg-dark-card overflow-hidden
                 hover:shadow-lg hover:shadow-tea-amber/10 dark:hover:shadow-tea-amber/5
                 transition-shadow duration-300"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.6, ease }}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-2xl">{project.emoji}</span>
            <h3 className="mt-2 font-display text-xl font-bold text-charcoal dark:text-ceramic-white">
              {project.title}
            </h3>
            <span className="inline-block mt-1 text-xs font-mono text-tea-amber dark:text-tea-amber-light">
              {project.category}
            </span>
          </div>
        </div>

        {/* Collapsed: short snippet */}
        <p className="mt-4 text-sm font-sans text-charcoal/70 dark:text-ceramic-white/60 leading-relaxed line-clamp-2">
          {project.problem}
        </p>

        {/* Expanded Details */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease }}
              className="overflow-hidden"
            >
              <div className="mt-6 space-y-5">
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-tea-amber dark:text-tea-amber-light mb-2">
                    Problem
                  </h4>
                  <p className="text-sm font-sans text-charcoal/80 dark:text-ceramic-white/70 leading-relaxed">
                    {project.problem}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-tea-amber dark:text-tea-amber-light mb-2">
                    Approach
                  </h4>
                  <p className="text-sm font-sans text-charcoal/80 dark:text-ceramic-white/70 leading-relaxed">
                    {project.approach}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-tea-amber dark:text-tea-amber-light mb-2">
                    Impact
                  </h4>
                  <p className="text-sm font-sans text-charcoal/80 dark:text-ceramic-white/70 leading-relaxed">
                    {project.impact}
                  </p>
                </div>
              </div>

              {/* Tech Stack */}
              <div className="mt-5 flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <span key={tech} className="tech-tag">
                    {tech}

                  </span>
                ))}
              </div>

              {/* PDF Link */}
              {project.pdfUrl && (
                <div className="mt-5 pt-5 border-t border-bamboo-light/20 dark:border-deep-forest/30">
                  <a
                    href={project.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-tea-amber dark:text-tea-amber-light
                               hover:underline transition-colors"
                  >
                    <span>📄</span>
                    <span>Download Case Study</span>
                  </a>
                </div>
                )}

              {/* Full Case Study Page */}
              {project.caseStudyUrl && (
                <div className="mt-3">
                  <Link
                    href={project.caseStudyUrl}
                    className="inline-flex items-center gap-2 text-sm font-medium text-tea-amber dark:text-tea-amber-light
                              hover:underline transition-colors"
                  >
                    <span>🔍</span>
                    <span>View Full Case Study</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </Link>
                </div>
              )}

              
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle Button */}
        <button
          onClick={() => setOpen(!open)}
          className="mt-4 text-sm font-sans font-medium text-tea-amber dark:text-tea-amber-light
                     hover:underline transition-colors flex items-center gap-1"
        >
          {open ? "Collapse" : "View Details"}
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <polyline points="6 9 12 15 18 9" />
          </motion.svg>
        </button>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="py-24 md:py-32 px-6 scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          id="projects-heading"
          title="The Collection"
          subtitle="Deep-dive case studies that prove the craft"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
