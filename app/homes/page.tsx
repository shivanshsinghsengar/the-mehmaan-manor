"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PlaceholderImage } from "@/components/placeholder-image";
import { Button } from "@/components/ui/button";

interface Property {
  id: string;
  slug: string;
  name: string;
  address: string;
  coordinates: string;
  description: string;
  vibe: string;
  baseRate: number;
  weekendRate: number;
  cleaningFee: number;
  maxGuests: number;
}

interface Photo {
  id: string;
  url: string;
  alt: string;
  propertyId: string | null;
  section: string;
}

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
    photos.find((p) => p.propertyId === propertyId && (p.section === "property-hero" || p.section === "property-card" || p.section === "hero"));

  const getMapsUrl = (property: Property) => {
    const match = property.coordinates?.match(/([\d.]+)°\s*N.*?([\d.]+)°\s*E/);
    return match
      ? `https://maps.google.com/?q=${match[1]},${match[2]}`
      : `https://maps.google.com/?q=${encodeURIComponent(property.address)}`;
  };

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
              {properties.length > 2
                ? `${properties.length} Homes. One Standard of Care.`
                : "Two Homes. One Standard of Care."}
            </h1>
            <p className="text-lg text-ink/80 max-w-2xl mx-auto animate-fade-up">
              In distinct Gurugram neighborhoods, each home has been individually curated — with the same promise: you'll want to come back.
            </p>
          </div>
        </section>

        <div className="arch-divider mb-24" />

        {loading ? (
          <div className="py-24 text-center">
            <div className="w-8 h-8 border-2 border-forest border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="font-mono text-sm text-ink/50">Loading properties…</p>
          </div>
        ) : (
          <>
            {properties.map((property, index) => {
              const heroPhoto = getHeroPhoto(property.id);
              const isEven = index % 2 === 0;
              const mapsUrl = getMapsUrl(property);

              return (
                <div key={property.id}>
                  <section className="py-16 px-6">
                    <div className="container mx-auto max-w-7xl">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Text — alternate left/right */}
                        <div className={`reveal ${isEven ? "order-2 lg:order-1" : "order-2"}`}
                          style={{ animationDelay: `${index * 100}ms` }}>
                          <p className="font-mono text-gold text-sm tracking-widest mb-4">
                            HOME {String(index + 1).padStart(2, "0")}
                          </p>
                          <h2 className="text-4xl md:text-5xl font-display text-forest mb-4">
                            {property.name}
                          </h2>
                          <div className="flex items-center space-x-2 mb-2">
                            <MapPin size={16} className="text-gold" />
                            <span className="font-mono text-sm text-ink/60">{property.address}</span>
                          </div>
                          {property.coordinates && (
                            <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
                              className="inline-block mb-6 text-xs font-mono text-gold hover:underline">
                              Get Directions →
                            </a>
                          )}
                          <p className="text-lg text-ink/80 leading-relaxed mb-8">{property.vibe}</p>
                          <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="border border-forest/10 p-4">
                              <p className="font-mono text-xs text-ink/50 mb-1">MAX GUESTS</p>
                              <p className="text-2xl font-display text-forest">
                                {String(property.maxGuests).padStart(2, "0")}
                              </p>
                            </div>
                            <div className="border border-forest/10 p-4">
                              <p className="font-mono text-xs text-ink/50 mb-1">BASE RATE</p>
                              <p className="text-2xl font-display text-forest">
                                ₹{property.baseRate.toLocaleString("en-IN")}
                                <span className="text-sm text-ink/50">/night</span>
                              </p>
                            </div>
                          </div>
                          <Button asChild variant="gold" size="lg">
                            <Link href={`/homes/${property.slug}`}>
                              Explore & Reserve <ArrowRight className="ml-2" size={20} />
                            </Link>
                          </Button>
                        </div>

                        {/* Image */}
                        <div className={`image-hover reveal ${isEven ? "order-1 lg:order-2" : "order-1"}`}>
                          {heroPhoto ? (
                            <div className="aspect-[3/4] overflow-hidden">
                              <img src={heroPhoto.url} alt={heroPhoto.alt || property.name}
                                className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <PlaceholderImage
                              caption={`${property.name.toUpperCase()} — Property exterior`}
                              aspectRatio="portrait"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Separator between properties */}
                  {index < properties.length - 1 && (
                    <div className="py-16 px-6">
                      <div className="container mx-auto max-w-7xl">
                        <div className="flex items-center space-x-4">
                          <div className="flex-1 h-px bg-forest/10" />
                          <div className="w-8 h-8 border-2 border-gold rounded-t-full" />
                          <div className="flex-1 h-px bg-forest/10" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Address Cards */}
            {properties.length > 0 && (
              <section className="py-24 px-6 bg-forest/5">
                <div className="container mx-auto max-w-7xl">
                  <h2 className="text-display font-display text-center text-forest mb-4 reveal">
                    Find Your Home
                  </h2>
                  <p className="text-center text-ink/70 mb-12 reveal">
                    All properties are in prime Gurugram locations.
                  </p>
                  <div className={`grid grid-cols-1 md:grid-cols-${Math.min(properties.length, 3)} gap-8`}>
                    {properties.map((property, i) => (
                      <div key={property.id}
                        className="bg-cream border border-forest/10 p-8 reveal"
                        style={{ animationDelay: `${i * 150}ms` }}>
                        <h3 className="font-display text-xl text-forest mb-4">{property.name}</h3>
                        <p className="font-mono text-sm text-ink/60 leading-relaxed mb-4">
                          {property.address}
                          {property.coordinates && (
                            <><br /><br />{property.coordinates}</>
                          )}
                        </p>
                        <a href={getMapsUrl(property)} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm font-mono text-gold hover:underline">
                          <MapPin size={14} />Get Directions
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
