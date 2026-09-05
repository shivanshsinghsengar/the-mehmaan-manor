"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Wifi, Tv, Sparkles, MapPin, ArrowRight } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PlaceholderImage } from "@/components/placeholder-image";
import Link from "next/link";

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
    <div className="min-h-screen bg-[#faf8f4]">
      <Navigation />

      <main id="main-content">
        {/* Hero */}
        <section className="pt-28 md:pt-36 pb-10 md:pb-16 px-4 md:px-6 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <span className="label-badge text-gold">The Experience</span>
            <h1 className="font-display text-display text-forest mt-3 mb-4 leading-tight">
              Not just a stay.
              <br />
              <span className="italic text-gold">The Mehmaan experience.</span>
            </h1>
            <p className="text-base md:text-lg text-ink/65 max-w-2xl mx-auto">
              Every detail considered. Every comfort provided. Every moment yours.
            </p>
          </div>
        </section>

        {/* Amenities */}
        {amenities.map((amenity, index) => (
          <section
            key={amenity.number}
            className={`py-10 md:py-16 px-4 md:px-6 ${index % 2 === 1 ? "bg-[#eee9df]" : "bg-[#faf8f4]"}`}
          >
            <div className="max-w-5xl mx-auto">
              <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center ${index % 2 === 1 ? "lg:grid-flow-dense" : ""}`}>
                <div className={cn("reveal", index % 2 === 1 ? "lg:col-start-2" : "")}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white border border-forest/8 flex items-center justify-center">
                      <amenity.icon className="text-gold" size={18} />
                    </div>
                    <span className="font-mono text-xs text-gold tracking-widest">{amenity.number}</span>
                  </div>
                  <h2 className="font-display text-2xl md:text-3xl text-forest mb-2">{amenity.title}</h2>
                  <p className="text-base italic text-ink/50 mb-4 font-display">{amenity.tagline}</p>
                  <p className="text-ink/70 leading-relaxed text-sm md:text-base">{amenity.description}</p>
                </div>
                <div className={cn("image-hover reveal rounded-2xl overflow-hidden", index % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : "")}>
                  <PlaceholderImage caption={amenity.image} aspectRatio="landscape" variant="light" />
                </div>
              </div>
            </div>
          </section>
        ))}

        {/* The Promise — light version */}
        <section className="py-14 md:py-24 px-4 md:px-6 bg-[#eee9df]">
          <div className="max-w-4xl mx-auto text-center reveal">
            <span className="label-badge text-gold">Our Promise</span>
            <h2 className="font-display text-title text-forest mt-3 mb-5">The Mehmaan Promise</h2>
            <p className="text-ink/65 leading-relaxed max-w-2xl mx-auto mb-10 text-sm md:text-base">
              We don't just hand over keys. We make sure you have everything you need — before you know you need it. Real humans, real care, real hospitality.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
              {[
                { stat: "24/7", label: "Host availability" },
                { stat: "2", label: "Curated properties" },
                { stat: "4.9★", label: "Guest rating" },
              ].map((s) => (
                <div key={s.stat} className="bg-white rounded-2xl p-6 border border-forest/8 hover:shadow-sm transition-shadow">
                  <p className="font-display text-4xl text-forest mb-1">{s.stat}</p>
                  <p className="text-ink/55 text-sm">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://wa.me/918828352311"
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#25D366] text-white font-semibold text-sm hover:bg-[#1fb558] transition-colors min-h-[52px]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                Plan Your Stay on WhatsApp
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl border-2 border-forest text-forest font-semibold text-sm hover:bg-forest hover:text-cream transition-all min-h-[52px]"
              >
                Contact Us <ArrowRight size={14} className="ml-1.5" />
              </Link>
            </div>
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
