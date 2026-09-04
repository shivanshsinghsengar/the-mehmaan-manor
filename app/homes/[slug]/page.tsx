"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  MapPin, Wifi, Tv, UtensilsCrossed, AirVent, Monitor, Car,
  TreePine, Shield, Droplets, Home as HomeIcon, ArrowLeft,
  Phone, MessageCircle, Star, Users, BedDouble, Clock,
  ChevronDown, ChevronUp, CheckCircle2, Zap,
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

const ROOM_TYPES: Record<string, {
  key: string; label: string; shortLabel: string;
  baseRate: number; weekendRate: number; maxGuests: number;
  description: string; tag: string;
  beds: number; baths: number;
}[]> = {
  "jharsa-village": [
    {
      key: "1rk", label: "1RK Studio", shortLabel: "1RK",
      baseRate: 1999, weekendRate: 2299, maxGuests: 2,
      description: "Compact studio with all essentials — perfect for solo travelers and couples.",
      tag: "1rk", beds: 1, baths: 1,
    },
    {
      key: "2bhk", label: "2BHK Apartment", shortLabel: "2BHK",
      baseRate: 2999, weekendRate: 3299, maxGuests: 5,
      description: "Spacious 2-bedroom apartment with full kitchen — ideal for families and groups.",
      tag: "2bhk", beds: 2, baths: 2,
    },
  ],
};

interface Property {
  id: string; name: string; slug: string; address: string;
  coordinates: string; description: string; vibe: string;
  baseRate: number; weekendRate: number; cleaningFee: number;
  maxGuests: number; checkInTime: string; checkOutTime: string;
  amenities: string[]; policies: string;
}

interface Photo {
  id: string; url: string; alt: string; section: string; tags: string[];
}

/* ── Reliable image with blur-up + error fallback ─────────────── */
function SafeImg({
  src, alt, className, style, loading = "lazy",
}: {
  src: string; alt: string; className?: string; style?: React.CSSProperties;
  loading?: "lazy" | "eager";
}) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");

  return (
    <div className="relative w-full h-full" style={style}>
      {/* Placeholder shimmer while loading */}
      {status === "loading" && (
        <div className="absolute inset-0 bg-gradient-to-r from-stone-800 via-stone-700 to-stone-800 animate-pulse" />
      )}
      {status === "error" ? (
        <div className="absolute inset-0 flex items-center justify-center bg-stone-900">
          <div className="text-center">
            <HomeIcon size={32} className="text-stone-600 mx-auto mb-2" />
            <p className="text-stone-500 text-xs font-mono">Photo unavailable</p>
          </div>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={loading}
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-500",
            status === "loaded" ? "opacity-100" : "opacity-0",
            className,
          )}
        />
      )}
    </div>
  );
}

/* ── Quick Facts bar ──────────────────────────────────────────── */
function QuickFacts({ maxGuests, beds, baths, checkIn, checkOut, cleaningFee }: {
  maxGuests: number; beds: number; baths: number;
  checkIn: string; checkOut: string; cleaningFee: number;
}) {
  const facts = [
    { icon: Users, label: `Up to ${maxGuests} guests` },
    { icon: BedDouble, label: `${beds} bedroom${beds !== 1 ? "s" : ""}` },
    { icon: Droplets, label: `${baths} bathroom${baths !== 1 ? "s" : ""}` },
    { icon: Clock, label: `Check-in ${checkIn}` },
    { icon: Clock, label: `Check-out ${checkOut}` },
    { icon: CheckCircle2, label: cleaningFee > 0 ? `₹${cleaningFee.toLocaleString("en-IN")} cleaning fee` : "No cleaning fee" },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {facts.map(({ icon: Icon, label }) => (
        <div key={label} className="flex items-center gap-2.5 p-3 border border-forest/10 bg-forest/[0.03]">
          <Icon size={15} className="text-gold flex-shrink-0" />
          <span className="font-mono text-xs text-ink/70">{label}</span>
        </div>
      ))}
    </div>
  );
}

