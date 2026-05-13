"use client";

export default function Footer() {
  return (
    <footer className="border-t border-bamboo-light/30 dark:border-deep-forest/40 py-12 px-6">
      <div className="max-w-5xl mx-auto text-center space-y-4">
        <p className="font-display text-lg italic text-clay-warm dark:text-bamboo-light">
          功夫茶 &mdash; Making tea with great skill. Making data with great care.
        </p>

        <div className="flex items-center justify-center gap-6">
          <a
            href="mailto:mervclarke21@gmail.com"
            className="text-sm font-sans text-charcoal/50 dark:text-ceramic-white/40
                       hover:text-tea-amber dark:hover:text-tea-amber-light transition-colors"
            aria-label="Email"
          >
            Email
          </a>
          <span className="text-charcoal/20 dark:text-ceramic-white/20">&middot;</span>
          <a
            href="https://www.linkedin.com/in/mervynclarke"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-sans text-charcoal/50 dark:text-ceramic-white/40
                       hover:text-tea-amber dark:hover:text-tea-amber-light transition-colors"
            aria-label="LinkedIn"
          >
            LinkedIn
          </a>
        </div>

        <p className="text-xs font-sans text-charcoal/35 dark:text-ceramic-white/25">
          &copy; {new Date().getFullYear()} Mervyn Clarke Jr. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
