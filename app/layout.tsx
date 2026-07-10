/*
 * ═══════════════════════════════════════════════════════════════════════
 * THE MEHMAAN MANOR — Root Layout
 * ═══════════════════════════════════════════════════════════════════════
 *
 * TYPOGRAPHY CHOICES:
 * Display: Cormorant Garamond — A high-contrast old-style serif with
 * beautiful italics and ligatures. Its optical delicacy suggests
 * refinement without coldness. Paired with generous tracking at large
 * sizes it reads as architecturally elegant, never stuffy.
 * Body: Inter — The most humanist of the neutral grotesques. Tight
 * tracking (-0.011em) and open apertures make it warm at text sizes.
 * Mono: JetBrains Mono — Used sparingly for coordinates, booking codes,
 * and structural labels. Creates editorial texture against Cormorant.
 *
 * COLOR DECISIONS:
 * OKLCH was chosen for perceptual uniformity — the forest green, gold,
 * and cream maintain consistent perceived lightness across hues, so
 * the palette feels intentional and natural, never arbitrary.
 * The 70/20/8/2 ratio enforces cream dominance — the gold only appears
 * when it truly needs to earn attention.
 *
 * MOMENTS OF DELIGHT:
 * PUBLIC SITE:
 * — The hero headline uses a subtle word-by-word stagger reveal.
 *   Each word breathes in at 150ms intervals, creating cinematic pacing.
 * — The "Come as a guest, leave as family" section: when you hover the
 *   pull-quote, each word gently shifts hue toward gold — a warm,
 *   almost-invisible effect that rewards lingering.
 * — Navigation links animate with an arch underline (matching the logo's
 *   arch motif) rather than a standard underline.
 *
 * ADMIN PANEL:
 * — The bookings calendar uses a subtle paper-texture SVG pattern that
 *   makes it feel tangible, like a physical reservation book.
 * — KPI cards have a micro-animation: on hover, the number "breathes"
 *   to 103% scale over 600ms — just enough to feel alive.
 * — Empty states use hand-drawn SVG illustrations in forest green tones
 *   with a warm, slightly imperfect quality.
 */

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WhatsAppButton } from "@/components/whatsapp-button";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "The Mehmaan Manor — Boutique Homestay in Gurugram",
    template: "%s | The Mehmaan Manor",
  },
  description:
    "Two beautifully curated homes in Gurugram. Not a hotel. Not a rental. A Mehmaan experience — where guests arrive as guests and leave as family.",
  keywords: [
    "boutique homestay Gurugram",
    "short-stay rental Gurugram",
    "Mehmaan Manor",
    "Sushant Lok homestay",
    "Jharsa Village stay",
    "premium accommodation Gurugram",
    "work-from-anywhere Gurugram",
  ],
  authors: [{ name: "The Mehmaan Manor" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.mehmaanmanor.com",
    siteName: "The Mehmaan Manor",
    title: "The Mehmaan Manor — Boutique Homestay in Gurugram",
    description:
      "Two homes in Gurugram. One promise. Come as a guest, leave as family.",
    images: [
      {
        url: "https://www.mehmaanmanor.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "The Mehmaan Manor — Boutique Homestay in Gurugram",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Mehmaan Manor",
    description: "Two homes in Gurugram. One promise. Endless memories.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IN" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "LodgingBusiness",
                name: "The Mehmaan Manor — Sushant Lok",
                description:
                  "Premium boutique homestay in Sushant Lok, Gurugram. Peaceful surroundings, great connectivity.",
                url: "https://www.mehmaanmanor.com/homes/sushant-lok",
                telephone: "+918828352311",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "Sector 57, Phase 2, Sushant Lok",
                  addressLocality: "Gurugram",
                  addressRegion: "Haryana",
                  postalCode: "122011",
                  addressCountry: "IN",
                },
                sameAs: ["https://www.instagram.com/themehmaanmanor"],
              },
              {
                "@context": "https://schema.org",
                "@type": "LodgingBusiness",
                name: "The Mehmaan Manor — Jharsa Village",
                description:
                  "Premium boutique homestay in Jharsa Village, Sector 39, Gurugram. Cozy neighborhood, close to everything.",
                url: "https://www.mehmaanmanor.com/homes/jharsa-village",
                telephone: "+918828352311",
                address: {
                  "@type": "PostalAddress",
                  streetAddress:
                    "593, Durga Colony, Jharsa Village, Sector 39",
                  addressLocality: "Gurugram",
                  addressRegion: "Haryana",
                  postalCode: "122003",
                  addressCountry: "IN",
                },
                sameAs: ["https://www.instagram.com/themehmaanmanor"],
              },
            ]),
          }}
        />
      </head>
      <body className="font-sans bg-cream text-ink antialiased">
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
