"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  MapPin, Wifi, Tv, UtensilsCrossed, AirVent, Monitor, Car,
  TreePine, Shield, Droplets, Home as HomeIcon, ArrowLeft,
  Phone, MessageCircle, Star,
} from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PlaceholderImage } from "@/components/placeholder-image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, React.ElementType> = {
  "High-Speed Wi-Fi": Wifi,
  "Smart TV with Netflix": Tv,
  "Smart TV with streaming": Tv,
  "Fully Equipped Kitchen": UtensilsCrossed,
  "Fully equipped kitchen": UtensilsCrossed,
  "Modern Kitchen": UtensilsCrossed,
  "Air Conditioning": AirVent,
  "Air conditioning": AirVent,
  "Dedicated Workspace": Monitor,
  "Work-Friendly Setup": Monitor,
  "24/7 Hot Water": Droplets,
  "Free Parking": Car,
  "Street Parking": Car,
  "Garden Access": TreePine,
  "Security System": Shield,
  "Spacious Living Area": HomeIcon,
  "Safe Neighborhood": Shield,
};

interface Property {
  id: string;
  name: string;
  slug: string;
  address: string;
  coordinates: string;
  description: string;
  vibe: string;
  baseRate: number;
  weekendRate: number;
  cleaningFee: number;
  maxGuests: number;
  checkInTime: string;
  checkOutTime: string;
  amenities: string[];
  policies: string;
}

interface Photo {
  id: string;
  url: string;
  alt: string;
  section: string;
}

