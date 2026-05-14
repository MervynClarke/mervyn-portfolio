"use client";

import { motion } from "framer-motion";
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

const TOOLS = ["Vertex O Series", "Batch Client Interface (BCI)", "Alteryx"];

const METRICS = [
  { value: "$330K+", label: "Erroneous Tax Recovered" },
  { value: "100%", label: "Automated Reversal Process" },
  { value: "Year-End", label: "Deadline Met" },
];

const APPROACH_BULLETS = [
  "Designed and led an automated tax reversal solution using Vertex O Series Batch Client Interface",
  "Programmatically identified invalid tax entries across historical transactions",
  "Executed bulk reversals with validation controls to ensure accuracy and auditability",
];

const TRANSFERABLE_SKILLS = [
  "Enterprise Tax Automation",
  "Financial Recovery & Remediation",
  "Risk, Controls & Audit Awareness",
  "Cross-functional Influence",
];

const APPENDIX_SOLUTION = [
  "Ingests lodging transaction data, jurisdiction-level Tax Area references, and taxability mapping tables from multiple Excel and CSV sources",
  "Standardizes Tax Area IDs and filters rules to isolate active, relevant taxability drivers",
  "Enriches each record by joining jurisdiction IDs, mapping qualifying conditions with weighted comparison logic",
  "Assembles fully formatted BCI transaction records with dynamically constructed document numbers and result-type translations",
  "Outputs a single, submission-ready CSV file conforming to Vertex\u2019s BCI specification",
];

const APPENDIX_IMPACT = [
  "Eliminated hours of manual test file preparation per testing cycle",
  "Improved accuracy by programmatically enforcing field formatting, jurisdiction matching, and qualifying condition logic",
  "Scaled coverage to thousands of US jurisdictions with consistent, repeatable test cases",
];

export default function CaseStudy330k() {
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
            {["Tax Automation", "Financial Recovery", "Process Engineering"].map((tag) => (
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
            $330K Tax Reversal
            <br />
            <span className="text-tea-amber dark:text-tea-amber-light">Automation</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-4 text-base font-mono text-charcoal/50 dark:text-ceramic-white/40"
          >
            2017 &middot; DLL, De Lage Landen Financial Services
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
            Identified and remediated over $330,000 in erroneous tax charges by designing and
            executing an automated tax reversal solution. The initiative reduced manual effort,
            minimized risk, and influenced future tax automation initiatives leveraging Vertex
            Batch Client Interface (BCI) and Alteryx.
          </motion.p>
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
          <motion.div
            variants={fadeUp}
            className="p-6 rounded-2xl border border-bamboo-light/50 dark:border-deep-forest/60
                       bg-white/60 dark:bg-dark-card/60 backdrop-blur-sm"
          >
            <p className="text-base font-sans text-charcoal/80 dark:text-ceramic-white/70 leading-relaxed">
              It&rsquo;s 2017. My employer had accumulated more than $330,000 in incorrect tax
              assessments due to systemic posting errors across historical transactions. Existing
              processes relied on manual identification and reversal, which were time-intensive,
              error-prone, and not scalable. This created ongoing financial leakage and elevated
              audit and compliance risk. The Tax Technology group was tapped to resolve the issue
              before year end.
            </p>
          </motion.div>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            This case study demonstrates how targeted tax automation can directly drive financial
            recovery while reducing operational risk. It highlights the ability to translate tax
            domain knowledge into scalable, technology-enabled solutions with enterprise impact.
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

        {/* ─── APPENDIX ─── */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeUp}>
            <span className="text-xs font-mono uppercase tracking-widest text-charcoal/40 dark:text-ceramic-white/30">
              Appendix
            </span>
            <h2 className="font-display text-2xl font-semibold text-charcoal dark:text-ceramic-white mt-2 mb-2">
              Automated Tax Test Case Generator
            </h2>
            <p className="text-sm font-mono text-tea-amber dark:text-tea-amber-light mb-6">
              Lodging &amp; Hospitality &middot; Alteryx Designer
            </p>
          </motion.div>

          {/* Challenge */}
          <motion.div
            variants={fadeUp}
            className="p-6 rounded-2xl border border-bamboo-light/50 dark:border-deep-forest/60
                       bg-white/60 dark:bg-dark-card/60 backdrop-blur-sm mb-6"
          >
            <h3 className="font-display text-lg font-semibold text-charcoal dark:text-ceramic-white mb-3">
              Challenge
            </h3>
            <p className="text-base font-sans text-charcoal/80 dark:text-ceramic-white/70 leading-relaxed">
              Manually building Batch Client Interface (BCI) test files for Vertex&rsquo;s tax
              calculation engine was time-intensive and error-prone &mdash; especially for lodging
              transactions that span thousands of US jurisdictions, each with unique taxability
              rules, qualifying conditions, and flexible field requirements.
            </p>
          </motion.div>

          {/* Solution */}
          <motion.div variants={fadeUp}>
            <h3 className="font-display text-lg font-semibold text-charcoal dark:text-ceramic-white mb-4">
              Solution
            </h3>
            <p className="text-base font-sans text-charcoal/80 dark:text-ceramic-white/70 leading-relaxed mb-4">
              Designed and built an end-to-end Alteryx Designer workflow that automatically
              generates production-ready BCI test files for lodging/hospitality tax scenarios.
              The workflow:
            </p>
            <ul className="space-y-3">
              {APPENDIX_SOLUTION.map((item, i) => (
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
          </motion.div>

          {/* Appendix Impact */}
          <motion.div variants={fadeUp} className="mt-8">
            <h3 className="font-display text-lg font-semibold text-charcoal dark:text-ceramic-white mb-4">
              Impact
            </h3>
            <ul className="space-y-3">
              {APPENDIX_IMPACT.map((item, i) => (
                <motion.li
                  key={i}
                  variants={fadeUp}
                  className="flex items-start gap-3"
                >
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-sage-soft dark:bg-sage-soft/60 shrink-0" />
                  <span className="text-sm font-sans text-charcoal/80 dark:text-ceramic-white/70 leading-relaxed">
                    {item}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Appendix Tools */}
          <motion.div variants={fadeUp} className="mt-6">
            <div className="flex flex-wrap gap-2">
              {["Alteryx Designer", "Excel/CSV I/O", "Regex Parsing", "Multi-Tier Conditional Logic", "Vertex BCI Spec"].map(
                (tool) => (
                  <span
                    key={tool}
                    className="text-xs font-mono px-3 py-1.5 rounded-full
                               border border-bamboo-light/60 dark:border-deep-forest/60
                               text-charcoal/70 dark:text-ceramic-white/60
                               bg-white/40 dark:bg-dark-card/40"
                  >
                    {tool}
                  </span>
                )
              )}
            </div>
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
