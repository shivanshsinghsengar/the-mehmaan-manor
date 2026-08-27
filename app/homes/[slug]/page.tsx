"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  MapPin, Wifi, Tv, UtensilsCrossed, AirVent, Monitor, Car,
  TreePine, Shield, Droplets, Home as HomeIcon, ArrowLeft,
  Phone, MessageCircle, Star, Users,
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
  "Basic Kitchen (Utensils Provided)": UtensilsCrossed,
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
  "CCTV Security": Shield,
  "Spacious Living Area": HomeIcon,
  "Safe Neighborhood": Shield,
  "Near Medanta Hospital": MapPin,
  "Near Metro Station": MapPin,
  "24-Hour Power Backup": Droplets,
  "Balcony": HomeIcon,
};

// Room type config for properties that have multiple room types
const ROOM_TYPES: Record<string, {
  key: string;
  label: string;
  shortLabel: string;
  baseRate: number;
  weekendRate: number;
  maxGuests: number;
  description: string;
  tag: string; // matches photo tags
}[]> = {
  "jharsa-village": [
    {
      key: "1rk",
      label: "1RK Studio",
      shortLabel: "1RK",
      baseRate: 1999,
      weekendRate: 2299,
      maxGuests: 2,
      description: "Compact studio with all essentials — perfect for solo travelers and couples.",
      tag: "1rk",
    },
    {
      key: "2bhk",
      label: "2BHK Apartment",
      shortLabel: "2BHK",
      baseRate: 2999,
      weekendRate: 3299,
      maxGuests: 5,
      description: "Spacious 2-bedroom apartment with full kitchen — ideal for families and groups.",
      tag: "2bhk",
    },
  ],
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
  tags: string[];
}

