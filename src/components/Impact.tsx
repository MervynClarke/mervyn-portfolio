"use client";

import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import CountUp from "./CountUp";
import { STATS } from "@/lib/data";

const ease = [0.25, 0.1, 0.25, 1];

export default function Impact() {
  const { ref, isInView } = useInView({ threshold: 0.2 });

  return (
    <section
      id="impact"
      className="py-24 md:py-32 px-6 bg-deep-forest dark:bg-dark-bg scroll-mt-20 relative overflow-hidden"
    >
      {/* Subtle glow effects */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-tea-amber/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-tea-amber/5 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Custom heading for dark bg */}
        <motion.div
          ref={ref}
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-ceramic-white">
            The Measurement
          </h2>
          <div className="w-16 h-0.5 bg-tea-amber mx-auto mt-4 rounded-full" />
          <p className="mt-4 text-lg text-bamboo-light/70 font-sans max-w-2xl mx-auto">
            Impact you can count
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="p-6 md:p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <CountUp
                  target={stat.numericValue}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  label={stat.label}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Quote */}
        <motion.blockquote
          className="mt-20 max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.7, ease }}
        >
          <p className="font-display text-xl md:text-2xl italic text-ceramic-white/90 leading-relaxed">
            &ldquo;I don&rsquo;t just automate tasks. I reduce risk, create
            transparency, and give people their time back. Every workflow I build
            is designed to outlive the project that created it.&rdquo;
          </p>
        </motion.blockquote>
      </div>
    </section>
  );
}
