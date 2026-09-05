"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, MapPin, Star, CheckCircle2, Clock, Wifi, Tv, UtensilsCrossed, AirVent, Car, TreePine, Phone } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { heroImageUrl, cardImageUrl } from "@/lib/cloudinary";

/* ═══════════════════════════════════════════════════════════════════
   Types
═══════════════════════════════════════════════════════════════════ */
interface SiteData {
  properties: {
    id: string; name: string; slug: string;
    address: string; coordinates: string; vibe: string; baseRate: number;
  }[];
  heroPhotos: { url: string; alt: string }[];
  instagramPhotos: { url: string; alt: string }[];
  galleryPhotos: { url: string; alt: string }[];
  propertyCards: Record<string, { url: string; alt: string }[]>;
  content: {
    heroHeadline: string; heroSubtitle: string;
    philosophyText: string; taglineCloser: string;
    heroMediaUrl?: string; heroMediaType?: string;
  };
  discountPercent: number;
  activeFestival: string;
  discountActive: boolean;
}

const SLIDE_ANIMATIONS = ["kenBurnsIn", "kenBurnsOut", "panLeft", "panRight", "panUp"];

const WA_SVG = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

/* ─────────────────────────────────────────────────────────────────
   Scroll reveal hook
───────────────────────────────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("active"); io.unobserve(e.target); }
      }),
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".reveal, .reveal-up").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ─────────────────────────────────────────────────────────────────
   Festival Ambience (light-friendly colours)
───────────────────────────────────────────────────────────────── */
function FestivalAmbience({ festival, active }: { festival: string; active: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!active || !festival || !containerRef.current) return;
    const container = containerRef.current;
    container.innerHTML = "";
    const configs: Record<string, () => HTMLElement> = {
      "diwali": () => {
        const el = document.createElement("span");
        const icons = ["✨", "🪔", "⭐", "🌟"];
        el.textContent = icons[Math.floor(Math.random() * icons.length)];
        el.style.cssText = `position:absolute;font-size:${Math.random() * 14 + 8}px;left:${Math.random() * 100}%;top:-30px;opacity:${Math.random() * 0.5 + 0.2};animation:festivalFall ${Math.random() * 7 + 5}s linear ${Math.random() * 5}s infinite;pointer-events:none;`;
        return el;
      },
      "holi": () => {
        const el = document.createElement("div");
        const colors = ["#FF69B4", "#9B59B6", "#FFD700", "#2ECC71", "#FF6347", "#00BFFF"];
        const size = Math.random() * 14 + 6;
        el.style.cssText = `position:absolute;width:${size}px;height:${size * 0.7}px;border-radius:50%;background:${colors[Math.floor(Math.random() * colors.length)]};left:${Math.random() * 100}%;top:${Math.random() * 100}%;opacity:${Math.random() * 0.25 + 0.08};animation:holiFloat ${Math.random() * 8 + 5}s ease-in-out ${Math.random() * 4}s infinite alternate;pointer-events:none;`;
        return el;
      },
      "republic-day": () => {
        const el = document.createElement("div");
        const colors = ["#FF9933", "#138808"];
        const size = Math.random() * 8 + 4;
        el.style.cssText = `position:absolute;width:${size}px;height:${size}px;border-radius:50%;background:${colors[Math.floor(Math.random() * colors.length)]};left:${Math.random() * 100}%;top:-20px;opacity:${Math.random() * 0.4 + 0.15};animation:festivalFall ${Math.random() * 6 + 5}s linear ${Math.random() * 4}s infinite;pointer-events:none;`;
        return el;
      },
    };
    const factory = configs[festival];
    if (!factory) return;
    for (let i = 0; i < 24; i++) container.appendChild(factory());
    return () => { container.innerHTML = ""; };
  }, [festival, active]);
  if (!active || !festival) return null;
  return <div ref={containerRef} className="fixed inset-0 z-[5] pointer-events-none overflow-hidden" aria-hidden="true" />;
}

