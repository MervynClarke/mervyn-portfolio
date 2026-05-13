"use client";

import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import SectionHeading from "./SectionHeading";

const ease = [0.25, 0.1, 0.25, 1];

const paragraphs = [
  "I didn't stumble into this field — I chose it.",
  "I went to Penn State for a B.S. in Accounting with a minor in Information Science and Technology,plus a certificate in Corporate Control & Financial Management. From the start, I was drawn to both sides — the discipline of accounting and the leverage of technology.",
  "To get there, I worked. I managed dining for 2,000 guests for Penn State Food Services, directed Tea House Operations for the Gong Fu Cha Club, and prepared taxes for the community through VITA. Every one of those roles taught me something I still use today — how to build systems, how to serve people, and how to stay calm when it matters most.",
  'Gong Fu Cha — 功夫茶 — means "making tea with great skill." It\'s about patience, precision, and the belief that every infusion reveals something new. That philosophy stuck with me.',
  "Today, I apply that same craft to tax technology. I take messy, legacy-bound processes and — through Alteryx, Python, Power BI, and AI — turn them into something governed, repeatable, and clear. I've maintained 2,000+ taxability categories, built dashboards used in executive strategy sessions, and helped design AI agents that consolidate 60+ documents into a single queryable experience.",
  "Outside of work, I'm a father of three boys under six — that's the title I'm proudest of. I'm also a Tang Soo Do practitioner, a gardener, a weekend DIY renovator, and an occasional potter who finds something meditative about shaping clay on a wheel. I earned a Master's in Data Science because I wanted to understand the math behind the tools I use every day, and a Certificate in Sustainability Leadership because I believe what we build should outlast us."
];

const floatingTags = [
  { label: "#ProudFather", x: 10, delay: 0 },
  { label: "#DataEnthusiast", x: 60, delay: 0.3 },
  { label: "#GongFuCha", x: 25, delay: 0.7 },
  { label: "#TeaLover", x: 55, delay: 1.0 },
  { label: "Sustainability", x: 15, delay: 0.5 },
  { label: "#Gardener", x: 70, delay: 0.8 },
  { label: "#NaturalBuilding", x: 20, delay: 0.2 },
  { label: "#MartialArtist", x: 50, delay: 0.4 },
  { label: "#Pottery", x: 15, delay: 0.6 },
];

const interests = [
  { emoji: "\uD83C\uDF75", label: "Tea" },
  { emoji: "\uD83C\uDF3F", label: "Garden" },
  { emoji: "\u267B\uFE0F", label: "Sustainability" },
  { emoji: "\uD83C\uDFD7\uFE0F", label: "Natural Building" },
  { emoji: "\uD83C\uDFC0", label: "Basketball" },
  { emoji: "\uD83C\uDFC8", label: "Football" },
  { emoji: "\uD83E\uDD4B", label: "Tang Soo Do" },
  { emoji: "\uD83D\uDCD6", label: "LitRPG"},
  { emoji: "\uD83C\uDFAE", label: "RPG Games" },
];

export default function About() {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <section id="about" className="py-24 md:py-32 px-6 scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          id="about-heading"
          title="Every Infusion Tells a Story"
          subtitle="功夫茶 — Making tea with great skill"
        />

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-5 gap-12 mt-12">
          <div className="lg:col-span-3 space-y-6">
            {paragraphs.map((text, i) => (
              <motion.p
                key={i}
                className={`font-sans leading-relaxed ${
                  i === 0
                    ? "text-2xl md:text-3xl font-display italic text-clay-warm dark:text-bamboo-light"
                    : "text-base md:text-lg text-charcoal/85 dark:text-ceramic-white/80"
                }`}
                initial={{ opacity: 0, y: 25 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.6, ease }}
              >
                {text}
              </motion.p>
            ))}
          </div>

          <div className="lg:col-span-2 relative min-h-[400px] hidden lg:block overflow-hidden">
            {floatingTags.map((tag, i) => (
              <motion.span
                key={tag.label}
                className="absolute inline-block px-4 py-2 rounded-full text-sm font-sans font-medium
                           bg-sage-soft/40 text-clay-warm border border-sage-soft/60
                           dark:bg-deep-forest/50 dark:text-tea-amber-light dark:border-deep-forest"
                style={{ left: `${tag.x}%`, top: `${i * 11 + 5}%` }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={
                  isInView
                    ? {
                        opacity: 1,
                        scale: 1,
                        y: [0, -8, 0, 6, 0],
                      }
                    : {}
                }
                transition={{
                  opacity: { delay: tag.delay + 0.5, duration: 0.5 },
                  scale: { delay: tag.delay + 0.5, duration: 0.5 },
                  y: {
                    delay: tag.delay + 1,
                    duration: 4 + i * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
              >
                {tag.label}
              </motion.span>
            ))}
          </div>
        </div>

        <motion.div
          className="mt-16 flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1, duration: 0.6, ease }}
        >
          {interests.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 px-5 py-3 rounded-xl
                         bg-white dark:bg-dark-card border border-bamboo-light/40 dark:border-deep-forest/50
                         hover:border-tea-amber/40 dark:hover:border-tea-amber/30
                         transition-colors duration-200"
            >
              <span className="text-xl">{item.emoji}</span>
              <span className="text-sm font-sans text-charcoal/80 dark:text-ceramic-white/70">
                {item.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
