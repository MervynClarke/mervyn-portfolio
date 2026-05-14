"use client";

import { motion } from "framer-motion";
import TeaSteam from "./TeaSteam";
import { THREE_CUPS, STATS } from "@/lib/data";
import CountUp from "./CountUp";

const ease = [0.25, 0.1, 0.25, 1];

const wordVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { delay: 0.3 + i * 0.12, duration: 0.7, ease },
  }),
};

export default function Hero() {
  const headlineWords = ["Home", "is", "Where", "the", "Work", "Is"];

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-12 overflow-hidden">
      {/* Light background */}
      <div
        className="absolute inset-0 -z-10 dark:hidden"
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, rgba(181,196,161,0.3) 0%, transparent 50%), " +
            "radial-gradient(ellipse at 70% 80%, rgba(196,136,58,0.1) 0%, transparent 50%), " +
            "linear-gradient(180deg, #FAF7F2 0%, #FAF7F2 100%)",
        }}
      />
      {/* Dark background */}
      <div
        className="absolute inset-0 -z-10 hidden dark:block"
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, rgba(45,74,62,0.5) 0%, transparent 50%), " +
            "radial-gradient(ellipse at 70% 80%, rgba(196,136,58,0.15) 0%, transparent 50%), " +
            "linear-gradient(180deg, #1A2A23 0%, #1A2A23 100%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 1 }}
        className="text-tea-amber/50 dark:text-tea-amber-light/40 mb-4"
      >
        <TeaSteam />
      </motion.div>

      <h1 className="font-display text-center leading-tight">
        <span className="flex flex-wrap justify-center gap-x-4 gap-y-2">
          {headlineWords.map((word, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={wordVariants}
              initial="hidden"
              animate="visible"
              className={`text-5xl md:text-7xl font-bold ${
                i < 4
                  ? "text-charcoal dark:text-ceramic-white"
                  : "text-tea-amber dark:text-tea-amber-light"
              }`}
            >
              {word}
            </motion.span>
          ))}
        </span>
      </h1>

<motion.p
  className="mt-4 text-lg md:text-2xl font-display text-tea-amber dark:text-tea-amber-light tracking-wider"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 1.1, duration: 0.7, ease }}
>
  Proud Father &middot; Remote Data Craftsman &middot; AI Explorer
</motion.p>

      <motion.div
        className="text-center mt-6 space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.7, ease }}
      >
        <p className="text-base md:text-lg font-sans text-charcoal/70 dark:text-ceramic-white/60">
          Senior Lead Tax Solutions Analyst &middot; Vertex Inc. &middot; Nottingham, PA
        </p>
        <p className="text-base md:text-lg font-display italic text-clay-warm dark:text-bamboo-light">
          &ldquo;Making complex things clear, one workflow at a time.&rdquo;
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl w-full">
        {THREE_CUPS.map((cup, i) => (
          <motion.div
            key={cup.title}
            className="group relative p-6 rounded-2xl border border-bamboo-light/50 dark:border-deep-forest/60
                       bg-white/60 dark:bg-dark-card/60 backdrop-blur-sm
                       hover:shadow-lg hover:shadow-tea-amber/10 dark:hover:shadow-tea-amber/5
                       hover:-translate-y-1 transition-all duration-300 cursor-default"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 + i * 0.15, duration: 0.6, ease }}
          >
            <div className="text-3xl mb-3">{cup.emoji}</div>
            <h3 className="font-display text-xl font-semibold text-charcoal dark:text-ceramic-white">
              {cup.title}
            </h3>
            <p className="mt-1 text-sm font-mono text-tea-amber dark:text-tea-amber-light">
              {cup.subtitle}
            </p>
            <p className="mt-3 text-sm font-sans text-charcoal/70 dark:text-ceramic-white/60 leading-relaxed">
              {cup.detail}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="mt-20 w-full max-w-5xl">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {STATS.map((stat) => (
            <CountUp
              key={stat.label}
              target={stat.numericValue}
              prefix={stat.prefix}
              suffix={stat.suffix}
              label={stat.label}
            />
          ))}
        </div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 0.6 }}
      >
        <span className="text-xs font-sans text-charcoal/40 dark:text-ceramic-white/30 uppercase tracking-widest">
          scroll to explore
        </span>
        <motion.svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-tea-amber/60 dark:text-tea-amber-light/50"
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <polyline points="6 9 12 15 18 9" />
        </motion.svg>
      </motion.div>
    </section>
  );
}
