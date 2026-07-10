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
  TreePine,
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
  { icon: UtensilsCrossed, label: "Fully Equipped Kitchen" },
  { icon: AirVent, label: "Air Conditioning" },
  { icon: Monitor, label: "Dedicated Workspace" },
  { icon: Droplets, label: "24/7 Hot Water" },
  { icon: Car, label: "Free Parking" },
  { icon: TreePine, label: "Garden Access" },
  { icon: Shield, label: "Security System" },
  { icon: Home, label: "Spacious Living Area" },
];

const galleryImages = [
  { caption: "PROPERTY HERO — Sushant Lok dusk exterior", size: "large" },
  {
    caption: "INTERIOR — Living room with natural light, plants, textured throws",
    size: "medium",
  },
  { caption: "DETAIL — Brass fixture, ceramic vessel close-up", size: "medium" },
  { caption: "BEDROOM — Crisp linens, warm ambient lighting", size: "medium" },
  { caption: "KITCHEN — Modern, fully equipped, clean", size: "medium" },
  { caption: "LIFESTYLE — Guest reading by window, coffee steam", size: "medium" },
  { caption: "WORKSPACE — Dedicated desk setup, natural light", size: "medium" },
  { caption: "EXTERIOR — Garden area, morning light", size: "medium" },
];

export default function SushantLokPage() {
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
            caption="PROPERTY HERO — Sushant Lok, dusk exterior, warm windows glowing, lush residential setting"
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
                HOME 01
              </p>
              <h1 className="text-4xl md:text-6xl font-display text-cream">
                Sushant Lok
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
                          Sector 57, Phase 2, Sushant Lok, Gurugram
                        </span>
                      </div>
                      <p className="font-mono text-xs text-ink/40">
                        28.4212° N, 77.0761° E
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-display text-forest">6</p>
                        <p className="font-mono text-xs text-ink/50">GUESTS</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-display text-forest">3</p>
                        <p className="font-mono text-xs text-ink/50">BEDS</p>
                      </div>
                    </div>
                  </div>

                  <h2 className="text-2xl font-display text-forest mb-4">
                    Peaceful Surroundings, Great Connectivity
                  </h2>
                  <p className="text-ink/80 leading-relaxed mb-4">
                    Tucked into the quiet lanes of Sushant Lok, this home offers
                    something increasingly rare in Gurugram: genuine peace.
                    Floor-to-ceiling windows flood the living area with morning
                    light. Textured throws, ceramic vessels, and hand-picked
                    plants give every corner a personality.
                  </p>
                  <p className="text-ink/80 leading-relaxed">
                    Whether you're here to close a deal or simply close your
                    eyes and breathe — this space holds both. The dedicated
                    workspace has fibre internet. The bedroom has blackout
                    curtains. The kitchen is stocked for the cook in you.
                  </p>
                </div>

                {/* Gallery */}
                <div className="reveal">
                  <h2 className="text-2xl font-display text-forest mb-6">
                    The Space
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {galleryImages.map((img, i) => (
                      <PlaceholderImage
                        key={i}
                        caption={img.caption}
                        aspectRatio={i === 0 ? "landscape" : "square"}
                        className={cn(
                          "image-hover",
                          i === 0 ? "col-span-2" : ""
                        )}
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
                        <li>→ IFFCO Chowk Metro — 10 min</li>
                        <li>→ Golf Course Road — 5 min</li>
                        <li>→ NH-48 (Delhi-Jaipur) — 8 min</li>
                        <li>→ Cyber City — 12 min</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-medium text-forest mb-3">
                        Nearby Cafes & Dining
                      </h3>
                      <ul className="space-y-2 font-mono text-sm text-ink/70">
                        <li>→ Galleria Market — 3 min</li>
                        <li>→ Town Square — 5 min</li>
                        <li>→ DLF Cyberhub — 12 min</li>
                        <li>→ Supermarkets — 2 min</li>
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
                    AM. Events require prior approval.
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
                        ₹4,500
                        <span className="text-sm text-ink/50 ml-1">
                          / night
                        </span>
                      </p>
                      <p className="text-sm text-ink/60">
                        Weekends from ₹5,500/night
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Button asChild variant="gold" size="lg" className="w-full">
                        <a
                          href={`https://wa.me/918828352311?text=${encodeURIComponent("Hi! I'd like to reserve Sushant Lok. Can you help me with availability?")}`}
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
            <p className="text-xl font-display text-forest">₹4,500</p>
            <p className="font-mono text-xs text-ink/50">per night</p>
          </div>
          <Button asChild variant="gold" size="lg">
            <a
              href={`https://wa.me/918828352311?text=${encodeURIComponent("Hi! I'd like to reserve Sushant Lok.")}`}
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
