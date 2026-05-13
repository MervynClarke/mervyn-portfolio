import type { Metadata } from "next";
import { Playfair_Display, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mervyn Clarke Jr. \u2014 Data Craftsman, Tax Technology Analyst, Builder",
  description:
    "Portfolio of Mervyn Clarke Jr. \u2014 Senior Lead Tax Solutions Analyst specializing in AI-enabled automation, Power BI, Alteryx, and enterprise workflow modernization. Proud father, tea enthusiast, Penn State alum.",
  openGraph: {
    title: "Mervyn Clarke Jr. \u2014 Data Craftsman",
    description:
      "AI-enabled tax research automation, international compliance, and enterprise-scale workflow modernization.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var mode = localStorage.getItem("theme");
                  if (mode === "dark" || (!mode && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
                    document.documentElement.classList.add("dark");
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
