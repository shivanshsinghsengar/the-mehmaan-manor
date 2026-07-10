"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PlaceholderImage } from "@/components/placeholder-image";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export default function HomesPage() {
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
              Our Properties
            </p>
            <h1 className="text-display font-display text-forest mb-6 animate-fade-up">
              Two Homes. One Standard of Care.
            </h1>
            <p className="text-lg text-ink/80 max-w-2xl mx-auto animate-fade-up">
              In two distinct Gurugram neighborhoods, each home has been
              individually curated — with the same promise: you'll want to come
              back.
            </p>
          </div>
        </section>

        {/* Divider */}
        <div className="arch-divider mb-24" />

        {/* Home 01 */}
        <section className="py-16 px-6">
          <div className="container mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1 reveal">
                <p className="font-mono text-gold text-sm tracking-widest mb-4">
                  HOME 01
                </p>
                <h2 className="text-4xl md:text-5xl font-display text-forest mb-4">
                  Sushant Lok
                </h2>
                <div className="flex items-center space-x-2 mb-6">
                  <MapPin size={16} className="text-gold" />
                  <span className="font-mono text-sm text-ink/60">
                    Sector 57, Phase 2 · 28.4212° N, 77.0761° E
                  </span>
                </div>
                <p className="text-lg text-ink/80 leading-relaxed mb-8">
                  Peaceful surroundings, great connectivity — perfect for work
                  or to unwind. Tucked into a quiet residential pocket with
                  verdant surroundings, this home offers the Gurugram you always
                  wished existed: calm, green, connected.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="border border-forest/10 p-4">
                    <p className="font-mono text-xs text-ink/50 mb-1">
                      MAX GUESTS
                    </p>
                    <p className="text-2xl font-display text-forest">06</p>
                  </div>
                  <div className="border border-forest/10 p-4">
                    <p className="font-mono text-xs text-ink/50 mb-1">
                      BASE RATE
                    </p>
                    <p className="text-2xl font-display text-forest">
                      ₹4,500
                      <span className="text-sm text-ink/50">/night</span>
                    </p>
                  </div>
                </div>
                <Button asChild variant="gold" size="lg">
                  <Link href="/homes/sushant-lok">
                    Explore & Reserve
                    <ArrowRight className="ml-2" size={20} />
                  </Link>
                </Button>
              </div>
              <div className="order-1 lg:order-2 image-hover reveal">
                <PlaceholderImage
                  caption="SUSHANT LOK — Dusk exterior, warm windows glowing, peaceful residential setting"
                  aspectRatio="portrait"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Separator */}
        <div className="py-16 px-6">
          <div className="container mx-auto max-w-7xl">
            <div className="flex items-center space-x-4">
              <div className="flex-1 h-px bg-forest/10" />
              <div className="w-8 h-8 border-2 border-gold rounded-t-full" />
              <div className="flex-1 h-px bg-forest/10" />
            </div>
          </div>
        </div>

        {/* Home 02 */}
        <section className="py-16 px-6">
          <div className="container mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="image-hover reveal">
                <PlaceholderImage
                  caption="JHARSA VILLAGE — Cozy neighborhood exterior, evening light, local character"
                  aspectRatio="portrait"
                />
              </div>
              <div className="reveal" style={{ animationDelay: "150ms" }}>
                <p className="font-mono text-gold text-sm tracking-widest mb-4">
                  HOME 02
                </p>
                <h2 className="text-4xl md:text-5xl font-display text-forest mb-4">
                  Jharsa Village
                </h2>
                <div className="flex items-center space-x-2 mb-6">
                  <MapPin size={16} className="text-gold" />
                  <span className="font-mono text-sm text-ink/60">
                    Sector 39, Gurugram · 28.4594° N, 77.0266° E
                  </span>
                </div>
                <p className="text-lg text-ink/80 leading-relaxed mb-8">
                  Cozy neighborhood, close to everything — your happy place in
                  the city. Minutes from Cyber Hub and the metro, this home puts
                  you right in the pulse of Gurugram while wrapping you in the
                  warmth of a local neighborhood.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="border border-forest/10 p-4">
                    <p className="font-mono text-xs text-ink/50 mb-1">
                      MAX GUESTS
                    </p>
                    <p className="text-2xl font-display text-forest">04</p>
                  </div>
                  <div className="border border-forest/10 p-4">
                    <p className="font-mono text-xs text-ink/50 mb-1">
                      BASE RATE
                    </p>
                    <p className="text-2xl font-display text-forest">
                      ₹4,000
                      <span className="text-sm text-ink/50">/night</span>
                    </p>
                  </div>
                </div>
                <Button asChild variant="gold" size="lg">
                  <Link href="/homes/jharsa-village">
                    Explore & Reserve
                    <ArrowRight className="ml-2" size={20} />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-24 px-6 bg-forest/5">
          <div className="container mx-auto max-w-7xl">
            <h2 className="text-display font-display text-center text-forest mb-4 reveal">
              Find Your Home
            </h2>
            <p className="text-center text-ink/70 mb-12 reveal">
              Both properties are in prime Gurugram locations.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-cream border border-forest/10 p-8 reveal">
                <h3 className="font-display text-xl text-forest mb-4">
                  Sushant Lok
                </h3>
                <p className="font-mono text-sm text-ink/60 leading-relaxed">
                  Sector 57, Phase 2
                  <br />
                  Sushant Lok, Gurugram
                  <br />
                  Haryana - 122011
                  <br />
                  <br />
                  28.4212° N, 77.0761° E
                </p>
              </div>
              <div
                className="bg-cream border border-forest/10 p-8 reveal"
                style={{ animationDelay: "150ms" }}
              >
                <h3 className="font-display text-xl text-forest mb-4">
                  Jharsa Village
                </h3>
                <p className="font-mono text-sm text-ink/60 leading-relaxed">
                  593, Durga Colony
                  <br />
                  Jharsa Village, Sector 39
                  <br />
                  Gurugram, Haryana - 122003
                  <br />
                  <br />
                  28.4594° N, 77.0266° E
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
