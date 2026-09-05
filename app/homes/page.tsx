"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, MapPin, Star, CheckCircle2 } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PlaceholderImage } from "@/components/placeholder-image";

interface Property {
  id: string; slug: string; name: string; address: string;
  coordinates: string; description: string; vibe: string;
  baseRate: number; weekendRate: number; cleaningFee: number;
  maxGuests: number;
}

interface Photo {
  id: string; url: string; alt: string;
  propertyId: string | null; section: string;
}

const WA_SVG = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function HomesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/properties").then((r) => r.json()),
      fetch("/api/photos").then((r) => r.json()),
    ])
      .then(([props, phts]) => {
        if (Array.isArray(props)) setProperties(props);
        if (Array.isArray(phts)) setPhotos(phts);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("active")),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [properties]);

  const getHeroPhoto = (propertyId: string) =>
    photos.find((p) => p.propertyId === propertyId && p.section === "property-hero") ??
    photos.find((p) => p.propertyId === propertyId && p.section === "property-card") ??
    photos.find((p) => p.propertyId === propertyId && p.section === "hero") ??
    null;

  const getMapsUrl = (property: Property) => {
    const match = property.coordinates?.match(/([\d.]+)°\s*N.*?([\d.]+)°\s*E/);
    return match
      ? `https://maps.google.com/?q=${match[1]},${match[2]}`
      : `https://maps.google.com/?q=${encodeURIComponent(property.address)}`;
  };

  return (
    <div className="min-h-screen bg-[#faf8f4]">
      <Navigation />
      <main id="main-content">

        {/* Hero */}
        <section className="pt-28 md:pt-36 pb-12 px-4 md:px-6 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <span className="label-badge text-gold">Our Properties</span>
            <h1 className="font-display text-display text-forest mt-3 mb-4 leading-tight">
              {properties.length > 2
                ? `${properties.length} Homes. One Standard of Care.`
                : "Two Homes. One Standard of Care."}
            </h1>
            <p className="text-base md:text-lg text-ink/65 max-w-2xl mx-auto leading-relaxed">
              Each home in a distinct Gurugram neighbourhood, individually curated — with the same promise: you'll want to come back.
            </p>
          </div>
        </section>

        {/* Properties */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-8 h-8 border-2 border-forest border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="font-mono text-sm text-ink/40">Loading properties…</p>
          </div>
        ) : (
          <section className="py-12 md:py-16 px-4 md:px-6">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {properties.map((property, i) => {
                  const heroPhoto = getHeroPhoto(property.id);
                  const mapsUrl = getMapsUrl(property);
                  const waMsg = encodeURIComponent(`Hi! I'd like to know more about ${property.name}. Can you help?`);

                  return (
                    <div
                      key={property.id}
                      className="reveal bg-white rounded-2xl overflow-hidden border border-forest/8 hover:border-gold/40 hover:shadow-xl transition-all duration-300 group"
                      style={{ transitionDelay: `${i * 80}ms` }}
                    >
                      {/* Photo */}
                      <div className="relative aspect-[4/3] overflow-hidden bg-[#eee9df]">
                        {heroPhoto ? (
                          <img
                            src={heroPhoto.url}
                            alt={heroPhoto.alt || property.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <PlaceholderImage
                            caption={`${property.name.toUpperCase()}`}
                            aspectRatio="landscape"
                          />
                        )}
                        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-sm">
                          <p className="text-sm font-semibold text-forest leading-tight">
                            ₹{property.baseRate.toLocaleString("en-IN")}
                            <span className="text-xs font-normal text-ink/45">/night</span>
                          </p>
                        </div>
                        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm rounded-lg px-2.5 py-1 flex items-center gap-1">
                          <Star size={10} className="fill-gold text-gold" />
                          <span className="text-xs font-mono text-ink/60">4.9</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 md:p-6">
                        <div className="mb-2">
                          <span className="font-mono text-[10px] text-gold tracking-widest uppercase">
                            HOME {String(i + 1).padStart(2, "0")}
                          </span>
                        </div>
                        <h2 className="font-display text-2xl text-forest mb-2">{property.name}</h2>
                        <div className="flex items-start gap-1.5 mb-3">
                          <MapPin size={12} className="text-ink/30 mt-0.5 shrink-0" />
                          <p className="text-xs text-ink/50 font-mono">{property.address}</p>
                        </div>
                        {property.vibe && (
                          <p className="text-sm text-ink/65 leading-relaxed mb-4 line-clamp-2">
                            {property.vibe}
                          </p>
                        )}

                        {/* Quick stats */}
                        <div className="grid grid-cols-2 gap-2 mb-5">
                          <div className="bg-[#faf8f4] rounded-lg p-2.5 text-center">
                            <p className="text-xs font-mono text-ink/40">Max Guests</p>
                            <p className="font-display text-lg text-forest">{property.maxGuests}</p>
                          </div>
                          <div className="bg-[#faf8f4] rounded-lg p-2.5 text-center">
                            <p className="text-xs font-mono text-ink/40">Cleaning Fee</p>
                            <p className="font-display text-lg text-forest">
                              {property.cleaningFee > 0
                                ? `₹${property.cleaningFee.toLocaleString("en-IN")}`
                                : "Free"}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Link
                            href={`/homes/${property.slug}`}
                            className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl bg-forest text-cream text-sm font-semibold hover:bg-forest/90 transition-colors min-h-[48px]"
                          >
                            Explore & Reserve <ArrowRight size={13} />
                          </Link>
                          <a
                            href={`https://wa.me/918828352311?text=${waMsg}`}
                            target="_blank" rel="noopener noreferrer"
                            className="flex items-center justify-center px-3.5 py-3 rounded-xl bg-[#dcf5e5] text-[#1a7a3a] hover:bg-[#c8efda] transition-colors min-h-[48px]"
                            aria-label="WhatsApp"
                          >
                            {WA_SVG}
                          </a>
                        </div>

                        <a
                          href={mapsUrl}
                          target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 mt-3 text-xs font-mono text-ink/35 hover:text-gold transition-colors"
                        >
                          <MapPin size={10} /> Get Directions
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Trust strip */}
        <section className="py-10 px-4 md:px-6 bg-white border-t border-forest/8">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {[
                { emoji: "🔒", title: "No Hidden Fees", desc: "Direct booking, no OTA markup" },
                { emoji: "⚡", title: "Fast Response", desc: "WhatsApp reply in under 5 min" },
                { emoji: "🏠", title: "Personal Welcome", desc: "We greet every guest ourselves" },
                { emoji: "✅", title: "Free Cancellation", desc: "Up to 48 hours before arrival" },
              ].map((t) => (
                <div key={t.title} className="flex flex-col items-center gap-1.5 p-3">
                  <span className="text-xl">{t.emoji}</span>
                  <p className="text-xs font-semibold text-forest">{t.title}</p>
                  <p className="text-[11px] text-ink/45 leading-snug">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-12 md:py-16 px-4 md:px-6 bg-[#eee9df] text-center">
          <div className="max-w-xl mx-auto reveal">
            <h2 className="font-display text-title text-forest mb-3">Not Sure Which Home?</h2>
            <p className="text-ink/60 text-sm mb-7">
              Just message us — we'll help you pick the right fit for your trip.
            </p>
            <a
              href="https://wa.me/918828352311"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-[#25D366] text-white font-semibold text-sm hover:bg-[#1fb558] transition-colors min-h-[52px] shadow-md"
            >
              {WA_SVG}
              Ask Us on WhatsApp
            </a>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
