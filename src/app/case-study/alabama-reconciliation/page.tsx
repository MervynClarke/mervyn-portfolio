"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const ease = [0.25, 0.1, 0.25, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const TOOLS = ["Alteryx Designer", "Web Scraping", "Excel/CSV I/O", "Tax Rate Analysis", "Vertex All Rules Report"];

const METRICS = [
  { value: "~99%", label: "Reduction in Manual Effort" },
  { value: "800+", label: "Rules Reconciled" },
  { value: "<1 min", label: "Execution Time" },
];

const KEY_OUTCOMES = [
  "Reduced reconciliation time from 20 hours to under 1 minute per execution cycle",
  "Scaled across 800+ rules and dozens of Alabama Farm and Manufacturing categories",
  "Improved accuracy and eliminated human error in jurisdiction-level rate comparison",
];

const BEFORE_STATE = [
  "Duplicated tax rules across jurisdictions, creating conflicting rate assignments",
  "Inconsistent category counts within category groups — no reliable way to identify which were correct vs. incorrect",
  "Multiple customer complaints related to incorrect reduced Alabama rates",
  "Content governance teams lacked capacity to manually review each jurisdiction and compare rates and rule counts at scale",
];

const AFTER_STATE = [
  "Clear, validated picture of which rules should appear for each category group",
  "Automated monthly reconciliation tool that compares rules against expected results",
  "Proactive alerts to content governance teams when inconsistencies or potential changes are detected",
  "Consistent, reliable content moving forward — shifting from reactive complaint resolution to proactive quality assurance",
];

const APPROACH_BULLETS = [
  "Designed and built Alteryx workflows that ingest Vertex\u2019s All Rules Report and Alabama\u2019s state-provided rate sheet",
  "Programmatically compared rates across every jurisdiction, identifying discrepancies at scale",
  "Output categorized exception reports: Missing Jurisdictions, Incorrect Rates, and Conditional Jurisdictions",
  "Built separate workflows for Farm and Manufacturing rate types, each tailored to category-specific logic",
  "Documented the full workflow process in a step-by-step analysis guide for analyst onboarding and reuse",
];

const IMPACT_BULLETS = [
  "Reduced reconciliation time from 20 hours to under 1 minute — a ~99% reduction in manual effort",
  "Scaled across multiple phases of Alabama Manufacturing and Farming cleanup, covering 800+ rules and dozens of categories",
  "Improved accuracy by eliminating manual jurisdiction-by-jurisdiction comparison",
  "Gave analysts confidence in rate integrity before customer-facing content releases",
  "Influenced adoption of similar reconciliation automation approaches for other states and category types",
];

const ARTIFACTS = [
  {
    label: "Artifact 1",
    description:
      "Alteryx workflow — input configuration dialog and full workflow diagram showing data ingestion, comparison logic, and exception output",
    images: [
      "/case-study/artifact-2-Picture1-Case_Study_AL_Rec.png",
      "/case-study/artifact-1-rule-upload-Picture1-Case_Study_AL_Rec.png",
    ],
  },
  {
    label: "Artifact 2",
    description:
      "Redacted exception report output — Alabama Farming Rate Category Summary showing category counts by group and farming rate discrepancies",
    images: ["/case-study/artifact-2-Picture2-Case_Study_AL_Rec.png"],
  },
];

const TRANSFERABLE_SKILLS = [
  "Process Automation & Workflow Design",
  "Tax Rate Analysis & Reconciliation",
  "Exception Reporting & Data Quality Assurance",
  "Documentation & Analyst Enablement",
];