/* ─────────────────────────────────────────────────────────────────
   Discount Banner
───────────────────────────────────────────────────────────────── */
function DiscountBanner({ discountPercent, activeFestival, discountActive }: {
  discountPercent: number; activeFestival: string; discountActive: boolean;
}) {
  const [dismissed, setDismissed] = useState(false);
  if (!discountActive || !discountPercent || dismissed) return null;
  return (
    <div className="relative z-30 bg-gold text-ink py-2.5 px-4 text-center text-sm font-medium">
      <span className="mr-2">🎉</span>
      {activeFestival && <span className="capitalize">{activeFestival.replace(/-/g, " ")} special:</span>}{" "}
      <strong>{discountPercent}% off</strong> all bookings this week.
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/50 hover:text-ink transition-colors text-base leading-none"
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Hero Slideshow
───────────────────────────────────────────────────────────────── */
function HeroSlideshow({ slides }: { slides: { url: string; alt: string }[] }) {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setPrev(current);
      setCurrent((c) => (c + 1) % slides.length);
      setAnimKey((k) => k + 1);
    }, 7000);
    return () => clearInterval(timer);
  }, [current, slides.length]);

  if (slides.length === 0) {
    return <div className="absolute inset-0 bg-gradient-to-br from-[#eee9df] to-[#d9d0c3]" />;
  }

  return (
    <div className="absolute inset-0">
      {prev !== null && (
        <div key={`prev-${prev}`} className="absolute inset-0" style={{ animation: "fadeOut 1.2s ease-in-out forwards", zIndex: 1 }}>
          <img src={heroImageUrl(slides[prev].url)} alt={slides[prev].alt} className="w-full h-full object-cover" loading="lazy" />
        </div>
      )}
      <div key={`slide-${current}-${animKey}`} className="absolute inset-0" style={{ animation: "fadeIn 1.2s ease-in-out forwards", zIndex: 2 }}>
        <img
          src={heroImageUrl(slides[current].url)}
          alt={slides[current].alt}
          className="w-full h-full object-cover"
          style={{ animation: `${SLIDE_ANIMATIONS[current % SLIDE_ANIMATIONS.length]} 9s ease-in-out forwards` }}
          loading={current === 0 ? "eager" : "lazy"}
        />
      </div>
      {slides.length > 1 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => { setPrev(current); setCurrent(i); setAnimKey((k) => k + 1); }}
              className={`transition-all duration-400 rounded-full ${i === current ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/50"}`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Hero Section — light overlay, readable text on any photo
───────────────────────────────────────────────────────────────── */
function HeroSection({ slides, content, discountPercent, discountActive }: {
  slides: { url: string; alt: string }[];
  content: SiteData["content"];
  discountPercent: number;
  discountActive: boolean;
}) {
  return (
    <section className="relative w-full overflow-hidden" style={{ height: "100svh", minHeight: 520 }}>
      <HeroSlideshow slides={slides} />

      {/* Gradient overlay — stays light-friendly */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10 z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent z-10" />

      <div className="absolute inset-0 z-20 flex flex-col justify-end px-5 md:px-12 lg:px-20 pb-16 md:pb-24">

        {/* Location tag */}
        <div
          className="flex items-center gap-2 mb-4 hero-line-enter"
          style={{ animationDelay: "0.2s" }}
        >
          <MapPin size={12} className="text-gold" />
          <span className="label-badge text-white/80 text-[10px]">Gurugram · Haryana · India</span>
        </div>

        {/* Headline */}
        <h1
          className="font-display text-white leading-tight mb-4 hero-line-enter"
          style={{ fontSize: "clamp(2.8rem, 9vw, 7rem)", lineHeight: "1.0", animationDelay: "0.35s" }}
        >
          A Home Away
          <br />
          <span className="text-[#f0d98a] italic">From Home.</span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-white/75 text-sm md:text-lg leading-relaxed mb-7 max-w-sm md:max-w-md hero-line-enter"
          style={{ animationDelay: "0.6s" }}
        >
          {content.heroSubtitle || "Two beautiful homes in Gurugram. Warm hosts. No booking fees."}
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row gap-3 hero-line-enter"
          style={{ animationDelay: "0.8s" }}
        >
          <a
            href="https://wa.me/918828352311"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-[#25D366] text-white font-semibold text-sm hover:bg-[#1fb558] transition-colors min-h-[52px] shadow-lg"
          >
            {WA_SVG}
            Reserve on WhatsApp
          </a>
          <Link
            href="/homes"
            className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-white/15 backdrop-blur-sm border border-white/30 text-white font-medium text-sm hover:bg-white/25 transition-all min-h-[52px]"
          >
            Explore Homes <ArrowRight size={14} />
          </Link>
        </div>

        {/* Trust badges */}
        <div
          className="flex flex-wrap gap-4 mt-5 hero-line-enter"
          style={{ animationDelay: "1s" }}
        >
          <span className="flex items-center gap-1.5 text-white/55 text-xs">
            <CheckCircle2 size={11} /> Direct booking · No fees
          </span>
          <span className="flex items-center gap-1.5 text-white/55 text-xs">
            <Star size={11} className="fill-white/55" /> 4.9★ rated stays
          </span>
          <span className="flex items-center gap-1.5 text-white/55 text-xs">
            <Clock size={11} /> Responds in &lt;5 min
          </span>
          {discountActive && discountPercent > 0 && (
            <span className="flex items-center gap-1.5 text-[#f0d98a] text-xs font-medium">
              🎉 {discountPercent}% off this week
            </span>
          )}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Stats Row
───────────────────────────────────────────────────────────────── */
function StatsRow() {
  const stats = [
    { value: "2", label: "Beautiful Homes" },
    { value: "4.9★", label: "Guest Rating" },
    { value: "₹1,999", label: "Starting from/night" },
    { value: "24/7", label: "Host Support" },
  ];
  return (
    <section className="bg-white border-y border-forest/8">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-forest/8">
          {stats.map((s) => (
            <div key={s.label} className="py-5 px-4 md:px-6 text-center">
              <p className="font-display text-2xl md:text-3xl text-forest font-medium">{s.value}</p>
              <p className="text-xs text-ink/50 mt-1 font-mono">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Property Cards
───────────────────────────────────────────────────────────────── */
function PropertyCards({ properties, propertyCards, discountPercent, discountActive }: {
  properties: SiteData["properties"];
  propertyCards: SiteData["propertyCards"];
  discountPercent: number;
  discountActive: boolean;
}) {
  const fallbackImages: Record<string, string> = {
    "sushant-lok": "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
    "jharsa-village": "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
  };

  return (
    <section id="homes" className="py-14 md:py-20 px-4 md:px-6 bg-[#faf8f4]">
      <div className="max-w-5xl mx-auto">

        {/* Section heading */}
        <div className="text-center mb-10 md:mb-14 reveal">
          <span className="label-badge text-gold">Where You'll Stay</span>
          <h2 className="font-display text-title text-forest mt-3 mb-3">Our Two Homes</h2>
          <p className="text-ink/60 text-sm md:text-base max-w-xl mx-auto">
            Both in Gurugram. Both thoughtfully designed. Pick the one that feels right for you.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {properties.map((property, i) => {
            const photos = propertyCards[property.id] ?? [];
            const imgUrl = photos[0]?.url
              ? cardImageUrl(photos[0].url)
              : fallbackImages[property.slug] ?? "";
            const rate = discountActive && discountPercent > 0
              ? Math.round(property.baseRate * (1 - discountPercent / 100))
              : property.baseRate;

            return (
              <div
                key={property.id}
                className="reveal bg-white rounded-2xl overflow-hidden border border-forest/8 hover:border-gold/40 hover:shadow-xl transition-all duration-300 group"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                {/* Photo */}
                <div className="relative aspect-[4/3] overflow-hidden bg-[#eee9df]">
                  {imgUrl && (
                    <img
                      src={imgUrl}
                      alt={property.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  )}
                  {/* Price badge */}
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-sm">
                    {discountActive && discountPercent > 0 && (
                      <p className="text-[10px] font-mono text-ink/40 line-through leading-none">
                        ₹{property.baseRate.toLocaleString("en-IN")}
                      </p>
                    )}
                    <p className="text-sm font-semibold text-forest leading-tight">
                      ₹{rate.toLocaleString("en-IN")}
                      <span className="text-xs font-normal text-ink/50">/night</span>
                    </p>
                  </div>
                  {discountActive && discountPercent > 0 && (
                    <div className="absolute top-3 left-3 bg-gold text-ink text-xs font-semibold px-2.5 py-1 rounded-lg">
                      {discountPercent}% OFF
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 md:p-6">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-display text-xl md:text-2xl text-forest">{property.name}</h3>
                    <div className="flex items-center gap-1 text-xs font-mono text-gold shrink-0 mt-1">
                      <Star size={11} className="fill-gold" /> 4.9
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 mb-3">
                    <MapPin size={12} className="text-ink/35 shrink-0" />
                    <p className="text-xs text-ink/55 font-mono">{property.address}</p>
                  </div>
                  {property.vibe && (
                    <p className="text-sm text-ink/65 leading-relaxed mb-5 line-clamp-2">{property.vibe}</p>
                  )}

                  <div className="flex gap-3">
                    <Link
                      href={`/homes/${property.slug}`}
                      className="flex-1 flex items-center justify-center py-3 rounded-xl border-2 border-forest text-forest text-sm font-semibold hover:bg-forest hover:text-cream transition-all min-h-[48px]"
                    >
                      Explore Home
                    </Link>
                    <a
                      href={`https://wa.me/918828352311?text=${encodeURIComponent(`Hi! I'd like to reserve ${property.name}. Can you help?`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center px-4 py-3 rounded-xl bg-[#dcf5e5] text-[#1a7a3a] hover:bg-[#c8efda] transition-colors min-h-[48px]"
                      aria-label="WhatsApp"
                    >
                      {WA_SVG}
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* No properties fallback */}
        {properties.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {[
              { name: "Sushant Lok", address: "Sector 57, Phase 2, Gurugram", rate: 2999, slug: "sushant-lok", vibe: "Peaceful and green — a quiet retreat from the city. Perfect for work trips and longer stays." },
              { name: "Jharsa Village", address: "Sector 39, Gurugram – 122003", rate: 1999, slug: "jharsa-village", vibe: "Cosy and connected — feel the pulse of local life. Great for families and weekend getaways." },
            ].map((p, i) => (
              <div key={i} className="reveal bg-white rounded-2xl overflow-hidden border border-forest/8 hover:border-gold/40 hover:shadow-xl transition-all duration-300 group">
                <div className="aspect-[4/3] bg-gradient-to-br from-[#eee9df] to-[#d9d0c3] flex items-center justify-center">
                  <span className="font-display text-4xl text-forest/20">{p.name[0]}</span>
                </div>
                <div className="p-5 md:p-6">
                  <h3 className="font-display text-xl md:text-2xl text-forest mb-1">{p.name}</h3>
                  <div className="flex items-center gap-1.5 mb-3">
                    <MapPin size={12} className="text-ink/35 shrink-0" />
                    <p className="text-xs text-ink/55 font-mono">{p.address}</p>
                  </div>
                  <p className="text-sm text-ink/65 leading-relaxed mb-5">{p.vibe}</p>
                  <div className="flex items-center justify-between mb-5">
                    <p className="font-semibold text-forest">
                      ₹{p.rate.toLocaleString("en-IN")}
                      <span className="text-xs font-normal text-ink/45 ml-1">/night</span>
                    </p>
                  </div>
                  <Link href={`/homes/${p.slug}`} className="block w-full text-center py-3 rounded-xl border-2 border-forest text-forest text-sm font-semibold hover:bg-forest hover:text-cream transition-all">
                    Explore Home
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   How It Works — 3 clear steps
───────────────────────────────────────────────────────────────── */
function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Choose Your Home",
      desc: "Browse both properties, see photos and pricing. Pick the one that fits your trip.",
      icon: "🏠",
    },
    {
      number: "02",
      title: "Message Us on WhatsApp",
      desc: "Just send a message with your dates. We'll confirm availability within 5 minutes.",
      icon: "💬",
    },
    {
      number: "03",
      title: "Arrive & Feel at Home",
      desc: "We'll welcome you personally. The home is all yours — clean, comfortable, and ready.",
      icon: "🗝️",
    },
  ];

  return (
    <section className="py-14 md:py-20 px-4 md:px-6 bg-[#eee9df]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10 md:mb-14 reveal">
          <span className="label-badge text-gold">Simple Process</span>
          <h2 className="font-display text-title text-forest mt-3 mb-3">How It Works</h2>
          <p className="text-ink/60 text-sm md:text-base">
            Booking with us is as easy as sending a message.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-10">
          {steps.map((step, i) => (
            <div
              key={i}
              className="reveal bg-white rounded-2xl p-6 md:p-8 text-center hover:shadow-md transition-shadow border border-forest/6"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="text-3xl mb-3">{step.icon}</div>
              <div className="font-mono text-xs text-gold tracking-widest mb-2">{step.number}</div>
              <h3 className="font-display text-xl text-forest mb-3">{step.title}</h3>
              <p className="text-sm text-ink/65 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center reveal">
          <a
            href="https://wa.me/918828352311"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-[#25D366] text-white font-semibold text-sm hover:bg-[#1fb558] transition-colors min-h-[52px] shadow-md"
          >
            {WA_SVG}
            Start Your Booking on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   About / Philosophy
───────────────────────────────────────────────────────────────── */
function AboutSection({ text }: { text: string }) {
  return (
    <section className="py-14 md:py-20 px-4 md:px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">

          {/* Text side */}
          <div className="reveal">
            <span className="label-badge text-gold">About the Manor</span>
            <h2 className="font-display text-title text-forest mt-3 mb-5">
              Not a Hotel. <span className="italic">A Home.</span>
            </h2>
            <div className="space-y-4 text-sm md:text-base text-ink/70 leading-relaxed">
              <p>
                <span className="font-display text-xl text-gold italic">Mehmaan</span> — a Hindi word
                for "guest." When someone is your mehmaan, you treat them like family.
              </p>
              <p>
                {text || "That's the foundation of The Mehmaan Manor. Two carefully curated homes in Gurugram, run by real people who genuinely care about your experience. No corporate policies, no anonymous check-ins — just warm hospitality."}
              </p>
            </div>
            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sm font-medium text-forest hover:text-gold transition-colors underline-wipe"
              >
                Our Story <ArrowRight size={14} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#faf8f4] border border-forest/15 text-sm font-medium text-ink/70 hover:border-forest/40 hover:text-forest transition-all"
              >
                Meet the Hosts
              </Link>
            </div>
          </div>

          {/* Values grid */}
          <div className="reveal grid grid-cols-2 gap-4">
            {[
              { icon: "🤝", title: "Personal Welcome", desc: "We greet every guest ourselves." },
              { icon: "✨", title: "Spotless Spaces", desc: "Deep-cleaned before every stay." },
              { icon: "📞", title: "Always Reachable", desc: "Call or WhatsApp anytime." },
              { icon: "🚫", title: "Zero Hidden Fees", desc: "What you see is what you pay." },
            ].map((v, i) => (
              <div key={i} className="bg-[#faf8f4] rounded-xl p-4 border border-forest/8">
                <div className="text-xl mb-2">{v.icon}</div>
                <h4 className="text-sm font-semibold text-forest mb-1">{v.title}</h4>
                <p className="text-xs text-ink/55 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Gallery
───────────────────────────────────────────────────────────────── */
function GallerySection({ photos }: { photos: { url: string; alt: string }[] }) {
  const display = photos.slice(0, 6);
  if (display.length === 0) return null;

  return (
    <section className="py-14 md:py-20 px-4 md:px-6 bg-[#faf8f4]">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-end justify-between mb-8 reveal">
          <div>
            <span className="label-badge text-gold">Our Spaces</span>
            <h2 className="font-display text-title text-forest mt-2">A Glimpse Inside</h2>
          </div>
          <Link
            href="/gallery"
            className="hidden sm:flex items-center gap-1.5 text-sm text-ink/55 hover:text-forest transition-colors"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 reveal">
          {display.map((photo, i) => (
            <div
              key={i}
              className={`gallery-cell rounded-xl overflow-hidden ${i === 0 ? "md:col-span-2 aspect-[2/1]" : "aspect-square"}`}
            >
              <img
                src={photo.url}
                alt={photo.alt || "Mehmaan Manor interior"}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="gallery-cell-overlay rounded-xl" />
            </div>
          ))}
        </div>

        <div className="text-center mt-6 sm:hidden">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-sm font-medium text-forest hover:text-gold transition-colors"
          >
            See all photos <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Amenities strip
───────────────────────────────────────────────────────────────── */
function AmenitiesStrip() {
  const items = [
    { icon: Wifi, label: "High-Speed Wi-Fi" },
    { icon: Tv, label: "Smart TV" },
    { icon: UtensilsCrossed, label: "Full Kitchen" },
    { icon: AirVent, label: "Air Conditioning" },
    { icon: Car, label: "Free Parking" },
    { icon: TreePine, label: "Garden Access" },
  ];
  return (
    <section className="py-10 px-4 md:px-6 bg-white border-y border-forest/8">
      <div className="max-w-5xl mx-auto">
        <p className="text-center text-xs font-mono text-ink/40 uppercase tracking-widest mb-6">
          What's included in every stay
        </p>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {items.map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2 text-center">
              <div className="w-10 h-10 rounded-xl bg-[#faf8f4] border border-forest/8 flex items-center justify-center">
                <Icon size={18} className="text-gold" />
              </div>
              <span className="text-xs text-ink/60 leading-tight">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Neighbourhood / Location
───────────────────────────────────────────────────────────────── */
function NeighbourhoodSection() {
  const highlights = [
    { emoji: "🏥", label: "Near Medanta Hospital" },
    { emoji: "🚇", label: "Metro Accessible" },
    { emoji: "🍽️", label: "Great Restaurants Nearby" },
    { emoji: "🛍️", label: "Shopping Malls Close By" },
    { emoji: "🌳", label: "Parks & Green Spaces" },
    { emoji: "✈️", label: "Easy IGI Airport Access" },
  ];
  return (
    <section className="py-14 md:py-20 px-4 md:px-6 bg-[#faf8f4]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10 reveal">
          <span className="label-badge text-gold">Location</span>
          <h2 className="font-display text-title text-forest mt-3 mb-3">Everything Close By</h2>
          <p className="text-ink/60 text-sm md:text-base">
            Both homes are in great Gurugram neighbourhoods — convenient and connected.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 reveal">
          {highlights.map((h, i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-forest/8 hover:border-gold/30 hover:shadow-sm transition-all"
            >
              <span className="text-xl shrink-0">{h.emoji}</span>
              <span className="text-sm text-ink/70">{h.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Final CTA / Contact
───────────────────────────────────────────────────────────────── */
function FinalCTA() {
  return (
    <section className="py-14 md:py-24 px-4 md:px-6 bg-[#eee9df]">
      <div className="max-w-2xl mx-auto text-center reveal">
        <span className="label-badge text-gold">Ready to Book?</span>
        <h2 className="font-display text-title text-forest mt-4 mb-3">
          Book Your Stay Today
        </h2>
        <p className="text-ink/65 text-sm md:text-base mb-8 leading-relaxed max-w-md mx-auto">
          No booking platforms, no extra fees. Just message us directly and we'll take care of everything.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <a
            href="https://wa.me/918828352311"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-[#25D366] text-white font-semibold text-base hover:bg-[#1fb558] transition-colors min-h-[56px] shadow-md"
          >
            {WA_SVG}
            WhatsApp Us Now
          </a>
          <a
            href="tel:+918828352311"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-forest text-forest font-semibold text-sm hover:bg-forest hover:text-cream transition-all min-h-[56px]"
          >
            <Phone size={16} />
            Call Simran
          </a>
        </div>

        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-sm">S</div>
          <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-sm">J</div>
          <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-sm">V</div>
        </div>
        <p className="text-xs text-ink/45 font-mono">
          Simran · Jyoti · Vipin — your hosts, ready to help
        </p>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Testimonials / Review nudge
───────────────────────────────────────────────────────────────── */
function ReviewsSection() {
  const reviews = [
    {
      text: "Felt like staying at a friend's home. Simran was incredibly warm and helpful. The place was spotless.",
      author: "Priya M.",
      city: "Delhi",
      stars: 5,
    },
    {
      text: "Best short stay I've had in Gurugram. No hotel can match this level of personal care. Will definitely be back.",
      author: "Rahul K.",
      city: "Bengaluru",
      stars: 5,
    },
    {
      text: "The kitchen, the Wi-Fi, the cleanliness — everything was perfect. And the hosts respond within minutes!",
      author: "Anjali S.",
      city: "Mumbai",
      stars: 5,
    },
  ];
  return (
    <section className="py-14 md:py-20 px-4 md:px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10 reveal">
          <span className="label-badge text-gold">Guest Love</span>
          <h2 className="font-display text-title text-forest mt-3">What Guests Say</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="reveal bg-[#faf8f4] rounded-2xl p-5 md:p-6 border border-forest/8 hover:shadow-md transition-shadow"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: r.stars }).map((_, j) => (
                  <Star key={j} size={13} className="fill-gold text-gold" />
                ))}
              </div>
              <p className="text-sm text-ink/75 leading-relaxed mb-4 italic">"{r.text}"</p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#eee9df] flex items-center justify-center text-xs font-semibold text-forest">
                  {r.author[0]}
                </div>
                <div>
                  <p className="text-xs font-semibold text-ink">{r.author}</p>
                  <p className="text-xs text-ink/40 font-mono">{r.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Main Page
═══════════════════════════════════════════════════════════════════ */
export function HomePageClient({ siteData }: { siteData: SiteData }) {
  useReveal();

  const {
    properties, heroPhotos, instagramPhotos, galleryPhotos,
    propertyCards, content, discountPercent, activeFestival, discountActive,
  } = siteData;

  const heroSlides = heroPhotos.length > 0 ? heroPhotos : content.heroMediaUrl
    ? [{ url: content.heroMediaUrl, alt: "The Mehmaan Manor" }]
    : [];

  const allPhotos = [...galleryPhotos, ...instagramPhotos]
    .filter((p, i, arr) => arr.findIndex((x) => x.url === p.url) === i)
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-[#faf8f4]">
      <FestivalAmbience festival={activeFestival} active={discountActive} />
      <Navigation />
      <DiscountBanner
        discountPercent={discountPercent}
        activeFestival={activeFestival}
        discountActive={discountActive}
      />

      <main id="main-content">
        <HeroSection
          slides={heroSlides}
          content={content}
          discountPercent={discountPercent}
          discountActive={discountActive}
        />
        <StatsRow />
        <PropertyCards
          properties={properties}
          propertyCards={propertyCards}
          discountPercent={discountPercent}
          discountActive={discountActive}
        />
        <HowItWorks />
        <AboutSection text={content.philosophyText} />
        <AmenitiesStrip />
        <GallerySection photos={allPhotos} />
        <ReviewsSection />
        <NeighbourhoodSection />
        <FinalCTA />
      </main>

      <Footer />
    </div>
  );
}
