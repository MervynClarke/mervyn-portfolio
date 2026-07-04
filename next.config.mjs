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