export default function PropertyPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [property, setProperty] = useState<Property | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [stickyVisible, setStickyVisible] = useState(false);
  const [selectedRoomKey, setSelectedRoomKey] = useState<string | null>(null);

  const roomTypes = ROOM_TYPES[slug] ?? null;

  // Set default room type on first load
  useEffect(() => {
    if (roomTypes && !selectedRoomKey) {
      setSelectedRoomKey(roomTypes[0].key);
    }
  }, [roomTypes, selectedRoomKey]);

  const selectedRoom = roomTypes?.find((r) => r.key === selectedRoomKey) ?? null;

  useEffect(() => {
    fetch("/api/properties")
      .then((r) => r.json())
      .then((data: Property[]) => {
        const found = data.find((p) => p.slug === slug);
        setProperty(found || null);
        if (found) {
          // Fetch photos then stop loading — don't stop loading before photos arrive
          return fetch(`/api/photos?propertyId=${found.id}`)
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

  // Dynamic SEO
  useEffect(() => {
    if (!property) return;
    const roomLabel = selectedRoom ? ` — ${selectedRoom.label}` : "";
    const rate = selectedRoom?.baseRate ?? property.baseRate;
    document.title = `${property.name}${roomLabel} | The Mehmaan Manor — Gurugram Homestay`;
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta") as HTMLMetaElement;
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", `${property.description} ${property.address}. Book directly from ₹${rate.toLocaleString("en-IN")}/night. Max ${property.maxGuests} guests. No booking fees.`);
  }, [property, selectedRoom]);

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

  // Filter photos by selected room type tag — always fallback to all if none match
  const filterByRoom = (photoList: Photo[]) => {
    if (!selectedRoom) return photoList;
    const tagged = photoList.filter((p) => Array.isArray(p.tags) && p.tags.includes(selectedRoom.tag));
    return tagged.length > 0 ? tagged : photoList;
  };

  const allHeroPhotos = photos.filter((p) =>
    p.section === "property-hero" || p.section === "hero"
  );
  const allGalleryPhotos = photos.filter((p) =>
    p.section === "gallery" || p.section === "property-hero" || p.section === "hero"
  );

  // Always show a hero — tagged first, then any property-hero, then null
  const heroPhoto = (selectedRoom
    ? allHeroPhotos.find((p) => Array.isArray(p.tags) && p.tags.includes(selectedRoom.tag))
    : null) ?? allHeroPhotos[0] ?? null;

  const galleryPhotos = filterByRoom(allGalleryPhotos);

  // Displayed rate — from room type if selected, else from DB
  const displayRate = selectedRoom?.baseRate ?? property.baseRate;
  const displayWeekendRate = selectedRoom?.weekendRate ?? property.weekendRate;
  const displayMaxGuests = selectedRoom?.maxGuests ?? property.maxGuests;
  const displayDescription = selectedRoom?.description ?? property.description;

  const coordParts = property.coordinates?.match(/([\d.]+)°\s*N.*?([\d.]+)°\s*E/);
  const mapsUrl = coordParts
    ? `https://maps.google.com/?q=${coordParts[1]},${coordParts[2]}`
    : `https://maps.google.com/?q=${encodeURIComponent(property.address)}`;

  const waRoomLabel = selectedRoom ? ` (${selectedRoom.label})` : "";
  const waMessage = encodeURIComponent(
    `Hi! I'd like to reserve ${property.name}${waRoomLabel}. Can you help me with availability?`
  );

  return (
    <div className="min-h-screen bg-cream">
      <Navigation />
      <main id="main-content">

        {/* ── Hero ────────────────────────────────────────────────────── */}
        <section className="pt-20 md:pt-24 relative">
          {heroPhoto ? (
            <div className="w-full aspect-[4/3] sm:aspect-video relative overflow-hidden">
              <img src={heroPhoto.url} alt={heroPhoto.alt || property.name}
                className="w-full h-full object-cover transition-all duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
            </div>
          ) : (
            <div className="relative">
              <PlaceholderImage
                caption={`${property.name.toUpperCase()} — Property exterior`}
                className="w-full" aspectRatio="video" />
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 top-20 md:top-24 flex items-end">
            <div className="container mx-auto px-4 md:px-6 pb-6 md:pb-12">
              <Link href="/homes" className="inline-flex items-center text-cream/80 hover:text-cream mb-4 md:mb-6 transition-colors">
                <ArrowLeft size={16} className="mr-2" />
                <span className="font-mono text-sm">All Homes</span>
              </Link>
              <p className="font-mono text-gold text-xs md:text-sm tracking-widest mb-1 md:mb-2">
                HOME {String(property.id).padStart(2, "0")}
              </p>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-display text-cream leading-tight mb-4 md:mb-6">
                {property.name}
              </h1>
              {/* Hero CTA buttons — visible immediately without scrolling */}
              <div className="flex flex-wrap gap-3">
                <a
                  href={`https://wa.me/918828352311?text=${waMessage}`}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-gold text-ink text-sm font-medium hover:bg-gold/90 transition-colors"
                >
                  <MessageCircle size={16} />
                  Reserve via WhatsApp
                </a>
                <a
                  href="tel:+918828352311"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-cream/10 backdrop-blur-sm border border-cream/40 text-cream text-sm font-medium hover:bg-cream/20 transition-colors"
                >
                  <Phone size={16} />
                  Call Simran
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── Room Type Selector (only for multi-room properties) ──────── */}
        {roomTypes && (
          <div className="bg-forest-deep border-b border-gold/20">
            <div className="container mx-auto px-4 md:px-6">
              <div className="flex items-center gap-0">
                <span className="font-mono text-cream/40 text-xs uppercase tracking-widest pr-4 md:pr-6 py-4 border-r border-cream/10 whitespace-nowrap">
                  Select Room
                </span>
                {roomTypes.map((room) => (
                  <button
                    key={room.key}
                    onClick={() => setSelectedRoomKey(room.key)}
                    className={cn(
                      "px-5 md:px-8 py-4 font-mono text-xs md:text-sm tracking-wider transition-all duration-300 border-r border-cream/10",
                      selectedRoomKey === room.key
                        ? "bg-gold text-ink font-medium"
                        : "text-cream/60 hover:text-cream hover:bg-cream/5"
                    )}
                  >
                    <span className="font-bold">{room.shortLabel}</span>
                    <span className="hidden sm:inline text-[10px] ml-2 opacity-70">
                      · up to {room.maxGuests} guests
                    </span>
                  </button>
                ))}
                {selectedRoom && (
                  <p className="hidden md:block ml-4 text-cream/50 text-xs font-mono">
                    ₹{selectedRoom.baseRate.toLocaleString("en-IN")}/night
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Details ─────────────────────────────────────────────────── */}
        <section className="py-8 md:py-16 px-4 md:px-6">
          <div className="container mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">

              {/* Main content */}
              <div className="lg:col-span-2 space-y-10 md:space-y-12">

                {/* Location + description */}
                <div className="reveal">
                  <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
                    <div>
                      <div className="flex items-start space-x-2 mb-2">
                        <MapPin size={16} className="text-gold flex-shrink-0 mt-0.5" />
                        <span className="font-mono text-sm text-ink/60 leading-relaxed">{property.address}</span>
                      </div>
                      {property.coordinates && (
                        <p className="font-mono text-xs text-ink/40 mb-1 ml-6">{property.coordinates}</p>
                      )}
                      <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
                        className="text-xs font-mono text-gold hover:underline ml-6">Get Directions →</a>
                    </div>
                    <div className="flex items-center gap-2 bg-forest/5 px-4 py-2 border border-forest/10">
                      <Users size={16} className="text-gold" />
                      <div className="text-center">
                        <p className="text-xl font-display text-forest">{displayMaxGuests}</p>
                        <p className="font-mono text-[10px] text-ink/50">MAX GUESTS</p>
                      </div>
                    </div>
                  </div>

                  <h2 className="text-xl md:text-2xl font-display text-forest mb-3">{displayDescription}</h2>
                  <p className="text-ink/80 leading-relaxed">{property.vibe}</p>
                </div>

                {/* Gallery — switches with room type */}
                {galleryPhotos.length > 0 ? (
                  <div className="reveal">
                    <div className="flex items-center justify-between mb-4 md:mb-6">
                      <h2 className="text-xl md:text-2xl font-display text-forest">The Space</h2>
                      {selectedRoom && (
                        <span className="font-mono text-xs text-gold bg-gold/10 px-3 py-1">
                          {selectedRoom.label}
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
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
                    <h2 className="text-xl md:text-2xl font-display text-forest mb-4 md:mb-6">The Space</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                      {["EXTERIOR — Property view", "INTERIOR — Living area", "DETAIL — Thoughtful touches",
                        "BEDROOM — Comfortable retreat", "KITCHEN — Well equipped", "LIFESTYLE — At home"].map((caption, i) => (
                        <PlaceholderImage key={i} caption={caption}
                          aspectRatio={i === 0 ? "landscape" : "square"}
                          className={cn("image-hover", i === 0 ? "col-span-2" : "")} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Amenities */}
                {property.amenities?.length > 0 && (
                  <div className="reveal">
                    <h2 className="text-xl md:text-2xl font-display text-forest mb-4 md:mb-6">Amenities</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
                      {property.amenities.map((amenity, i) => {
                        const Icon = ICON_MAP[amenity] || Star;
                        return (
                          <div key={i} className="flex items-center space-x-3 p-3 md:p-4 border border-forest/10">
                            <Icon size={16} className="text-gold flex-shrink-0" />
                            <span className="text-xs md:text-sm text-ink/80">{amenity}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Policies */}
                <div className="reveal bg-forest/5 p-4 md:p-6">
                  <h2 className="text-lg md:text-xl font-display text-forest mb-4">House Policies</h2>
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

              {/* ── Sidebar ─────────────────────────────────────────── */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-4 reveal">

                  {/* Room type mini-selector in sidebar (mobile-friendly) */}
                  {roomTypes && (
                    <div className="border border-forest/10 p-4 bg-cream">
                      <p className="font-mono text-xs text-ink/50 uppercase mb-3">Room Type</p>
                      <div className="grid grid-cols-2 gap-2">
                        {roomTypes.map((room) => (
                          <button
                            key={room.key}
                            onClick={() => setSelectedRoomKey(room.key)}
                            className={cn(
                              "py-3 px-2 text-center transition-all duration-200 border",
                              selectedRoomKey === room.key
                                ? "border-forest bg-forest text-cream"
                                : "border-forest/20 text-ink/60 hover:border-forest"
                            )}
                          >
                            <p className="font-display text-base">{room.shortLabel}</p>
                            <p className="font-mono text-[10px] mt-0.5 opacity-70">
                              {room.maxGuests} guests
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="border-2 border-forest/10 p-5 md:p-6 bg-cream">
                    {/* Trust badges */}
                    <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b border-forest/10">
                      <span className="flex items-center gap-1 text-[10px] font-mono text-green-700 bg-green-50 border border-green-200 px-2 py-1">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                        Verified Property
                      </span>
                      <span className="flex items-center gap-1 text-[10px] font-mono text-gold bg-gold/10 border border-gold/30 px-2 py-1">
                        ★ 4.9 Rating
                      </span>
                      <span className="flex items-center gap-1 text-[10px] font-mono text-forest/70 bg-forest/5 border border-forest/20 px-2 py-1">
                        🔒 Secure Booking
                      </span>
                    </div>

                    <div className="mb-5 md:mb-6">
                      <p className="font-mono text-xs text-ink/50 mb-1">
                        {selectedRoom ? selectedRoom.label.toUpperCase() + " RATE" : "BASE RATE"}
                      </p>
                      <p className="text-3xl font-display text-forest">
                        ₹{displayRate.toLocaleString("en-IN")}
                        <span className="text-sm text-ink/50 ml-1">/ night</span>
                      </p>
                      {displayWeekendRate > displayRate && (
                        <p className="text-sm text-ink/60 mt-1">
                          Weekends from ₹{displayWeekendRate.toLocaleString("en-IN")}/night
                        </p>
                      )}
                      {/* Pricing transparency */}
                      <div className="mt-3 pt-3 border-t border-forest/10 space-y-1.5 text-xs font-mono text-ink/50">
                        <div className="flex justify-between">
                          <span>Base rate / night</span>
                          <span>₹{displayRate.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Cleaning fee</span>
                          <span>{property.cleaningFee > 0 ? `₹${property.cleaningFee.toLocaleString("en-IN")}` : "Free"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>GST (18%)</span>
                          <span>Added at checkout</span>
                        </div>
                        <div className="flex justify-between text-ink/70 font-medium pt-1 border-t border-forest/10">
                          <span>Example: 2 nights</span>
                          <span>₹{(displayRate * 2 + Math.round(displayRate * 2 * 0.18)).toLocaleString("en-IN")}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {/* Primary CTA — direct website booking */}
                      <Button asChild variant="gold" size="lg" className="w-full">
                        <Link href={`/book?property=${property.id}`}>
                          <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Book Now
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="lg" className="w-full">
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
        "lg:hidden fixed bottom-0 left-0 right-0 bg-cream border-t border-forest/10 p-3 transition-transform duration-300 z-30",
        stickyVisible ? "translate-y-0" : "translate-y-full"
      )}>
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            {selectedRoom && (
              <p className="font-mono text-[10px] text-gold uppercase">{selectedRoom.shortLabel}</p>
            )}
            <p className="text-xl font-display text-forest">₹{displayRate.toLocaleString("en-IN")}</p>
            <p className="font-mono text-xs text-ink/50">per night</p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="gold" size="lg" className="flex-shrink-0">
              <Link href={`/book?property=${property.id}`}>Book Now</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="flex-shrink-0">
              <a href={`https://wa.me/918828352311?text=${waMessage}`} target="_blank" rel="noopener noreferrer">
                <MessageCircle size={16} />
              </a>
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
