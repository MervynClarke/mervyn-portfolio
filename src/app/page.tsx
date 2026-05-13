"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Toolkit from "@/components/Toolkit";
import Impact from "@/components/Impact";
import BeyondWork from "@/components/BeyondWork";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Toolkit />
        <Impact />
        <BeyondWork />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