export default function PropertyPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [property, setProperty] = useState<Property | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [stickyVisible, setStickyVisible] = useState(false);

  useEffect(() => {
    // Load property data
    fetch("/api/properties")
      .then((r) => r.json())
      .then((data: Property[]) => {
        const found = data.find((p) => p.slug === slug);
        setProperty(found || null);
        if (found) {
          // Load photos for this property
          fetch(`/api/photos?propertyId=${found.id}`)
            .then((r) => r.json())
            .then((photoData) => setPhotos(Array.isArray(photoData) ? photoData : []))
            .catch(() => {});
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("active")),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    const handleScroll = () => setStickyVisible(window.scrollY > 600);
    window.addEventListener("scroll", handleScroll);
    return () => { observer.disconnect(); window.removeEventListener("scroll", handleScroll); };
  }, [property]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-forest border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-mono text-sm text-ink/50">Loading…</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-cream">
        <Navigation />
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
          <p className="font-mono text-gold text-sm tracking-widest mb-4">404</p>
          <h1 className="text-4xl font-display text-forest mb-4">Property not found</h1>
          <p className="text-ink/60 mb-8">This property doesn't exist or may have been removed.</p>
          <Button asChild variant="gold">
            <Link href="/homes">View All Homes</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const heroPhoto = photos.find((p) => p.section === "property-hero");
  const galleryPhotos = photos.filter((p) => p.section === "gallery");

  // Parse coordinates for Google Maps
  const coordParts = property.coordinates?.match(/([\d.]+)°\s*N.*?([\d.]+)°\s*E/);
  const mapsUrl = coordParts
    ? `https://maps.google.com/?q=${coordParts[1]},${coordParts[2]}`
    : `https://maps.google.com/?q=${encodeURIComponent(property.address)}`;

  const waMessage = encodeURIComponent(
    `Hi! I'd like to reserve ${property.name}. Can you help me with availability?`
  );

  return (
    <div className="min-h-screen bg-cream">
      <Navigation />
      <main id="main-content">
        {/* Hero */}
        <section className="pt-24 relative">
          {heroPhoto ? (
            <div className="w-full aspect-video relative overflow-hidden">
              <img src={heroPhoto.url} alt={heroPhoto.alt || property.name}
                className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
            </div>
          ) : (
            <div className="relative">
              <PlaceholderImage
                caption={`${property.name.toUpperCase()} — Property exterior`}
                className="w-full" aspectRatio="video" />
            </div>
          )}
          <div className="absolute inset-0 flex items-end" style={{ top: "96px" }}>
            <div className="container mx-auto px-6 pb-12">
              <Link href="/homes" className="inline-flex items-center text-cream/80 hover:text-cream mb-6 transition-colors">
                <ArrowLeft size={16} className="mr-2" />
                <span className="font-mono text-sm">All Homes</span>
              </Link>
              <p className="font-mono text-gold text-sm tracking-widest mb-2">
                HOME {String(property.id).padStart(2, "0")}
              </p>
              <h1 className="text-4xl md:text-6xl font-display text-cream">{property.name}</h1>
            </div>
          </div>
        </section>

        {/* Details */}
        <section className="py-16 px-6">
          <div className="container mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main */}
              <div className="lg:col-span-2 space-y-12">
                {/* Location + description */}
                <div className="reveal">
                  <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <MapPin size={16} className="text-gold" />
                        <span className="font-mono text-sm text-ink/60">{property.address}</span>
                      </div>
                      {property.coordinates && (
                        <p className="font-mono text-xs text-ink/40 mb-1">{property.coordinates}</p>
                      )}
                      <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
                        className="text-xs font-mono text-gold hover:underline">Get Directions →</a>
                    </div>
                    <div className="flex gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-display text-forest">{property.maxGuests}</p>
                        <p className="font-mono text-xs text-ink/50">GUESTS</p>
                      </div>
                    </div>
                  </div>
                  <h2 className="text-2xl font-display text-forest mb-4">{property.description}</h2>
                  <p className="text-ink/80 leading-relaxed">{property.vibe}</p>
                </div>

                {/* Gallery */}
                {galleryPhotos.length > 0 ? (
                  <div className="reveal">
                    <h2 className="text-2xl font-display text-forest mb-6">The Space</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {galleryPhotos.map((photo, i) => (
                        <div key={photo.id}
                          className={cn("image-hover overflow-hidden", i === 0 ? "col-span-2" : "")}>
                          <img src={photo.url} alt={photo.alt}
                            className={cn("w-full object-cover", i === 0 ? "aspect-video" : "aspect-square")} />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="reveal">
                    <h2 className="text-2xl font-display text-forest mb-6">The Space</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {["EXTERIOR — Property view", "INTERIOR — Living area", "DETAIL — Thoughtful touches",
                        "BEDROOM — Comfortable retreat", "KITCHEN — Well equipped", "LIFESTYLE — At home"].map((caption, i) => (
                        <PlaceholderImage key={i} caption={caption}
                          aspectRatio={i === 0 ? "landscape" : "square"}
                          className={cn("image-hover", i === 0 ? "col-span-2" : "")} />
                      ))}
                    </div>
                    <p className="text-xs text-ink/40 font-mono mt-3 text-center">
                      Upload real photos via Admin → Photos
                    </p>
                  </div>
                )}

                {/* Amenities */}
                {property.amenities?.length > 0 && (
                  <div className="reveal">
                    <h2 className="text-2xl font-display text-forest mb-6">Amenities</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {property.amenities.map((amenity, i) => {
                        const Icon = ICON_MAP[amenity] || Star;
                        return (
                          <div key={i} className="flex items-center space-x-3 p-4 border border-forest/10">
                            <Icon size={18} className="text-gold flex-shrink-0" />
                            <span className="text-sm text-ink/80">{amenity}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Policies */}
                <div className="reveal bg-forest/5 p-6">
                  <h2 className="text-xl font-display text-forest mb-4">House Policies</h2>
                  <div className="grid grid-cols-2 gap-4 font-mono text-sm text-ink/70 mb-4">
                    <div>
                      <p className="text-ink/50 text-xs mb-1">CHECK-IN</p>
                      <p>{property.checkInTime} onwards</p>
                    </div>
                    <div>
                      <p className="text-ink/50 text-xs mb-1">CHECK-OUT</p>
                      <p>{property.checkOutTime} by</p>
                    </div>
                  </div>
                  {property.policies && (
                    <p className="text-sm text-ink/70">{property.policies}</p>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-4 reveal">
                  <div className="border-2 border-forest/10 p-6 bg-cream">
                    <div className="mb-6">
                      <p className="font-mono text-xs text-ink/50 mb-1">BASE RATE</p>
                      <p className="text-3xl font-display text-forest">
                        ₹{property.baseRate.toLocaleString("en-IN")}
                        <span className="text-sm text-ink/50 ml-1">/ night</span>
                      </p>
                      {property.weekendRate > property.baseRate && (
                        <p className="text-sm text-ink/60">
                          Weekends from ₹{property.weekendRate.toLocaleString("en-IN")}/night
                        </p>
                      )}
                    </div>
                    <div className="space-y-3">
                      <Button asChild variant="gold" size="lg" className="w-full">
                        <a href={`https://wa.me/918828352311?text=${waMessage}`}
                          target="_blank" rel="noopener noreferrer">
                          <MessageCircle size={18} className="mr-2" />Reserve via WhatsApp
                        </a>
                      </Button>
                      <Button asChild variant="outline" size="lg" className="w-full">
                        <a href="tel:+918828352311">
                          <Phone size={18} className="mr-2" />Call Simran
                        </a>
                      </Button>
                      <Button asChild size="lg" className="w-full">
                        <Link href="/contact">Send Enquiry</Link>
                      </Button>
                    </div>
                  </div>
                  <div className="font-mono text-xs text-ink/50 text-center p-4">
                    <p>Minimum stay: 1 night</p>
                    <p>Cleaning fee: ₹{property.cleaningFee.toLocaleString("en-IN")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Mobile sticky bar */}
      <div className={cn(
        "lg:hidden fixed bottom-0 left-0 right-0 bg-cream border-t border-forest/10 p-4 transition-transform duration-300 z-30",
        stickyVisible ? "translate-y-0" : "translate-y-full"
      )}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl font-display text-forest">
              ₹{property.baseRate.toLocaleString("en-IN")}
            </p>
            <p className="font-mono text-xs text-ink/50">per night</p>
          </div>
          <Button asChild variant="gold" size="lg">
            <a href={`https://wa.me/918828352311?text=${waMessage}`}
              target="_blank" rel="noopener noreferrer">Reserve Now</a>
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
