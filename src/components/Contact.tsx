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
    <section id="contact" className="py-20 sm:py-28 px-6 text-center">
  <div className="max-w-2xl mx-auto">

    {/* Title */}
    <h2 className="font-display text-4xl sm:text-5xl text-[#FAF7F2] font-bold">
      The Open Door
    </h2>

    {/* Subtitle */}
    <p className="mt-4 text-[#D4C9A8]/70 text-lg leading-relaxed">
      I’m always happy to answer questions — about tax tech, about automation,
      about tea, about anything.
    </p>

    {/* Contact Info */}
    <div className="mt-12 space-y-6 text-left sm:text-center">

      {/* Email */}
      <div>
        <p className="text-sm text-[#D4C9A8]/60">Email</p>
        <a
          href="mailto:mervclarke21@gmail.com"
          className="text-[#C4883A] hover:underline"
        >
          mervclarke21@gmail.com
        </a>
      </div>

      {/* LinkedIn */}
      <div>
        <p className="text-sm text-[#D4C9A8]/60">LinkedIn</p>
        <a
          href="https://linkedin.com/in/mervynclarke"
          target="_blank"
          className="text-[#C4883A] hover:underline"
        >
          linkedin.com/in/mervynclarke
        </a>
      </div>

    </div>
  </div>
</section>
  );
}
