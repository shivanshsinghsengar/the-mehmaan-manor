"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Wifi, Tv, Sparkles, MapPin, ArrowRight } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PlaceholderImage } from "@/components/placeholder-image";
import { Button } from "@/components/ui/button";

const amenities = [
  {
    number: "01",
    icon: Wifi,
    title: "High-Speed Wi-Fi",
    tagline: "For the meetings that can't wait.",
    description:
      "Fibre-optic internet that doesn't flinch when you have a deadline. Whether you're on a video call, uploading a presentation, or just streaming your playlist — consider it handled. Both homes have dedicated routers with backup connectivity.",
    image: "DETAIL — Laptop on clean desk, glowing screen, plant nearby",
  },
  {
    number: "02",
    icon: Tv,
    title: "Smart TV & Chill",
    tagline: "Your streaming queue, our big screen.",
    description:
      "A large Smart TV with Netflix, Prime, and YouTube pre-connected. Log into your account, queue up your show, and sink into the couch. Or discover something new. Either way, the remote is yours.",
    image: "INTERIOR — Smart TV wall setup, cozy sofa, warm lighting",
  },
  {
    number: "03",
    icon: Sparkles,
    title: "Cozy Spaces & Clean Vibes",
    tagline: "Spotless, styled, ready for you.",
    description:
      "Every surface is cleaned before you arrive. Every corner is styled for how you actually live — not for a photo shoot. Fresh linens, restocked toiletries, and a kitchen prepped for real use. The homes are lived-in but never lived-through.",
    image: "INTERIOR — Living room perfectly made, sunlight, fresh flowers",
  },
  {
    number: "04",
    icon: MapPin,
    title: "Prime Locations, Zero Stress",
    tagline: "Gurugram at your doorstep.",
    description:
      "Both homes sit in well-connected Gurugram pockets. Metro within minutes. Major roads easy. Markets, restaurants, and pharmacies all close. The city doesn't make you fight for access when you're staying with us.",
    image: "LIFESTYLE — Street view, accessible market, city at a glance",
  },
];

export default function ExperiencePage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach(
          (e) => e.isIntersecting && e.target.classList.add("active")
        ),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-cream">
      <Navigation />

      <main id="main-content">
        {/* Hero */}
        <section className="pt-40 pb-24 px-6">
          <div className="container mx-auto max-w-5xl text-center">
            <p className="font-mono text-gold text-sm tracking-widest uppercase mb-6 animate-fade-in">
              The Experience
            </p>
            <h1 className="text-display font-display text-forest mb-6 animate-fade-up">
              Not just a stay.
              <br />
              <span className="italic text-gold">The Mehmaan experience.</span>
            </h1>
            <p className="text-lg text-ink/80 max-w-2xl mx-auto animate-fade-up">
              Every detail considered. Every comfort provided. Every moment
              yours.
            </p>
          </div>
        </section>

        {/* Amenities — Editorial Layout */}
        {amenities.map((amenity, index) => (
          <section
            key={amenity.number}
            className={`py-20 px-6 ${index % 2 === 1 ? "bg-forest/5" : ""}`}
          >
            <div className="container mx-auto max-w-7xl">
              <div
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? "lg:grid-flow-dense" : ""
                }`}
              >
                <div
                  className={cn(
                    "reveal",
                    index % 2 === 1 ? "lg:col-start-2" : ""
                  )}
                >
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 bg-gold/10 flex items-center justify-center">
                      <amenity.icon className="text-gold" size={24} />
                    </div>
                    <span className="font-mono text-gold text-sm">
                      {amenity.number}
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-display text-forest mb-3">
                    {amenity.title}
                  </h2>
                  <p className="text-xl italic text-ink/60 mb-6 font-display">
                    {amenity.tagline}
                  </p>
                  <p className="text-ink/80 leading-relaxed text-lg">
                    {amenity.description}
                  </p>
                </div>
                <div
                  className={cn(
                    "image-hover reveal",
                    index % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""
                  )}
                >
                  <PlaceholderImage
                    caption={amenity.image}
                    aspectRatio="landscape"
                  />
                </div>
              </div>
            </div>
          </section>
        ))}

        {/* The Promise */}
        <section className="py-32 px-6 bg-forest text-cream">
          <div className="container mx-auto max-w-4xl text-center reveal">
            <h2 className="text-4xl md:text-5xl font-display mb-8">
              The Mehmaan Promise
            </h2>
            <p className="text-lg text-cream/80 leading-relaxed max-w-2xl mx-auto mb-12">
              We don't just hand over keys. We make sure you have everything you
              need — before you know you need it. If something isn't right, you
              have a real human to call. That's not customer service. That's
              hospitality.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <p className="text-5xl font-display text-gold mb-2">24/7</p>
                <p className="text-cream/70">Host availability</p>
              </div>
              <div className="text-center">
                <p className="text-5xl font-display text-gold mb-2">2</p>
                <p className="text-cream/70">Curated properties</p>
              </div>
              <div className="text-center">
                <p className="text-5xl font-display text-gold mb-2">∞</p>
                <p className="text-cream/70">Memories made</p>
              </div>
            </div>
            <Button asChild size="lg" variant="gold">
              <Link href="/contact">
                Plan Your Stay
                <ArrowRight className="ml-2" size={20} />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

// Helper for cn inside this file
function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