/* ── FAQ accordion ────────────────────────────────────────────── */
const FAQS = [
  {
    q: "What is the check-in and check-out process?",
    a: "We do a personal check-in — Simran or Jyoti will meet you at the property and walk you through everything. Check-out is self-service; just lock up and message us.",
  },
  {
    q: "How many guests can the property accommodate?",
    a: "The guest limit is listed on this page. Extra guests beyond the limit may be accommodated for a small fee — just ask on WhatsApp before booking.",
  },
  {
    q: "Is parking available?",
    a: "Yes, free parking is available at both properties. Just mention your vehicle when booking so we can arrange the spot.",
  },
  {
    q: "Can I book for a bachelor/bachelorette party?",
    a: "Yes, but please disclose the nature of the gathering when booking. Noise levels must be kept reasonable after 10 PM as per society rules.",
  },
  {
    q: "What is the cancellation policy?",
    a: "Free cancellation up to 48 hours before check-in. After that, 1 night's charge applies. Full refund if we are unable to provide the property.",
  },
  {
    q: "Is cooking allowed?",
    a: "Yes — the kitchen is fully equipped. We stock basic spices, oil, and cookware. Please clean up after cooking.",
  },
  {
    q: "Are pets allowed?",
    a: "Small, well-behaved pets may be considered on a case-by-case basis. Please ask before booking — do not assume.",
  },
  {
    q: "How do I pay? Is it safe to pay directly?",
    a: "We accept UPI, bank transfer, and Razorpay (card/netbanking). Direct booking means you pay us — no third-party markup, no hidden platform fees.",
  },
];

