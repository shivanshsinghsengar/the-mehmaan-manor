"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  MapPin, Wifi, Tv, UtensilsCrossed, AirVent, Monitor, Car,
  Shield, Droplets, Home as HomeIcon, ArrowLeft, Phone, MessageCircle, Star,
} from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PlaceholderImage } from "@/components/placeholder-image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, React.ElementType> = {
  "High-Speed Wi-Fi": Wifi,
  "Smart TV with Netflix": Tv,
  "Fully Equipped Kitchen": UtensilsCrossed,
  "Air Conditioning": AirVent,
  "Dedicated Workspace": Monitor,
  "24/7 Hot Water": Droplets,
  "Free Parking": Car,
  "Street Parking": Car,
  "Security System": Shield,
  "CCTV Security": Shield,
  "Spacious Living Area": HomeIcon,
  "Balcony": HomeIcon,
  "24-Hour Power Backup": Droplets,
};

interface Photo {
  id: string;
  url: string;
  alt: string;
  section: string;
  tags: string[];
}

const DEFAULTS = {
  baseRate: 2499, weekendRate: 2799, cleaningFee: 0,
  maxGuests: 2, checkInTime: "14:00", checkOutTime: "11:00",
  amenities: ["High-Speed Wi-Fi", "Smart TV with Netflix", "Air Conditioning", "24/7 Hot Water", "Balcony", "CCTV Security", "24-Hour Power Backup", "Street Parking"],
  policies: "Smoking outdoors only. No pets. No parties or events. Quiet hours after 10:00 PM.",
};

