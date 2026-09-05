import type { Metadata } from "next";
import { Inter, Cormorant_Garamond, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { WhatsAppButton } from "@/components/whatsapp-button";

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

export const metadata: Metadata = {
  title: {
    default: "The Mehmaan Manor - Boutique Homestay in Gurugram",
    template: "%s | The Mehmaan Manor",
  },
  description:
    "Two beautifully curated homes in Gurugram. Not a hotel. Not a rental. A Mehmaan experience where guests arrive as guests and leave as family.",
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
    title: "The Mehmaan Manor - Boutique Homestay in Gurugram",
    description:
      "Two homes in Gurugram. One promise. Come as a guest, leave as family.",
    images: [
      {
        url: "https://www.mehmaanmanor.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "The Mehmaan Manor - Boutique Homestay in Gurugram",
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
    <html
      lang="en-IN"
      className={`${inter.variable} ${cormorant.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "LodgingBusiness",
                name: "The Mehmaan Manor - Sushant Lok",
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
                sameAs: ["https://www.instagram.com/the_mehmaan_manor"],
              },
              {
                "@context": "https://schema.org",
                "@type": "LodgingBusiness",
                name: "The Mehmaan Manor - Jharsa Village",
                description:
                  "Premium boutique homestay in Jharsa Village, Sector 39, Gurugram. Cozy neighborhood, close to everything.",
                url: "https://www.mehmaanmanor.com/homes/jharsa-village",
                telephone: "+918828352311",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "593, Durga Colony, Jharsa Village, Sector 39",
                  addressLocality: "Gurugram",
                  addressRegion: "Haryana",
                  postalCode: "122003",
                  addressCountry: "IN",
                },
                sameAs: ["https://www.instagram.com/the_mehmaan_manor"],
              },
            ]),
          }}
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
