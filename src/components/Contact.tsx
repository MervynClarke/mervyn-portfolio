"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import SectionHeading from "./SectionHeading";

const ease = [0.25, 0.1, 0.25, 1];

export default function Contact() {
  const { ref, isInView } = useInView({ threshold: 0.2 });
  const [submitted, setSubmitted] = useState(false);

  const formEndpoint =
    typeof window !== "undefined"
      ? (process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? "#")
      : "#";

  return (
    <section id="contact" className="py-24 md:py-32 px-6 scroll-mt-20">
      <div className="max-w-5xl mx-auto">
        <SectionHeading
          id="contact-heading"
          title="The Open Door"
          subtitle="I\u2019m always happy to answer questions \u2014 about tax tech, about automation, about tea, about anything."
        />

        <motion.div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
        >
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-tea-amber/10 dark:bg-tea-amber/20 flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-tea-amber dark:text-tea-amber-light">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-sans font-semibold text-charcoal dark:text-ceramic-white">Email</p>
                <a href="mailto:mervclarke21@gmail.com" className="text-sm font-sans text-tea-amber dark:text-tea-amber-light hover:underline">
                  mervclarke21@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-tea-amber/10 dark:bg-tea-amber/20 flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-tea-amber dark:text-tea-amber-light">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-sans font-semibold text-charcoal dark:text-ceramic-white">LinkedIn</p>
                <a href="https://www.linkedin.com/in/mervynclarke" target="_blank" rel="noopener noreferrer" className="text-sm font-sans text-tea-amber dark:text-tea-amber-light hover:underline">
                  linkedin.com/in/mervynclarke
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-tea-amber/10 dark:bg-tea-amber/20 flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-tea-amber dark:text-tea-amber-light">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-sans font-semibold text-charcoal dark:text-ceramic-white">Phone</p>
                <a href="tel:+17178249843" className="text-sm font-sans text-tea-amber dark:text-tea-amber-light hover:underline">
                  717-824-9843
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          {submitted ? (
            <div className="flex items-center justify-center p-12 rounded-2xl border border-sage-soft/50 dark:border-deep-forest/50 bg-sage-soft/20 dark:bg-deep-forest/20">
              <div className="text-center">
                <span className="text-4xl">🍵</span>
                <p className="mt-4 font-display text-xl text-charcoal dark:text-ceramic-white">Thank you!</p>
                <p className="mt-2 text-sm font-sans text-charcoal/60 dark:text-ceramic-white/50">I&apos;ll get back to you soon.</p>
              </div>
            </div>
          ) : (
            <form
              action={formEndpoint}
              method="POST"
              onSubmit={(e) => {
                if (formEndpoint === "#") {
                  e.preventDefault();
                  setSubmitted(true);
                }
              }}
              className="space-y-5"
            >
              <div>
                <label htmlFor="name" className="block text-sm font-sans font-medium text-charcoal dark:text-ceramic-white mb-1.5">Name</label>
                <input type="text" id="name" name="name" required className="w-full px-4 py-3 rounded-xl border border-bamboo-light/60 dark:border-deep-forest/60 bg-white dark:bg-dark-card text-charcoal dark:text-ceramic-white font-sans text-sm placeholder:text-charcoal/30 dark:placeholder:text-ceramic-white/30 focus:outline-none focus:ring-2 focus:ring-tea-amber/40 dark:focus:ring-tea-amber-light/40 transition-all" placeholder="Your name" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-sans font-medium text-charcoal dark:text-ceramic-white mb-1.5">Email</label>
                <input type="email" id="email" name="email" required className="w-full px-4 py-3 rounded-xl border border-bamboo-light/60 dark:border-deep-forest/60 bg-white dark:bg-dark-card text-charcoal dark:text-ceramic-white font-sans text-sm placeholder:text-charcoal/30 dark:placeholder:text-ceramic-white/30 focus:outline-none focus:ring-2 focus:ring-tea-amber/40 dark:focus:ring-tea-amber-light/40 transition-all" placeholder="you@example.com" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-sans font-medium text-charcoal dark:text-ceramic-white mb-1.5">Message</label>
                <textarea id="message" name="message" required rows={5} className="w-full px-4 py-3 rounded-xl border border-bamboo-light/60 dark:border-deep-forest/60 bg-white dark:bg-dark-card text-charcoal dark:text-ceramic-white font-sans text-sm placeholder:text-charcoal/30 dark:placeholder:text-ceramic-white/30 focus:outline-none focus:ring-2 focus:ring-tea-amber/40 dark:focus:ring-tea-amber-light/40 transition-all resize-none" placeholder="What's on your mind?" />
              </div>
              <button type="submit" className="w-full py-3.5 rounded-xl bg-tea-amber dark:bg-tea-amber-light text-white font-sans font-semibold text-sm hover:bg-clay-warm dark:hover:bg-tea-amber active:scale-[0.98] transition-all duration-200">
                Send Message
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
