import type { Metadata } from "next";
import { Inter, Cormorant_Garamond, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { WhatsAppButton } from "@/components/whatsapp-button";

// ─── Fonts ────────────────────────────────────────────────────────────────────
// Using Inter for body text, Cormorant Garamond for headings (premium feel),
// and JetBrains Mono for labels and pricing.

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500"],
});

// ─── Site-wide metadata ───────────────────────────────────────────────────────
// Page-specific metadata is defined in each page file using generateMetadata.
// This is just the fallback / default that applies to any page that doesn't
// override it.

const SITE_URL = "https://themehmaan.vercel.app";
const SITE_NAME = "The Mehmaan Manor";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "The Mehmaan Manor – Boutique Homestay in Gurugram",
    template: "%s – The Mehmaan Manor",
  },

  description:
    "Two beautifully curated homes in Gurugram, Haryana. Not a hotel — a real home with warm hosts. Stay in Sushant Lok (Sector 57) or near Medanta (Sector 39). Starting from ₹1,999/night.",

  keywords: [
    "boutique homestay Gurugram",
    "short stay Gurugram",
    "vacation rental Gurugram",
    "Mehmaan Manor",
    "homestay Sector 57 Gurugram",
    "homestay near Medanta",
    "Sushant Lok homestay",
    "Sector 39 Gurugram stay",
    "fully furnished apartment Gurugram",
    "corporate stay Gurugram",
    "family stay Gurugram",
  ],

  authors: [{ name: "The Mehmaan Manor", url: SITE_URL }],

  alternates: {
    canonical: SITE_URL,
  },

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "The Mehmaan Manor – Boutique Homestay in Gurugram",
    description:
      "Two homes in Gurugram. Warm hosts. Real hospitality. Come as a guest, leave as family.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "The Mehmaan Manor – Boutique Homestay in Gurugram, Haryana",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@themehmaanmanor",
    title: "The Mehmaan Manor – Boutique Homestay in Gurugram",
    description: "Two homes in Gurugram. Warm hosts. Real hospitality.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  verification: {
    // Add Google Search Console verification code here when ready
    // google: "xxxxxxxxxxxxxxxx",
  },
};

// ─── Structured data (JSON-LD) ────────────────────────────────────────────────
// Two separate LodgingBusiness entries — one per property.
// This helps Google show rich results (address, phone, ratings) in search.

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: "The Mehmaan Manor – Sushant Lok",
    description:
      "Premium boutique homestay in Sushant Lok, Sector 57, Gurugram. Peaceful surroundings, great connectivity, warm hosts.",
    url: `${SITE_URL}/homes/sushant-lok`,
    telephone: "+918828352311",
    priceRange: "₹₹",
    image: `${SITE_URL}/og-image.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "G-219, G-Block, Sushant Lok-2, Sector 57",
      addressLocality: "Gurugram",
      addressRegion: "Haryana",
      postalCode: "122011",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "28.4233",
      longitude: "77.0890",
    },
    sameAs: ["https://www.instagram.com/the_mehmaan_manor"],
    containsPlace: {
      "@type": "Accommodation",
      name: "The Mehmaan Manor – Sushant Lok",
      numberOfRooms: 2,
      amenityFeature: [
        { "@type": "LocationFeatureSpecification", name: "Free WiFi", value: true },
        { "@type": "LocationFeatureSpecification", name: "Air Conditioning", value: true },
        { "@type": "LocationFeatureSpecification", name: "Balcony", value: true },
      ],
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: "The Mehmaan Manor – Sector 39",
    description:
      "Boutique homestay near Medanta Hospital and Millennium City Centre Metro, Sector 39, Gurugram. Studio and 2BHK options available.",
    url: `${SITE_URL}/homes/jharsa-village`,
    telephone: "+918828352311",
    priceRange: "₹₹",
    image: `${SITE_URL}/og-image.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "593, Durga Colony, Jharsa Road, Near Unitech Cyber Park, Sector 39",
      addressLocality: "Gurugram",
      addressRegion: "Haryana",
      postalCode: "122003",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "28.4396",
      longitude: "77.0525",
    },
    sameAs: ["https://www.instagram.com/the_mehmaan_manor"],
  },
];

// ─── Root layout ──────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en-IN"
      className={`${inter.variable} ${cormorant.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="font-sans bg-[#faf8f4] text-ink antialiased">
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
