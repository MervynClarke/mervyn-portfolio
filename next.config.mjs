/** @type {import("next").NextConfig} */

// Tang Soo Do study pages are self-contained static files in /public/tsd/.
// These rewrites serve them at clean, extension-less URLs (e.g. /YellowBelt).
const tsdSlugs = [
  "YellowBelt", "OrangeBelt", "OrangeStripeBelt", "GreenBelt", "GreenStripeBelt",
  "BrownBelt", "BrownStripeBelt", "RedBelt", "RedStripeBelt", "ChoDanBo",
  "BlackBelt", "TangSooDoTerms",
];

const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      // Forgiving casing for the Tea Tasting app (canonical route: /TeaTasting).
      // NOTE: a redirect here would loop — Next matches sources case-insensitively,
      // so "/teatasting" also matches "/TeaTasting". An afterFiles rewrite is safe.
      { source: "/teatasting", destination: "/TeaTasting" },
      // Same forgiving-casing rewrite for Yoga Tracker (canonical: /YogaTracker).
      { source: "/yogatracker", destination: "/YogaTracker" },
      // Tang Soo Do study pages -> /public/tsd/<Slug>.html
      ...tsdSlugs.map((slug) => ({
        source: `/${slug}`,
        destination: `/tsd/${slug}.html`,
      })),
      // License Plate Game -> self-contained static file in /public/LPGame/
      { source: "/LPGame", destination: "/LPGame/index.html" },
    ];
  },
};

export default nextConfig;
