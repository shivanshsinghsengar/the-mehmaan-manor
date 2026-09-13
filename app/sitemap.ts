// Sitemap for The Mehmaan Manor.
// This file is picked up automatically by Next.js and served at /sitemap.xml.
// Only listing pages that actually exist — having dead links here would hurt
// our Google ranking more than help it.

import type { MetadataRoute } from "next";

const BASE = "https://themehmaan.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // Homepage — highest priority, check weekly since content changes
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },

    // Property listing page
    {
      url: `${BASE}/homes`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    // Individual property pages — these are the money pages
    {
      url: `${BASE}/homes/sushant-lok`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.95,
    },
    {
      url: `${BASE}/homes/jharsa-village`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.95,
    },

    // About page — helps with brand trust and local SEO
    {
      url: `${BASE}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },

    // Experience page — the interactive manor walkthrough
    {
      url: `${BASE}/experience`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },

    // Gallery — good for image search
    {
      url: `${BASE}/gallery`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.65,
    },

    // Contact & booking pages
    {
      url: `${BASE}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE}/book`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.85,
    },
  ];
}