export default function SushantLokPage() {
  const [stickyVisible, setStickyVisible] = useState(false);
  const [pricing, setPricing] = useState(DEFAULTS);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [festivalDiscount, setFestivalDiscount] = useState({ discountPercent: 0, activeFestival: "", discountActive: false });

  useEffect(() => {
    fetch("/api/properties")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const p = data.find((x: { slug: string }) => x.slug === "sushant-lok");
          if (p) {
            setPricing({
              baseRate: p.baseRate, weekendRate: p.weekendRate,
              cleaningFee: p.cleaningFee, maxGuests: p.maxGuests,
              checkInTime: p.checkInTime || "14:00", checkOutTime: p.checkOutTime || "11:00",
              amenities: p.amenities || DEFAULTS.amenities,
              policies: p.policies || DEFAULTS.policies,
            });
            return fetch(`/api/photos?propertyId=${p.id}`)
              .then((r) => r.json())
              .then((photoData) => setPhotos(Array.isArray(photoData) ? photoData : []))
              .catch(() => {});
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    fetch("/api/settings/festival")
      .then((r) => r.json())
      .then((d) => setFestivalDiscount({
        discountPercent: d.discountPercent ?? 0,
        activeFestival: d.activeFestival ?? "",
        discountActive: d.discountActive ?? false,
      }))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleScroll = () => setStickyVisible(window.scrollY > 600);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Photo selection — same logic as [slug]/page.tsx
  const heroPhotos = photos.filter((p) => p.section === "property-hero");
  const fallbackHeroPhotos = photos.filter((p) => p.section === "hero");
  const allHeroPhotos = heroPhotos.length > 0 ? heroPhotos : fallbackHeroPhotos;
  const heroPhoto = allHeroPhotos[0] ?? null;
  const galleryPhotos = photos.filter((p) => p.section === "gallery");

  const waMessage = encodeURIComponent("Hi! I'd like to reserve Sushant Lok. Can you help me with availability?");

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf8f4] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-forest border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-mono text-sm text-ink/40">Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f4]">
      <Navigation />
      <main id="main-content">

        {/* Hero */}
        <section className="pt-16 md:pt-18 relative">
          {heroPhoto ? (
            <div className="w-full aspect-[4/3] sm:aspect-video relative overflow-hidden">
              <img src={heroPhoto.url} alt={heroPhoto.alt || "Sushant Lok"}
                className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
            </div>
          ) : (
            <div className="relative aspect-video overflow-hidden bg-[#eee9df]">
              <PlaceholderImage caption="SUSHANT LOK — Exterior" className="w-full" aspectRatio="video" />
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 top-16 md:top-18 flex items-end pointer-events-none">
            <div className="max-w-6xl mx-auto w-full px-4 md:px-6 pb-6 md:pb-10 pointer-events-auto">
              <Link href="/homes" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white mb-4 transition-colors">
                <ArrowLeft size={14} />
                <span className="font-mono text-xs">All Homes</span>
              </Link>
              <p className="font-mono text-gold text-xs tracking-widest mb-1">HOME 01</p>
              <h1 className="text-3xl md:text-5xl font-display text-white leading-tight mb-4">
                Sushant Lok
              </h1>
              <div className="flex flex-wrap gap-3">
                <a href={`https://wa.me/918828352311?text=${waMessage}`}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#4caf6e] text-white text-sm font-semibold hover:bg-[#3d9d5e] transition-colors shadow-md">
                  <MessageCircle size={15} />Reserve via WhatsApp
                </a>
                <a href="tel:+918828352311"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/15 backdrop-blur-sm border border-white/30 text-white text-sm font-medium hover:bg-white/25 transition-all">
                  <Phone size={14} />Call Simran
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Details */}
        <section className="py-8 md:py-12 px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">

              {/* Main content */}
              <div className="lg:col-span-2 space-y-10 md:space-y-12">

                {/* Location + description */}
                <div>
                  <div className="mb-6">
                    <div className="flex items-start space-x-2 mb-2">
                      <MapPin size={16} className="text-gold flex-shrink-0 mt-0.5" />
                      <span className="font-mono text-sm text-ink/60 leading-relaxed">
                        Building No. G-219, G-Block, Sushant Lok-2, Sector 57, Gurugram — 122011
                      </span>
                    </div>
                    <p className="font-mono text-xs text-ink/40 mb-1 ml-6">28.4212° N, 77.0761° E</p>
                    <a href="https://maps.google.com/?q=28.4233,77.0890" target="_blank" rel="noopener noreferrer"
                      className="text-xs font-mono text-gold hover:underline ml-6">Get Directions →</a>
                  </div>
                  <h2 className="text-xl md:text-2xl font-display text-forest mb-3">Peaceful Surroundings, Great Connectivity</h2>
                  <p className="text-ink/80 leading-relaxed mb-4">
                    Tucked into the quiet lanes of Sushant Lok, this home offers something increasingly rare in Gurugram: genuine peace. Floor-to-ceiling windows flood the living area with morning light.
                  </p>
                  <p className="text-ink/80 leading-relaxed">
                    Whether you're here to close a deal or simply close your eyes and breathe — this space holds both. The dedicated workspace has fibre internet. The bedroom has blackout curtains.
                  </p>
                </div>

                {/* Gallery */}
                <div>
                  <h2 className="text-xl md:text-2xl font-display text-forest mb-4 md:mb-6">The Space</h2>
                  {galleryPhotos.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
                      {galleryPhotos.map((photo, i) => (
                        <div key={photo.id} className={cn("image-hover overflow-hidden", i === 0 ? "col-span-2" : "")}>
                          <img src={photo.url} alt={photo.alt}
                            className={cn("w-full object-cover", i === 0 ? "aspect-video" : "aspect-square")} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                      {["EXTERIOR — Property view", "INTERIOR — Living area", "DETAIL — Thoughtful touches",
                        "BEDROOM — Comfortable retreat", "KITCHEN — Well equipped", "LIFESTYLE — At home"].map((caption, i) => (
                        <PlaceholderImage key={i} caption={caption}
                          aspectRatio={i === 0 ? "landscape" : "square"}
                          className={cn("image-hover", i === 0 ? "col-span-2" : "")} />
                      ))}
                    </div>
                  )}
                </div>

                {/* Amenities */}
                {pricing.amenities.length > 0 && (
                  <div>
                    <h2 className="text-xl md:text-2xl font-display text-forest mb-4 md:mb-6">Amenities</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
                      {pricing.amenities.map((amenity, i) => {
                        const Icon = ICON_MAP[amenity] || Star;
                        return (
                          <div key={i} className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-forest/8 hover:border-gold/30 transition-colors">
                            <Icon size={14} className="text-gold flex-shrink-0" />
                            <span className="text-xs md:text-sm text-ink/80">{amenity}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Neighborhood */}
                <div>
                  <h2 className="text-xl md:text-2xl font-display text-forest mb-4 md:mb-6">The Neighborhood</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium text-forest mb-3">Getting Around</h3>
                      <ul className="space-y-2 font-mono text-sm text-ink/70">
                        <li>→ IFFCO Chowk Metro — 10 min</li>
                        <li>→ Golf Course Road — 5 min</li>
                        <li>→ NH-48 (Delhi-Jaipur) — 8 min</li>
                        <li>→ Cyber City — 12 min</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-medium text-forest mb-3">Nearby</h3>
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
                <div className="bg-white border border-forest/8 rounded-2xl p-5 md:p-6">
                  <h2 className="text-lg md:text-xl font-display text-forest mb-4">House Policies</h2>
                  <div className="grid grid-cols-2 gap-4 font-mono text-sm text-ink/70 mb-4">
                    <div><p className="text-ink/50 text-xs mb-1">CHECK-IN</p><p>{pricing.checkInTime} onwards</p></div>
                    <div><p className="text-ink/50 text-xs mb-1">CHECK-OUT</p><p>{pricing.checkOutTime} by</p></div>
                  </div>
                  <p className="text-sm text-ink/70">{pricing.policies}</p>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-3">
                  <div className="bg-white border border-forest/10 rounded-2xl p-5 md:p-6 shadow-sm">
                    <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b border-forest/10">
                      <span className="flex items-center gap-1 text-[10px] font-mono text-green-700 bg-green-50 border border-green-200 px-2 py-1">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                        Verified Property
                      </span>
                      <span className="flex items-center gap-1 text-[10px] font-mono text-gold bg-gold/10 border border-gold/30 px-2 py-1">★ 4.9 Rating</span>
                    </div>
                    <div className="mb-5 md:mb-6">
                      <p className="font-mono text-xs text-ink/50 mb-1">BASE RATE</p>
                      {festivalDiscount.discountActive && festivalDiscount.discountPercent > 0 ? (
                        <>
                          <p className="text-sm font-mono text-ink/40 line-through">
                            ₹{pricing.baseRate.toLocaleString("en-IN")}/night
                          </p>
                          <p className="text-3xl font-display text-gold">
                            ₹{Math.round(pricing.baseRate * (1 - festivalDiscount.discountPercent / 100)).toLocaleString("en-IN")}
                            <span className="text-sm text-ink/50 ml-1">/ night</span>
                          </p>
                          <p className="text-xs font-mono text-green-600 mt-1">
                            🎉 {festivalDiscount.discountPercent}% festival discount applied
                          </p>
                        </>
                      ) : (
                        <p className="text-3xl font-display text-forest">
                          ₹{pricing.baseRate.toLocaleString("en-IN")}
                          <span className="text-sm text-ink/50 ml-1">/ night</span>
                        </p>
                      )}
                      {pricing.weekendRate > pricing.baseRate && (
                        <p className="text-sm text-ink/60 mt-1">
                          Weekends from ₹{pricing.weekendRate.toLocaleString("en-IN")}/night
                        </p>
                      )}
                      <div className="mt-3 pt-3 border-t border-forest/10 space-y-1.5 text-xs font-mono text-ink/50">
                        <div className="flex justify-between"><span>Base rate / night</span><span>₹{pricing.baseRate.toLocaleString("en-IN")}</span></div>
                        <div className="flex justify-between"><span>Cleaning fee</span><span>{pricing.cleaningFee > 0 ? `₹${pricing.cleaningFee.toLocaleString("en-IN")}` : "Free"}</span></div>
                        <div className="flex justify-between text-ink/70 font-medium pt-1 border-t border-forest/10">
                          <span>Example: 2 nights</span>
                          <span>₹{(pricing.baseRate * 2 + Math.round(pricing.baseRate * 2 * 0.18)).toLocaleString("en-IN")}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <a href={`https://wa.me/918828352311?text=${waMessage}`}
                        target="_blank" rel="noopener noreferrer"
                        className="w-full py-4 rounded-xl bg-[#4caf6e] text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#3d9d5e] transition-colors shadow-sm">
                        <MessageCircle size={16} />Reserve via WhatsApp
                      </a>
                      <a href="tel:+918828352311"
                        className="w-full py-3.5 rounded-xl border-2 border-forest text-forest font-semibold text-sm flex items-center justify-center gap-2 hover:bg-forest hover:text-cream transition-all">
                        <Phone size={15} />Call Simran
                      </a>
                      <Link href="/contact"
                        className="w-full py-3.5 rounded-xl border border-forest/20 text-ink/60 text-sm flex items-center justify-center hover:border-forest/50 hover:text-forest transition-all">
                        Send Enquiry
                      </Link>
                    </div>
                  </div>
                  <div className="font-mono text-xs text-ink/50 text-center p-4">
                    <p>Minimum stay: 1 night</p>
                    <p>Cleaning fee: {pricing.cleaningFee > 0 ? `₹${pricing.cleaningFee.toLocaleString("en-IN")}` : "Free"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Mobile sticky bar */}
      <div className={cn(
        "lg:hidden fixed bottom-0 left-0 right-0 bg-white/97 backdrop-blur-sm border-t border-forest/10 px-4 py-3 transition-transform duration-300 z-30",
        stickyVisible ? "translate-y-0" : "translate-y-full"
      )}>
        <div className="flex items-center justify-between gap-3">
          <div>
            {festivalDiscount.discountActive && festivalDiscount.discountPercent > 0 ? (
              <>
                <p className="text-xs font-mono text-ink/35 line-through">₹{pricing.baseRate.toLocaleString("en-IN")}</p>
                <p className="text-xl font-display text-gold">₹{Math.round(pricing.baseRate * (1 - festivalDiscount.discountPercent / 100)).toLocaleString("en-IN")}</p>
              </>
            ) : (
              <p className="text-xl font-display text-forest">₹{pricing.baseRate.toLocaleString("en-IN")}</p>
            )}
            <p className="font-mono text-xs text-ink/40">per night</p>
          </div>
          <div className="flex gap-2">
            <a href={`https://wa.me/918828352311?text=${waMessage}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-5 py-3 rounded-xl bg-[#4caf6e] text-white font-bold text-sm hover:bg-[#3d9d5e] transition-colors">
              Reserve Now
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
