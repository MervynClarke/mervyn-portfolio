"use client";

import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import SectionHeading from "./SectionHeading";
import { BEYOND_WORK } from "@/lib/data";

const ease = [0.25, 0.1, 0.25, 1];

function BeyondCard({
  item,
  index,
}: {
  item: (typeof BEYOND_WORK)[number];
  index: number;
}) {
  const { ref, isInView } = useInView({ threshold: 0.2 });
  const isReversed = index % 2 !== 0;

  // Split body into first sentence and rest
  const firstDot = item.body.indexOf(".");
  const firstSentence =
    firstDot > 0 ? item.body.slice(0, firstDot + 1) : item.body;
  const rest = firstDot > 0 ? item.body.slice(firstDot + 1).trim() : "";

  return (
    <motion.div
      ref={ref}
      className={`flex flex-col md:flex-row items-center gap-8 ${
        isReversed ? "md:flex-row-reverse" : ""
      }`}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease }}
    >
      {/* Emoji */}
      <div
        className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-2xl
                    bg-sage-soft/30 dark:bg-deep-forest/40
                    flex items-center justify-center"
      >
        <span className="text-5xl md:text-6xl">{item.emoji}</span>
      </div>

      {/* Text */}
      <div className="flex-1">
        <h3 className="font-display text-2xl font-bold text-charcoal dark:text-ceramic-white mb-3">
          {item.title}
        </h3>
        <p className="font-sans text-base text-charcoal/80 dark:text-ceramic-white/75 leading-relaxed">
          <span className="font-display italic text-clay-warm dark:text-bamboo-light">
            {firstSentence}
          </span>{" "}
          {rest}
        </p>
      </div>
    </motion.div>
  );
}

export default function BeyondWork() {
  return (
    <section
      id="beyond"
      className="py-24 md:py-32 px-6 bg-sage-soft/10 dark:bg-deep-forest/15 scroll-mt-20"
    >
      <div className="max-w-4xl mx-auto">
        <SectionHeading
          id="beyond-heading"
          title="The Garden"
          subtitle="The person behind the portfolio"
        />

        <div className="space-y-16 mt-12">
          {BEYOND_WORK.map((item, i) => (
            <BeyondCard key={item.title} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