export default function CaseStudyAlabamaReconciliation() {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [activeImages, setActiveImages] = useState<Record<number, number>>({});

  const getActiveIndex = (artifactIndex: number) => activeImages[artifactIndex] ?? 0;

  const setActiveIndex = (artifactIndex: number, imageIndex: number) => {
    setActiveImages((prev) => ({ ...prev, [artifactIndex]: imageIndex }));
  };

  return (
    <main className="relative min-h-screen bg-ceramic-white dark:bg-dark-bg">
      {/* Background gradients */}
      <div
        className="fixed inset-0 -z-10 dark:hidden"
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, rgba(181,196,161,0.2) 0%, transparent 50%), " +
            "radial-gradient(ellipse at 70% 80%, rgba(196,136,58,0.08) 0%, transparent 50%), " +
            "linear-gradient(180deg, #FAF7F2 0%, #FAF7F2 100%)",
        }}
      />
      <div
        className="fixed inset-0 -z-10 hidden dark:block"
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, rgba(45,74,62,0.4) 0%, transparent 50%), " +
            "radial-gradient(ellipse at 70% 80%, rgba(196,136,58,0.1) 0%, transparent 50%), " +
            "linear-gradient(180deg, #1A2A23 0%, #1A2A23 100%)",
        }}
      />

      {/* Lightbox Overlay */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/90 dark:bg-black/90 backdrop-blur-sm cursor-pointer p-4 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setLightboxImage(null)}
          >
            <motion.div
              className="relative max-w-6xl w-full max-h-[90vh]"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease }}
            >
              <img
                src={lightboxImage}
                alt="Expanded artifact view"
                className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
              />
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-ceramic-white dark:bg-dark-card
                           text-charcoal dark:text-ceramic-white flex items-center justify-center
                           shadow-lg hover:bg-tea-amber hover:text-white transition-colors text-sm font-bold"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease }}
        >
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
        </motion.div>

        {/* ─── HERO ─── */}
        <motion.header
          className="mt-10 md:mt-14"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeUp} className="flex flex-wrap gap-2 mb-4">
            {["Process Automation", "Tax Reconciliation", "Data Engineering"].map((tag) => (
              <span
                key={tag}
                className="text-xs font-mono px-3 py-1 rounded-full
                           bg-tea-amber/10 text-tea-amber dark:bg-tea-amber-light/10 dark:text-tea-amber-light"
              >
                {tag}
              </span>
            ))}
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="font-display text-4xl md:text-6xl font-bold text-charcoal dark:text-ceramic-white leading-tight"
          >
            Alabama Category
            <br />
            <span className="text-tea-amber dark:text-tea-amber-light">Reconciliation Automation</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-3 text-lg md:text-xl font-display italic text-clay-warm dark:text-bamboo-light"
          >
            &ldquo;20 hours to under 1 minute&rdquo;
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="mt-2 text-base font-mono text-charcoal/50 dark:text-ceramic-white/40"
          >
            2024 &middot; Vertex Inc.
          </motion.p>
        </motion.header>

        {/* Divider */}
        <div className="my-12 border-t border-bamboo-light/50 dark:border-deep-forest/60" />

        {/* ─── EXECUTIVE OVERVIEW ─── */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
        >
          <motion.h2
            variants={fadeUp}
            className="font-display text-2xl font-semibold text-charcoal dark:text-ceramic-white mb-4"
          >
            Executive Overview
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-base font-sans text-charcoal/80 dark:text-ceramic-white/70 leading-relaxed"
          >
            Designed and deployed an Alteryx-based automation solution that reconciles Alabama&rsquo;s
            Farm and Manufacturing tax categories against state-provided rate sheets across 700+
            jurisdictions. The initiative replaced a manual, 20 hours per month reconciliation process
            with a sub-one-minute automated workflow &mdash; dramatically improving accuracy,
            scalability, and analyst confidence in rate integrity before customer-facing content
            releases. The solution scaled across multiple phases covering 800+ rules and dozens of
            tax categories.
          </motion.p>
        </motion.section>

        <div className="my-12 border-t border-bamboo-light/50 dark:border-deep-forest/60" />

        {/* ─── KEY OUTCOMES ─── */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
        >
          <motion.h2
            variants={fadeUp}
            className="font-display text-2xl font-semibold text-charcoal dark:text-ceramic-white mb-6"
          >
            Key Outcomes
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {KEY_OUTCOMES.map((outcome, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="p-5 rounded-2xl border border-bamboo-light/50 dark:border-deep-forest/60
                           bg-white/60 dark:bg-dark-card/60 backdrop-blur-sm
                           hover:shadow-lg hover:shadow-tea-amber/10 dark:hover:shadow-tea-amber/5
                           hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 text-tea-amber dark:text-tea-amber-light text-lg">✓</span>
                  <p className="text-sm font-sans text-charcoal/80 dark:text-ceramic-white/70 leading-relaxed">
                    {outcome}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <div className="my-12 border-t border-bamboo-light/50 dark:border-deep-forest/60" />

        {/* ─── CONTEXT ─── */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
        >
          <motion.h2
            variants={fadeUp}
            className="font-display text-2xl font-semibold text-charcoal dark:text-ceramic-white mb-4"
          >
            Context
          </motion.h2>
          <motion.div
            variants={fadeUp}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {[
              { label: "Environment", value: "Tax Research content development and rate maintenance" },
              { label: "Role", value: "Senior Lead Tax Solutions Analyst" },
              { label: "Scope", value: "Rate reconciliation, exception reporting, and multi-phase category cleanup for Alabama jurisdictions" },
            ].map((item) => (
              <div
                key={item.label}
                className="p-4 rounded-2xl border border-bamboo-light/50 dark:border-deep-forest/60
                           bg-white/60 dark:bg-dark-card/60 backdrop-blur-sm"
              >
                <p className="text-xs font-mono uppercase tracking-wider text-tea-amber dark:text-tea-amber-light mb-1">
                  {item.label}
                </p>
                <p className="text-sm font-sans text-charcoal/80 dark:text-ceramic-white/70">
                  {item.value}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.section>

        <div className="my-12 border-t border-bamboo-light/50 dark:border-deep-forest/60" />

        {/* ─── PROBLEM ─── */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
        >
          <motion.h2
            variants={fadeUp}
            className="font-display text-2xl font-semibold text-charcoal dark:text-ceramic-white mb-4"
          >
            Problem
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-base font-sans text-charcoal/80 dark:text-ceramic-white/70 leading-relaxed mb-4"
          >
            Reconciling Alabama&rsquo;s Farm and Manufacturing tax categories required analysts to
            manually compare Vertex&rsquo;s internal rules against the state&rsquo;s published rate
            sheets &mdash; jurisdiction by jurisdiction. With 700+ jurisdictions per category and
            complex conditional logic (e.g., jurisdictions with variable rates or special conditions),
            the process took 20 hours per reconciliation cycle and was highly error-prone at scale.
          </motion.p>
          <motion.p
            variants={fadeUp}
            className="text-base font-sans text-charcoal/80 dark:text-ceramic-white/70 leading-relaxed mb-8"
          >
            As the volume of categories and rules grew, this manual approach created operational
            bottlenecks, delayed content releases, and increased the risk of publishing incorrect
            tax rates to customers.
          </motion.p>

          {/* Before / After Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Before State */}
            <motion.div
              variants={fadeUp}
              className="p-6 rounded-2xl border border-red-300/30 dark:border-red-500/20
                         bg-red-50/40 dark:bg-red-950/10 backdrop-blur-sm"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-red-500 dark:text-red-400 text-lg">●</span>
                <h3 className="font-display text-lg font-semibold text-charcoal dark:text-ceramic-white">
                  Before State
                </h3>
              </div>
              <p className="text-xs font-mono uppercase tracking-wider text-red-500/70 dark:text-red-400/60 mb-3">
                Operational Reality
              </p>
              <ul className="space-y-3">
                {BEFORE_STATE.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-red-400/60 dark:bg-red-500/40 shrink-0" />
                    <span className="text-sm font-sans text-charcoal/70 dark:text-ceramic-white/60 leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs font-sans italic text-charcoal/50 dark:text-ceramic-white/40 leading-relaxed">
                As category volume grew, the lack of systematic reconciliation created compounding
                data quality issues and eroded customer trust.
              </p>
            </motion.div>

            {/* After State */}
            <motion.div
              variants={fadeUp}
              className="p-6 rounded-2xl border border-emerald-300/30 dark:border-emerald-500/20
                         bg-emerald-50/40 dark:bg-emerald-950/10 backdrop-blur-sm"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-emerald-500 dark:text-emerald-400 text-lg">●</span>
                <h3 className="font-display text-lg font-semibold text-charcoal dark:text-ceramic-white">
                  After State
                </h3>
              </div>
              <p className="text-xs font-mono uppercase tracking-wider text-emerald-500/70 dark:text-emerald-400/60 mb-3">
                Automated Reconciliation & Monitoring
              </p>
              <ul className="space-y-3">
                {AFTER_STATE.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-emerald-400/60 dark:bg-emerald-500/40 shrink-0" />
                    <span className="text-sm font-sans text-charcoal/70 dark:text-ceramic-white/60 leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs font-sans italic text-charcoal/50 dark:text-ceramic-white/40 leading-relaxed">
                This model replaced manual, reactive processes with structured, repeatable
                reconciliation &mdash; restoring accuracy and enabling proactive content governance.
              </p>
            </motion.div>
          </div>
        </motion.section>

        <div className="my-12 border-t border-bamboo-light/50 dark:border-deep-forest/60" />

        {/* ─── APPROACH ─── */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
        >
          <motion.h2
            variants={fadeUp}
            className="font-display text-2xl font-semibold text-charcoal dark:text-ceramic-white mb-6"
          >
            Approach
          </motion.h2>
          <ul className="space-y-4">
            {APPROACH_BULLETS.map((item, i) => (
              <motion.li
                key={i}
                variants={fadeUp}
                className="flex items-start gap-3"
              >
                <span className="mt-1.5 h-2 w-2 rounded-full bg-tea-amber dark:bg-tea-amber-light shrink-0" />
                <span className="text-base font-sans text-charcoal/80 dark:text-ceramic-white/70 leading-relaxed">
                  {item}
                </span>
              </motion.li>
            ))}
          </ul>

          {/* Tools */}
          <motion.div variants={fadeUp} className="mt-8">
            <h3 className="text-sm font-mono uppercase tracking-widest text-charcoal/40 dark:text-ceramic-white/30 mb-3">
              Tools &amp; Technologies
            </h3>
            <div className="flex flex-wrap gap-2">
              {TOOLS.map((tool) => (
                <span
                  key={tool}
                  className="text-xs font-mono px-3 py-1.5 rounded-full
                             border border-bamboo-light/60 dark:border-deep-forest/60
                             text-charcoal/70 dark:text-ceramic-white/60
                             bg-white/40 dark:bg-dark-card/40"
                >
                  {tool}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.section>

        <div className="my-12 border-t border-bamboo-light/50 dark:border-deep-forest/60" />

        {/* ─── EVIDENCE & ARTIFACTS ─── */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
        >
          <motion.h2
            variants={fadeUp}
            className="font-display text-2xl font-semibold text-charcoal dark:text-ceramic-white mb-2"
          >
            Evidence &amp; Artifacts
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-xs font-sans italic text-charcoal/50 dark:text-ceramic-white/40 mb-8"
          >
            All examples and artifacts referenced below are anonymized or synthetic to protect
            confidential and proprietary information.
          </motion.p>
          <div className="space-y-8">
            {ARTIFACTS.map((artifact, artifactIndex) => {
              const activeIdx = getActiveIndex(artifactIndex);
              const activeImage = artifact.images[activeIdx];

              return (
                <motion.div
                  key={artifactIndex}
                  variants={fadeUp}
                  className="group rounded-2xl border border-bamboo-light/50 dark:border-deep-forest/60
                             bg-white/60 dark:bg-dark-card/60 backdrop-blur-sm overflow-hidden
                             hover:shadow-xl hover:shadow-tea-amber/10 dark:hover:shadow-tea-amber/5
                             transition-shadow duration-500"
                >
                  {/* Caption — on top */}
                  <div className="p-5 border-b border-bamboo-light/30 dark:border-deep-forest/40">
                    <p className="text-xs font-mono uppercase tracking-wider text-tea-amber dark:text-tea-amber-light mb-1.5">
                      {artifact.label}
                    </p>
                    <p className="text-sm font-sans text-charcoal/70 dark:text-ceramic-white/60 leading-relaxed">
                      {artifact.description}
                    </p>
                  </div>

                  {/* Featured Image */}
                  <div
                    className="relative overflow-hidden cursor-pointer"
                    onClick={() => setLightboxImage(activeImage)}
                  >
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={activeImage}
                        src={activeImage}
                        alt={`${artifact.label} - image ${activeIdx + 1}`}
                        loading="lazy"
                        className="w-full h-auto object-contain bg-charcoal/[0.03] dark:bg-ceramic-white/[0.03]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    </AnimatePresence>
                    {/* Hover Overlay */}
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-charcoal/20 via-transparent to-transparent
                                 opacity-0 group-hover:opacity-100 transition-opacity duration-500
                                 flex items-end justify-center pb-4"
                    >
                      <span className="text-xs font-mono text-white/90 bg-charcoal/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        Click to expand
                      </span>
                    </div>
                  </div>

                  {/* Thumbnail Strip */}
                  {artifact.images.length > 1 && (
                    <div className="p-3 border-t border-bamboo-light/30 dark:border-deep-forest/40
                                    bg-charcoal/[0.02] dark:bg-ceramic-white/[0.02]">
                      <div className="flex gap-2 overflow-x-auto pb-1">
                        {artifact.images.map((img, imgIndex) => (
                          <button
                            key={imgIndex}
                            onClick={() => setActiveIndex(artifactIndex, imgIndex)}
                            className={`relative shrink-0 h-16 md:h-20 w-24 md:w-32 rounded-lg overflow-hidden
                                        transition-all duration-300 ${
                                          imgIndex === activeIdx
                                            ? "ring-2 ring-tea-amber dark:ring-tea-amber-light opacity-100 shadow-md"
                                            : "opacity-50 hover:opacity-80 ring-1 ring-bamboo-light/30 dark:ring-deep-forest/40"
                                        }`}
                          >
                            <img
                              src={img}
                              alt={`${artifact.label} thumbnail ${imgIndex + 1}`}
                              loading="lazy"
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        <div className="my-12 border-t border-bamboo-light/50 dark:border-deep-forest/60" />

        {/* ─── IMPACT ─── */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
        >
          <motion.h2
            variants={fadeUp}
            className="font-display text-2xl font-semibold text-charcoal dark:text-ceramic-white mb-6"
          >
            Impact
          </motion.h2>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {METRICS.map((metric, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="p-6 rounded-2xl border border-bamboo-light/50 dark:border-deep-forest/60
                           bg-white/60 dark:bg-dark-card/60 backdrop-blur-sm text-center
                           hover:shadow-lg hover:shadow-tea-amber/10 dark:hover:shadow-tea-amber/5
                           hover:-translate-y-1 transition-all duration-300"
              >
                <p className="font-display text-3xl md:text-4xl font-bold text-tea-amber dark:text-tea-amber-light">
                  {metric.value}
                </p>
                <p className="mt-2 text-sm font-sans text-charcoal/60 dark:text-ceramic-white/50">
                  {metric.label}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Impact Bullets */}
          <ul className="space-y-3">
            {IMPACT_BULLETS.map((item, i) => (
              <motion.li
                key={i}
                variants={fadeUp}
                className="flex items-start gap-3"
              >
                <span className="mt-1.5 h-2 w-2 rounded-full bg-tea-amber dark:bg-tea-amber-light shrink-0" />
                <span className="text-sm font-sans text-charcoal/80 dark:text-ceramic-white/70 leading-relaxed">
                  {item}
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.section>

        <div className="my-12 border-t border-bamboo-light/50 dark:border-deep-forest/60" />

        {/* ─── WHY THIS MATTERS ─── */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
        >
          <motion.h2
            variants={fadeUp}
            className="font-display text-2xl font-semibold text-charcoal dark:text-ceramic-white mb-4"
          >
            Why This Matters
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-base font-sans text-charcoal/80 dark:text-ceramic-white/70 leading-relaxed"
          >
            This case study demonstrates how targeted process automation can eliminate operational
            bottlenecks in tax content maintenance. By replacing manual, error-prone reconciliation
            with a structured, repeatable workflow, tax research teams can maintain rate accuracy at
            scale &mdash; reducing risk, accelerating release cycles, and freeing analysts to focus
            on higher-value interpretation and decision-making.
          </motion.p>
        </motion.section>

        <div className="my-12 border-t border-bamboo-light/50 dark:border-deep-forest/60" />

        {/* ─── TRANSFERABLE SKILLS ─── */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
        >
          <motion.h2
            variants={fadeUp}
            className="font-display text-2xl font-semibold text-charcoal dark:text-ceramic-white mb-4"
          >
            Transferable Skills
          </motion.h2>
          <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
            {TRANSFERABLE_SKILLS.map((skill) => (
              <span
                key={skill}
                className="text-sm font-sans px-4 py-2 rounded-full
                           bg-sage-soft/30 dark:bg-deep-forest/40
                           text-charcoal/80 dark:text-ceramic-white/70
                           border border-sage-soft/50 dark:border-deep-forest/60"
              >
                {skill}
              </span>
            ))}
          </motion.div>
        </motion.section>

        <div className="my-12 border-t border-bamboo-light/50 dark:border-deep-forest/60" />

        {/* ─── FOOTER ─── */}
        <motion.footer
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-center space-y-6"
        >
          <p className="text-xs font-sans italic text-charcoal/40 dark:text-ceramic-white/30">
            All examples are anonymized or synthetic. No proprietary data is disclosed.
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
    </main>
  );
}