function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div>
      <h2 className="text-xl md:text-2xl font-display text-forest mb-5">Frequently Asked Questions</h2>
      <div className="space-y-2">
        {FAQS.map((faq, i) => (
          <div key={i} className="border border-forest/10 overflow-hidden">
            <button
              className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-forest/5 transition-colors"
              onClick={() => setOpen(open === i ? null : i)}
            >
              <span className="font-medium text-sm text-ink pr-4">{faq.q}</span>
              {open === i
                ? <ChevronUp size={16} className="text-gold flex-shrink-0" />
                : <ChevronDown size={16} className="text-ink/40 flex-shrink-0" />}
            </button>
            {open === i && (
              <div className="px-4 pb-4 pt-1 text-sm text-ink/70 leading-relaxed border-t border-forest/10 bg-forest/[0.02]">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Urgency / Social proof strip ────────────────────────────── */
function TrustStrip() {
  return (
    <div className="flex flex-wrap gap-4 py-4 border-y border-forest/10 my-6">
      {[
        { icon: "⭐", text: "4.9 rated on Google" },
        { icon: "✅", text: "Instant WhatsApp response" },
        { icon: "🔒", text: "Secure direct booking — no middleman" },
        { icon: "🏠", text: "Real hosts, not a company" },
      ].map(({ icon, text }) => (
        <div key={text} className="flex items-center gap-2 text-xs font-mono text-ink/60">
          <span>{icon}</span><span>{text}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Booking Sidebar ──────────────────────────────────────────── */
function BookingSidebar({
  property, selectedRoom, roomTypes, selectedRoomKey, setSelectedRoomKey,
  displayRate, displayWeekendRate, festivalDiscount, waMessage,
}: {
  property: Property;
  selectedRoom: { key: string; label: string; shortLabel: string; baseRate: number; weekendRate: number; maxGuests: number } | null;
  roomTypes: { key: string; label: string; shortLabel: string; baseRate: number; weekendRate: number; maxGuests: number }[] | null;
  selectedRoomKey: string | null;
  setSelectedRoomKey: (k: string) => void;
  displayRate: number;
  displayWeekendRate: number;
  festivalDiscount: { discountPercent: number; discountActive: boolean; activeFestival: string };
  waMessage: string;
}) {
  const today = new Date().toISOString().split("T")[0];
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [availability, setAvailability] = useState<"idle" | "checking" | "available" | "soldout">("idle");

  const nights = checkIn && checkOut
    ? Math.max(0, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000))
    : 0;

  const discounted = festivalDiscount.discountActive && festivalDiscount.discountPercent > 0;
  const effectiveRate = discounted
    ? Math.round(displayRate * (1 - festivalDiscount.discountPercent / 100))
    : displayRate;

  useEffect(() => {
    if (!checkIn || !checkOut || nights <= 0) { setAvailability("idle"); return; }
    setAvailability("checking");
    const t = setTimeout(() => {
      fetch(`/api/availability?propertyId=${property.id}&checkIn=${checkIn}&checkOut=${checkOut}`)
        .then((r) => r.json())
        .then((d) => setAvailability(d.available ? "available" : "soldout"))
        .catch(() => setAvailability("available"));
    }, 600);
    return () => clearTimeout(t);
  }, [checkIn, checkOut, property.id, nights]);

  const bookUrl = availability === "available" && checkIn && checkOut
    ? `/book?property=${property.id}&checkIn=${checkIn}&checkOut=${checkOut}`
    : `/book?property=${property.id}`;

  return (
    <div className="sticky top-24 space-y-3">
      {/* Airbnb-comparison anchor */}
      <div className="bg-amber-50 border border-amber-200 px-4 py-3 flex items-start gap-2.5">
        <Zap size={14} className="text-amber-600 mt-0.5 flex-shrink-0" />
        <p className="text-xs font-mono text-amber-800 leading-relaxed">
          <strong>Book direct &amp; save.</strong> No Airbnb/OTA markup. Same home, up to 15% cheaper.
        </p>
      </div>

      {/* Room selector */}
      {roomTypes && (
        <div className="border border-forest/10 p-4 bg-cream">
          <p className="font-mono text-xs text-ink/50 uppercase mb-3">Room Type</p>
          <div className="grid grid-cols-2 gap-2">
            {roomTypes.map((room) => (
              <button key={room.key} onClick={() => setSelectedRoomKey(room.key)}
                className={cn(
                  "py-3 px-2 text-center transition-all duration-200 border",
                  selectedRoomKey === room.key
                    ? "border-forest bg-forest text-cream"
                    : "border-forest/20 text-ink/60 hover:border-forest"
                )}>
                <p className="font-display text-base">{room.shortLabel}</p>
                <p className="font-mono text-[10px] mt-0.5 opacity-70">{room.maxGuests} guests</p>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="border-2 border-forest/10 p-5 bg-cream">
        {/* Trust badges */}
        <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b border-forest/10">
          <span className="flex items-center gap-1 text-[10px] font-mono text-green-700 bg-green-50 border border-green-200 px-2 py-1">
            <CheckCircle2 size={10} /> Verified Property
          </span>
          <span className="flex items-center gap-1 text-[10px] font-mono text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1">
            ★ 4.9 Rating
          </span>
          <span className="flex items-center gap-1 text-[10px] font-mono text-blue-700 bg-blue-50 border border-blue-200 px-2 py-1">
            ⚡ Responds in &lt;5 min
          </span>
        </div>

        {/* Rate */}
        <div className="mb-4">
          <p className="font-mono text-xs text-ink/50 mb-1">
            {selectedRoom ? selectedRoom.label.toUpperCase() + " RATE" : "BASE RATE"}
          </p>
          {discounted ? (
            <>
              <p className="text-sm font-mono text-ink/40 line-through">₹{displayRate.toLocaleString("en-IN")}/night</p>
              <p className="text-3xl font-display text-gold">
                ₹{effectiveRate.toLocaleString("en-IN")}
                <span className="text-sm text-ink/50 ml-1">/ night</span>
              </p>
              <p className="text-xs font-mono text-green-600 mt-0.5">🎉 {festivalDiscount.discountPercent}% festival discount applied</p>
            </>
          ) : (
            <>
              <p className="text-3xl font-display text-forest">
                ₹{displayRate.toLocaleString("en-IN")}
                <span className="text-sm text-ink/50 ml-1">/ night</span>
              </p>
              {displayWeekendRate > displayRate && (
                <p className="text-xs font-mono text-ink/50 mt-0.5">Weekends from ₹{displayWeekendRate.toLocaleString("en-IN")}/night</p>
              )}
            </>
          )}
        </div>

        {/* Date pickers */}
        <div className="space-y-2 mb-4">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-mono text-ink/50 uppercase mb-1">Check-in</label>
              <input type="date" min={today} value={checkIn}
                onChange={(e) => { setCheckIn(e.target.value); if (checkOut && e.target.value >= checkOut) setCheckOut(""); }}
                className="w-full border border-forest/20 px-2 py-2 text-xs font-mono text-ink focus:outline-none focus:border-forest bg-white" />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-ink/50 uppercase mb-1">Check-out</label>
              <input type="date" min={checkIn || today} value={checkOut} disabled={!checkIn}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full border border-forest/20 px-2 py-2 text-xs font-mono text-ink focus:outline-none focus:border-forest bg-white disabled:opacity-40" />
            </div>
          </div>

          {/* Cost breakdown */}
          {nights > 0 && (
            <div className="bg-forest/5 border border-forest/10 px-3 py-2 text-xs font-mono">
              <div className="flex justify-between text-ink/60">
                <span>₹{effectiveRate.toLocaleString("en-IN")} × {nights} night{nights > 1 ? "s" : ""}</span>
                <span>₹{(effectiveRate * nights).toLocaleString("en-IN")}</span>
              </div>
              {property.cleaningFee > 0 && (
                <div className="flex justify-between text-ink/60">
                  <span>Cleaning fee</span>
                  <span>₹{property.cleaningFee.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between text-ink/60">
                <span>GST (18%)</span>
                <span>₹{Math.round(effectiveRate * nights * 0.18).toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between font-semibold text-forest pt-1.5 border-t border-forest/10 mt-1.5">
                <span>Total</span>
                <span>₹{(effectiveRate * nights + property.cleaningFee + Math.round(effectiveRate * nights * 0.18)).toLocaleString("en-IN")}</span>
              </div>
            </div>
          )}

          {availability === "checking" && (
            <p className="text-xs font-mono text-ink/50 flex items-center gap-1.5">
              <span className="w-3 h-3 border border-forest border-t-transparent rounded-full animate-spin inline-block" />
              Checking availability…
            </p>
          )}
          {availability === "available" && (
            <p className="text-xs font-mono text-green-600 flex items-center gap-1.5">
              <CheckCircle2 size={12} /> Available — these dates are open
            </p>
          )}
          {availability === "soldout" && (
            <p className="text-xs font-mono text-red-600 flex items-center gap-1.5">
              ✗ Not available for these dates
            </p>
          )}
        </div>

        {/* CTAs */}
        {availability === "soldout" ? (
          <div className="space-y-2">
            <div className="w-full py-3.5 bg-red-50 border border-red-200 text-red-700 font-mono text-sm text-center">
              🚫 Sold Out for Selected Dates
            </div>
            <a href={`https://wa.me/918828352311?text=${waMessage}`} target="_blank" rel="noopener noreferrer"
              className="w-full py-3.5 border-2 border-forest text-forest font-medium text-sm flex items-center justify-center gap-2 hover:bg-forest hover:text-cream transition-all">
              <MessageCircle size={16} /> Ask for Alternative Dates
            </a>
          </div>
        ) : (
          <div className="space-y-2">
            <Link href={bookUrl}
              className="w-full py-4 bg-gold text-ink font-bold text-sm flex items-center justify-center gap-2 hover:bg-gold/90 transition-all shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {checkIn && checkOut ? "Book Now" : "Check Availability"}
            </Link>
            <a href={`https://wa.me/918828352311?text=${waMessage}`} target="_blank" rel="noopener noreferrer"
              className="w-full py-3.5 border border-forest/30 text-forest/80 font-medium text-sm flex items-center justify-center gap-2 hover:border-forest hover:text-forest transition-all">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
              Reserve via WhatsApp
            </a>
            <a href="tel:+918828352311"
              className="w-full py-2.5 text-center font-mono text-xs text-ink/50 hover:text-forest transition-colors flex items-center justify-center gap-1.5">
              <Phone size={11} /> Call Simran · +91 88283 52311
            </a>
          </div>
        )}
      </div>

      {/* Cancellation policy */}
      <div className="bg-green-50 border border-green-200 px-4 py-3">
        <p className="text-xs font-mono text-green-800 flex items-start gap-2">
          <CheckCircle2 size={13} className="mt-0.5 flex-shrink-0" />
          <span><strong>Free cancellation</strong> up to 48 hours before check-in. No questions asked.</span>
        </p>
      </div>
    </div>
  );
}

/* ── Photo gallery with lightbox-style fullscreen ─────────────── */
function PhotoGallery({ photos, propertyName }: { photos: Photo[]; propertyName: string }) {
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight" && active !== null) setActive((active + 1) % photos.length);
      if (e.key === "ArrowLeft" && active !== null) setActive((active - 1 + photos.length) % photos.length);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [active, photos.length]);

  if (photos.length === 0) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {["EXTERIOR", "LIVING AREA", "BEDROOM", "KITCHEN", "DETAIL", "OUTDOOR"].map((caption, i) => (
          <PlaceholderImage key={i} caption={caption}
            aspectRatio={i === 0 ? "landscape" : "square"}
            className={cn("image-hover", i === 0 ? "col-span-2" : "")} />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
        {photos.map((photo, i) => (
          <button
            key={photo.id}
            onClick={() => setActive(i)}
            className={cn(
              "overflow-hidden group relative focus:outline-none focus:ring-2 focus:ring-gold",
              i === 0 ? "col-span-2" : ""
            )}
            aria-label={`View photo ${i + 1}`}
          >
            <div className={cn("w-full overflow-hidden", i === 0 ? "aspect-video" : "aspect-square")}>
              <SafeImg
                src={photo.url} alt={photo.alt || propertyName}
                loading={i < 3 ? "eager" : "lazy"}
                className="transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity font-mono text-white text-xs tracking-wider bg-black/50 px-3 py-1.5">
                View
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {active !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setActive(null)}
        >
          <button className="absolute top-4 right-4 text-white/70 hover:text-white font-mono text-sm z-10"
            onClick={() => setActive(null)}>ESC / Close</button>
          <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 z-10"
            onClick={(e) => { e.stopPropagation(); setActive((active - 1 + photos.length) % photos.length); }}>
            ‹
          </button>
          <div className="max-w-5xl max-h-[90vh] w-full px-16" onClick={(e) => e.stopPropagation()}>
            <img src={photos[active].url} alt={photos[active].alt || propertyName}
              className="w-full h-full object-contain max-h-[85vh]" />
            <p className="text-white/40 text-xs font-mono text-center mt-2">
              {active + 1} / {photos.length}
            </p>
          </div>
          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 z-10"
            onClick={(e) => { e.stopPropagation(); setActive((active + 1) % photos.length); }}>
            ›
          </button>
        </div>
      )}
    </>
  );
}

/* ════════════════════════════════════════════════════════════════
   Main Page
════════════════════════════════════════════════════════════════ */
export default function PropertyPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [property, setProperty] = useState<Property | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [stickyVisible, setStickyVisible] = useState(false);
  const [selectedRoomKey, setSelectedRoomKey] = useState<string | null>(null);
  const [festivalDiscount, setFestivalDiscount] = useState({ discountPercent: 0, activeFestival: "", discountActive: false });

  const roomTypes = ROOM_TYPES[slug] ?? null;

  useEffect(() => {
    if (roomTypes && !selectedRoomKey) setSelectedRoomKey(roomTypes[0].key);
  }, [roomTypes, selectedRoomKey]);

  const selectedRoom = roomTypes?.find((r) => r.key === selectedRoomKey) ?? null;

  useEffect(() => {
    fetch("/api/properties")
      .then((r) => r.json())
      .then((data: Property[]) => {
        const found = data.find((p) => p.slug === slug);
        setProperty(found || null);
        if (found) {
          return fetch(`/api/photos?propertyId=${found.id}`)
            .then((r) => r.json())
            .then((photoData) => setPhotos(Array.isArray(photoData) ? photoData : []))
            .catch(() => {});
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
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => setStickyVisible(window.scrollY > 600);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
          <p className="text-ink/60 mb-8">This property doesn&rsquo;t exist or may have been removed.</p>
          <Button asChild variant="gold"><Link href="/homes">View All Homes</Link></Button>
        </div>
        <Footer />
      </div>
    );
  }

  const filterByRoom = (photoList: Photo[]) => {
    if (!selectedRoom) return photoList;
    const tagged = photoList.filter((p) => Array.isArray(p.tags) && p.tags.includes(selectedRoom.tag));
    return tagged.length > 0 ? tagged : photoList;
  };

  const heroPhotos = photos.filter((p) => p.section === "property-hero");
  const fallbackHeroPhotos = photos.filter((p) => p.section === "hero");
  const allHeroPhotos = heroPhotos.length > 0 ? heroPhotos : fallbackHeroPhotos;
  const allGalleryPhotos = photos.filter((p) => p.section === "gallery");

  const heroPhoto = (selectedRoom
    ? allHeroPhotos.find((p) => Array.isArray(p.tags) && p.tags.includes(selectedRoom.tag))
    : null) ?? allHeroPhotos[0] ?? null;

  const galleryPhotos = filterByRoom(allGalleryPhotos);

  const displayRate = selectedRoom?.baseRate ?? property.baseRate;
  const displayWeekendRate = selectedRoom?.weekendRate ?? property.weekendRate;
  const displayDescription = selectedRoom?.description ?? property.description;

  const coordParts = property.coordinates?.match(/([\d.]+)°\s*N.*?([\d.]+)°\s*E/);
  const mapsUrl = coordParts
    ? `https://maps.google.com/?q=${coordParts[1]},${coordParts[2]}`
    : `https://maps.google.com/?q=${encodeURIComponent(property.address)}`;

  const waRoomLabel = selectedRoom ? ` (${selectedRoom.label})` : "";
  const waMessage = encodeURIComponent(
    `Hi! I'd like to reserve ${property.name}${waRoomLabel}. Can you help me with availability?`
  );

  // Quick facts — beds/baths from room type if available
  const quickBeds = selectedRoom?.beds ?? (property.maxGuests >= 5 ? 2 : 1);
  const quickBaths = selectedRoom?.baths ?? 1;

  return (
    <div className="min-h-screen bg-cream">
      <Navigation />
      <main id="main-content">

        {/* ── Hero image ──────────────────────────────────────────── */}
        <section className="pt-20 md:pt-24 relative">
          <div className="w-full aspect-[4/3] sm:aspect-video relative overflow-hidden bg-stone-900">
            {heroPhoto ? (
              <SafeImg
                src={heroPhoto.url}
                alt={heroPhoto.alt || property.name}
                loading="eager"
                className="transition-all duration-500"
              />
            ) : (
              <PlaceholderImage caption={`${property.name.toUpperCase()} — Property exterior`}
                className="w-full" aspectRatio="video" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
          </div>

          <div className="absolute inset-x-0 bottom-0 top-20 md:top-24 flex items-end pointer-events-none">
            <div className="container mx-auto px-4 md:px-6 pb-6 md:pb-12 pointer-events-auto">
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
              <div className="flex flex-wrap gap-3">
                <a href={`https://wa.me/918828352311?text=${waMessage}`}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-gold text-ink text-sm font-semibold hover:bg-gold/90 transition-colors shadow">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Reserve via WhatsApp
                </a>
                <a href="tel:+918828352311"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-cream/10 backdrop-blur-sm border border-cream/40 text-cream text-sm font-medium hover:bg-cream/20 transition-colors">
                  <Phone size={16} /> Call Simran
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── Room type selector ──────────────────────────────────── */}
        {roomTypes && (
          <div className="bg-forest-deep border-b border-gold/20">
            <div className="container mx-auto px-4 md:px-6">
              <div className="flex items-center gap-0">
                <span className="font-mono text-cream/40 text-xs uppercase tracking-widest pr-4 md:pr-6 py-4 border-r border-cream/10 whitespace-nowrap">
                  Select Room
                </span>
                {roomTypes.map((room) => (
                  <button key={room.key} onClick={() => setSelectedRoomKey(room.key)}
                    className={cn(
                      "px-5 md:px-8 py-4 font-mono text-xs md:text-sm tracking-wider transition-all duration-300 border-r border-cream/10",
                      selectedRoomKey === room.key
                        ? "bg-gold text-ink font-medium"
                        : "text-cream/60 hover:text-cream hover:bg-cream/5"
                    )}>
                    <span className="font-bold">{room.shortLabel}</span>
                    <span className="hidden sm:inline text-[10px] ml-2 opacity-70">
                      · up to {room.maxGuests} guests
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Main content ─────────────────────────────────────────── */}
        <section className="py-8 md:py-14 px-4 md:px-6">
          <div className="container mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">

              {/* ── Left: content ─────────────────────────────────── */}
              <div className="lg:col-span-2 space-y-10 md:space-y-12">

                {/* Location + description */}
                <div>
                  <div className="flex items-start gap-2 mb-3">
                    <MapPin size={15} className="text-gold flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-mono text-sm text-ink/60">{property.address}</span>
                      {property.coordinates && (
                        <span className="block font-mono text-xs text-ink/35 mt-0.5">{property.coordinates}</span>
                      )}
                      <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
                        className="text-xs font-mono text-gold hover:underline mt-0.5 inline-block">
                        Get Directions →
                      </a>
                    </div>
                  </div>
                  <h2 className="text-xl md:text-2xl font-display text-forest mb-2">{displayDescription}</h2>
                  <p className="text-ink/75 leading-relaxed">{property.vibe}</p>

                  <TrustStrip />

                  {/* Quick facts */}
                  <QuickFacts
                    maxGuests={selectedRoom?.maxGuests ?? property.maxGuests}
                    beds={quickBeds}
                    baths={quickBaths}
                    checkIn={property.checkInTime}
                    checkOut={property.checkOutTime}
                    cleaningFee={property.cleaningFee}
                  />
                </div>

                {/* Photo gallery */}
                <div>
                  <div className="flex items-center justify-between mb-4 md:mb-5">
                    <h2 className="text-xl md:text-2xl font-display text-forest">The Space</h2>
                    {selectedRoom && (
                      <span className="font-mono text-xs text-gold bg-gold/10 border border-gold/20 px-3 py-1">
                        {selectedRoom.label}
                      </span>
                    )}
                  </div>
                  <PhotoGallery photos={galleryPhotos} propertyName={property.name} />
                </div>

                {/* Amenities */}
                {property.amenities?.length > 0 && (
                  <div>
                    <h2 className="text-xl md:text-2xl font-display text-forest mb-4 md:mb-5">What&rsquo;s Included</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {property.amenities.map((amenity, i) => {
                        const Icon = ICON_MAP[amenity] || Star;
                        return (
                          <div key={i} className="flex items-center gap-3 p-3 border border-forest/10 hover:border-gold/30 hover:bg-gold/[0.03] transition-colors">
                            <Icon size={15} className="text-gold flex-shrink-0" />
                            <span className="text-xs md:text-sm text-ink/80">{amenity}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* House policies */}
                <div className="bg-forest/5 border border-forest/10 p-4 md:p-6">
                  <h2 className="text-lg md:text-xl font-display text-forest mb-4">House Policies</h2>
                  <div className="grid grid-cols-2 gap-4 font-mono text-sm text-ink/70 mb-4">
                    <div>
                      <p className="text-ink/40 text-xs mb-1 uppercase tracking-wider">Check-in</p>
                      <p className="font-medium">{property.checkInTime} onwards</p>
                    </div>
                    <div>
                      <p className="text-ink/40 text-xs mb-1 uppercase tracking-wider">Check-out</p>
                      <p className="font-medium">{property.checkOutTime} by</p>
                    </div>
                    <div>
                      <p className="text-ink/40 text-xs mb-1 uppercase tracking-wider">Max Guests</p>
                      <p className="font-medium">{selectedRoom?.maxGuests ?? property.maxGuests} persons</p>
                    </div>
                    <div>
                      <p className="text-ink/40 text-xs mb-1 uppercase tracking-wider">Cleaning Fee</p>
                      <p className="font-medium">
                        {property.cleaningFee > 0
                          ? `₹${property.cleaningFee.toLocaleString("en-IN")}`
                          : "Included"}
                      </p>
                    </div>
                  </div>
                  {property.policies && (
                    <p className="text-sm text-ink/65 leading-relaxed border-t border-forest/10 pt-4">{property.policies}</p>
                  )}
                </div>

                {/* FAQ */}
                <FAQSection />

                {/* Mobile-only bottom CTA (above sticky bar) */}
                <div className="lg:hidden pt-2 pb-24">
                  <a href={`https://wa.me/918828352311?text=${waMessage}`}
                    target="_blank" rel="noopener noreferrer"
                    className="w-full py-4 bg-gold text-ink font-bold text-sm flex items-center justify-center gap-2 hover:bg-gold/90 transition-all">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    Book via WhatsApp — Fastest Response
                  </a>
                </div>
              </div>

              {/* ── Right: booking sidebar ─────────────────────────── */}
              <div className="lg:col-span-1 hidden lg:block">
                <BookingSidebar
                  property={property}
                  selectedRoom={selectedRoom}
                  roomTypes={roomTypes}
                  selectedRoomKey={selectedRoomKey}
                  setSelectedRoomKey={setSelectedRoomKey}
                  displayRate={displayRate}
                  displayWeekendRate={displayWeekendRate}
                  festivalDiscount={festivalDiscount}
                  waMessage={waMessage}
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Mobile sticky bar ────────────────────────────────────── */}
      <div className={cn(
        "lg:hidden fixed bottom-0 left-0 right-0 border-t border-forest/15 p-3 transition-transform duration-300 z-40",
        "bg-cream/95 backdrop-blur-sm",
        stickyVisible ? "translate-y-0" : "translate-y-full"
      )}>
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            {selectedRoom && (
              <p className="font-mono text-[10px] text-gold uppercase tracking-wider">{selectedRoom.shortLabel}</p>
            )}
            {festivalDiscount.discountActive && festivalDiscount.discountPercent > 0 ? (
              <>
                <p className="text-sm font-mono text-ink/40 line-through">
                  ₹{displayRate.toLocaleString("en-IN")}
                </p>
                <p className="text-xl font-display text-gold">
                  ₹{Math.round(displayRate * (1 - festivalDiscount.discountPercent / 100)).toLocaleString("en-IN")}
                </p>
              </>
            ) : (
              <p className="text-xl font-display text-forest">₹{displayRate.toLocaleString("en-IN")}</p>
            )}
            <p className="font-mono text-xs text-ink/50">per night</p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <a href={`https://wa.me/918828352311?text=${waMessage}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-3 bg-gold text-ink font-bold text-sm">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Book Now
            </a>
            <a href="tel:+918828352311"
              className="flex items-center justify-center px-3 py-3 border border-forest/20 text-forest">
              <Phone size={16} />
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
