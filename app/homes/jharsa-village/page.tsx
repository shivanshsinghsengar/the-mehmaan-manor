"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Wifi,
  Tv,
  UtensilsCrossed,
  AirVent,
  Monitor,
  Car,
  ShoppingBag,
  Shield,
  Droplets,
  Home,
  ArrowLeft,
  Phone,
  MessageCircle,
} from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PlaceholderImage } from "@/components/placeholder-image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const amenities = [
  { icon: Wifi, label: "High-Speed Wi-Fi" },
  { icon: Tv, label: "Smart TV with Netflix" },
  { icon: UtensilsCrossed, label: "Modern Kitchen" },
  { icon: AirVent, label: "Air Conditioning" },
  { icon: Monitor, label: "Work-Friendly Setup" },
  { icon: Droplets, label: "24/7 Hot Water" },
  { icon: Car, label: "Street Parking" },
  { icon: ShoppingBag, label: "Local Market Nearby" },
  { icon: Shield, label: "Safe Neighborhood" },
  { icon: Home, label: "Cozy Living Space" },
];

export default function JharsaVillagePage() {
  const [stickyVisible, setStickyVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach(
          (e) => e.isIntersecting && e.target.classList.add("active")
        ),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

    const handleScroll = () => setStickyVisible(window.scrollY > 600);
    window.addEventListener("scroll", handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-cream">
      <Navigation />

      <main id="main-content">
        {/* Hero */}
        <section className="pt-24 relative">
          <PlaceholderImage
            caption="PROPERTY HERO — Jharsa Village, cozy neighborhood exterior, warm evening light"
            className="w-full"
            aspectRatio="video"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent flex items-end">
            <div className="container mx-auto px-6 pb-12">
              <Link
                href="/homes"
                className="inline-flex items-center text-cream/80 hover:text-cream mb-6 transition-colors"
              >
                <ArrowLeft size={16} className="mr-2" />
                <span className="font-mono text-sm">All Homes</span>
              </Link>
              <p className="font-mono text-gold text-sm tracking-widest mb-2">
                HOME 02
              </p>
              <h1 className="text-4xl md:text-6xl font-display text-cream">
                Jharsa Village
              </h1>
            </div>
          </div>
        </section>

        {/* Property Details */}
        <section className="py-16 px-6">
          <div className="container mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-12">
                {/* Overview */}
                <div className="reveal">
                  <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <MapPin size={16} className="text-gold" />
                        <span className="font-mono text-sm text-ink/60">
                          593, Durga Colony, Jharsa Village, Sector 39, Gurugram
                        </span>
                      </div>
                      <p className="font-mono text-xs text-ink/40">
                        28.4594° N, 77.0266° E
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-display text-forest">4</p>
                        <p className="font-mono text-xs text-ink/50">GUESTS</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-display text-forest">2</p>
                        <p className="font-mono text-xs text-ink/50">BEDS</p>
                      </div>
                    </div>
                  </div>

                  <h2 className="text-2xl font-display text-forest mb-4">
                    Cozy Neighborhood, Close to Everything
                  </h2>
                  <p className="text-ink/80 leading-relaxed mb-4">
                    In the heart of Jharsa Village, this home carries a
                    neighborhood soul — warm neighbors, a local market within a
                    two-minute walk, and that rare Gurugram commodity: genuine
                    character. Step outside and you're in local India. Step back
                    in and you're in a thoughtfully designed sanctuary.
                  </p>
                  <p className="text-ink/80 leading-relaxed">
                    The living space is intimate by design — perfect for couples,
                    solo travelers, or a close group of two. The kitchen is
                    modern and well-equipped. The Smart TV is loaded. And
                    Cyber Hub is just a short ride away when the city calls.
                  </p>
                </div>

                {/* Gallery */}
                <div className="reveal">
                  <h2 className="text-2xl font-display text-forest mb-6">
                    The Space
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      "PROPERTY HERO — Jharsa Village cozy exterior",
                      "INTERIOR — Living room, warm tones, local character",
                      "DETAIL — Local textile, brass vessel, ceramic",
                      "BEDROOM — Intimate, warm lighting, cozy linens",
                      "KITCHEN — Modern, clean, ready to cook",
                      "LIFESTYLE — Coffee, light, morning calm",
                    ].map((caption, i) => (
                      <PlaceholderImage
                        key={i}
                        caption={caption}
                        aspectRatio={i === 0 ? "landscape" : "square"}
                        className={cn("image-hover", i === 0 ? "col-span-2" : "")}
                      />
                    ))}
                  </div>
                </div>

                {/* Amenities */}
                <div className="reveal">
                  <h2 className="text-2xl font-display text-forest mb-6">
                    Amenities
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {amenities.map((amenity, i) => (
                      <div
                        key={i}
                        className="flex items-center space-x-3 p-4 border border-forest/10"
                      >
                        <amenity.icon
                          size={18}
                          className="text-gold flex-shrink-0"
                        />
                        <span className="text-sm text-ink/80">
                          {amenity.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Neighborhood */}
                <div className="reveal">
                  <h2 className="text-2xl font-display text-forest mb-6">
                    The Neighborhood
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium text-forest mb-3">
                        Getting Around
                      </h3>
                      <ul className="space-y-2 font-mono text-sm text-ink/70">
                        <li>→ Huda City Centre Metro — 8 min</li>
                        <li>→ DLF Cyberhub — 5 min</li>
                        <li>→ MG Road — 3 min</li>
                        <li>→ Ambience Mall — 10 min</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-medium text-forest mb-3">
                        Nearby
                      </h3>
                      <ul className="space-y-2 font-mono text-sm text-ink/70">
                        <li>→ Local market — 2 min walk</li>
                        <li>→ Cafes & restaurants — 5 min</li>
                        <li>→ Pharmacy — 3 min</li>
                        <li>→ ATM — 2 min</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Policies */}
                <div className="reveal bg-forest/5 p-6">
                  <h2 className="text-xl font-display text-forest mb-4">
                    House Policies
                  </h2>
                  <div className="grid grid-cols-2 gap-4 font-mono text-sm text-ink/70 mb-4">
                    <div>
                      <p className="text-ink/50 text-xs mb-1">CHECK-IN</p>
                      <p>14:00 onwards</p>
                    </div>
                    <div>
                      <p className="text-ink/50 text-xs mb-1">CHECK-OUT</p>
                      <p>11:00 by</p>
                    </div>
                  </div>
                  <p className="text-sm text-ink/70">
                    No smoking indoors. Pets negotiable. Quiet hours 10 PM – 8
                    AM. Please respect the neighborhood.
                  </p>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-4 reveal">
                  <div className="border-2 border-forest/10 p-6 bg-cream">
                    <div className="mb-6">
                      <p className="font-mono text-xs text-ink/50 mb-1">
                        BASE RATE
                      </p>
                      <p className="text-3xl font-display text-forest">
                        ₹4,000
                        <span className="text-sm text-ink/50 ml-1">
                          / night
                        </span>
                      </p>
                      <p className="text-sm text-ink/60">
                        Weekends from ₹5,000/night
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Button asChild variant="gold" size="lg" className="w-full">
                        <a
                          href={`https://wa.me/918828352311?text=${encodeURIComponent("Hi! I'd like to reserve Jharsa Village. Can you help me with availability?")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MessageCircle size={18} className="mr-2" />
                          Reserve via WhatsApp
                        </a>
                      </Button>
                      <Button asChild variant="outline" size="lg" className="w-full">
                        <a href="tel:+918828352311">
                          <Phone size={18} className="mr-2" />
                          Call Simran
                        </a>
                      </Button>
                      <Button asChild size="lg" className="w-full">
                        <Link href="/contact">Send Enquiry</Link>
                      </Button>
                    </div>
                  </div>

                  <div className="font-mono text-xs text-ink/50 text-center p-4">
                    <p>Minimum stay: 1 night</p>
                    <p>Cleaning fee: ₹500</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Sticky Reserve CTA (Mobile) */}
      <div
        className={cn(
          "lg:hidden fixed bottom-0 left-0 right-0 bg-cream border-t border-forest/10 p-4 transition-transform duration-300 z-30",
          stickyVisible ? "translate-y-0" : "translate-y-full"
        )}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl font-display text-forest">₹4,000</p>
            <p className="font-mono text-xs text-ink/50">per night</p>
          </div>
          <Button asChild variant="gold" size="lg">
            <a
              href={`https://wa.me/918828352311?text=${encodeURIComponent("Hi! I'd like to reserve Jharsa Village.")}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Reserve Now
            </a>
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
