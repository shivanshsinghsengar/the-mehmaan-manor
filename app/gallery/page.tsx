"use client";

import { useEffect, useState } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PlaceholderImage } from "@/components/placeholder-image";
import { cn } from "@/lib/utils";

const categories = ["All", "Sushant Lok", "Jharsa Village", "Interiors", "Details", "Lifestyle"];

const images = [
  { id: 1, caption: "SUSHANT LOK — Exterior dusk view", category: ["All", "Sushant Lok"] },
  { id: 2, caption: "INTERIOR — Living room warmth", category: ["All", "Interiors", "Sushant Lok"] },
  { id: 3, caption: "DETAIL — Brass fixture close-up", category: ["All", "Details"] },
  { id: 4, caption: "JHARSA — Cozy exterior", category: ["All", "Jharsa Village"] },
  { id: 5, caption: "LIFESTYLE — Morning coffee moment", category: ["All", "Lifestyle"] },
  { id: 6, caption: "INTERIOR — Bedroom sanctuary", category: ["All", "Interiors", "Jharsa Village"] },
  { id: 7, caption: "DETAIL — Ceramic vessel, textile", category: ["All", "Details"] },
  { id: 8, caption: "SUSHANT LOK — Garden area", category: ["All", "Sushant Lok"] },
  { id: 9, caption: "LIFESTYLE — Guest reading by window", category: ["All", "Lifestyle"] },
  { id: 10, caption: "INTERIOR — Kitchen modern", category: ["All", "Interiors"] },
  { id: 11, caption: "JHARSA — Neighborhood character", category: ["All", "Jharsa Village"] },
  { id: 12, caption: "DETAIL — Textured throws, plants", category: ["All", "Details"] },
];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("active")),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const filteredImages = images.filter((img) =>
    img.category.includes(activeCategory)
  );

  return (
    <div className="min-h-screen bg-cream">
      <Navigation />

      <main id="main-content">
        {/* Hero */}
        <section className="pt-40 pb-16 px-6">
          <div className="container mx-auto max-w-5xl text-center">
            <p className="font-mono text-gold text-sm tracking-widest uppercase mb-6 animate-fade-in">
              Gallery
            </p>
            <h1 className="text-display font-display text-forest mb-6 animate-fade-up">
              A Visual Story
            </h1>
            <p className="text-lg text-ink/80 max-w-2xl mx-auto animate-fade-up">
              Every corner, every detail, every moment captured.
            </p>
          </div>
        </section>

        {/* Filter Tabs */}
        <section className="pb-12 px-6">
          <div className="container mx-auto max-w-7xl">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={cn(
                    "px-6 py-2 text-sm font-medium transition-all duration-300",
                    activeCategory === category
                      ? "bg-forest text-cream"
                      : "bg-cream text-forest border border-forest/20 hover:border-forest"
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="pb-24 px-6">
          <div className="container mx-auto max-w-7xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredImages.map((image, i) => (
                <div
                  key={image.id}
                  className="reveal image-hover"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <PlaceholderImage
                    caption={image.caption}
                    aspectRatio="portrait"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
