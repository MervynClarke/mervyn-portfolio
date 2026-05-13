"use client";

import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  id: string;
}

export default function SectionHeading({
  title,
  subtitle,
  id,
}: SectionHeadingProps) {
  const { ref, isInView } = useInView({ threshold: 0.3 });

  return (
    <motion.div
      ref={ref}
      id={id}
      className="text-center mb-16 scroll-mt-24"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <h2 className="font-display text-4xl md:text-5xl font-bold text-charcoal dark:text-ceramic-white">
        {title}
      </h2>
      <div className="section-divider mt-4" />
      {subtitle && (
        <p className="mt-4 text-lg text-clay-warm dark:text-bamboo-light font-sans max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
