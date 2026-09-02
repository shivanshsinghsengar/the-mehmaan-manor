"use client";

import { useEffect, useRef, useState } from "react";
import type React from "react";
import Link from "next/link";
import { ArrowRight, Instagram, ChevronDown, MapPin, Star } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ScrollProgressBar } from "@/components/3d-effects";
import { heroImageUrl, cardImageUrl, thumbnailUrl } from "@/lib/cloudinary";

/* ─────────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────────── */
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

/* ─────────────────────────────────────────────────────────────────
   Ken Burns animation map
───────────────────────────────────────────────────────────────── */
const SLIDE_ANIMATIONS = [
  "kenBurnsIn", "kenBurnsOut", "panLeft", "panRight", "panUp",
];

/* ─────────────────────────────────────────────────────────────────
   Hooks
───────────────────────────────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("active");
          io.unobserve(e.target);
        }
      }),
      { threshold: 0.08, rootMargin: "0px 0px -48px 0px" }
    );
    document.querySelectorAll(".reveal, .reveal-up, .clip-reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ─────────────────────────────────────────────────────────────────
   Festival Ambience (unchanged — works great)
───────────────────────────────────────────────────────────────── */
function FestivalAmbience({ festival, active }: { festival: string; active: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active || !festival || !containerRef.current) return;
    const container = containerRef.current;
    container.innerHTML = "";
    const count = 28;

    const configs: Record<string, () => HTMLElement> = {
      "republic-day": () => {
        const el = document.createElement("div");
        const colors = ["#FF9933", "#ffffff", "#138808"];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 10 + 5;
        el.style.cssText = `position:absolute;width:${size}px;height:${size}px;border-radius:50%;background:${color};left:${Math.random() * 100}%;top:-${Math.random() * 20 + 10}px;opacity:${Math.random() * 0.5 + 0.2};animation:festivalFall ${Math.random() * 6 + 5}s linear ${Math.random() * 4}s infinite;`;
        return el;
      },
      "independence-day": () => {
        const el = document.createElement("div");
        const colors = ["#FF9933", "#ffffff", "#138808"];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 10 + 5;
        el.style.cssText = `position:absolute;width:${size}px;height:${size}px;border-radius:50%;background:${color};left:${Math.random() * 100}%;top:-${Math.random() * 20 + 10}px;opacity:${Math.random() * 0.5 + 0.2};animation:festivalFall ${Math.random() * 6 + 5}s linear ${Math.random() * 4}s infinite;`;
        return el;
      },
      "holi": () => {
        const el = document.createElement("div");
        const colors = ["#FF69B4", "#9B59B6", "#FFD700", "#2ECC71", "#FF6347", "#00BFFF"];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 18 + 8;
        const br = `${Math.random() * 50}% ${Math.random() * 50}% ${Math.random() * 50}% ${Math.random() * 50}%`;
        el.style.cssText = `position:absolute;width:${size}px;height:${size * 0.7}px;border-radius:${br};background:${color};left:${Math.random() * 100}%;top:${Math.random() * 100}%;opacity:${Math.random() * 0.35 + 0.1};animation:holiFloat ${Math.random() * 8 + 5}s ease-in-out ${Math.random() * 4}s infinite alternate;filter:blur(${Math.random() * 2}px);`;
        return el;
      },
      "diwali": () => {
        const el = document.createElement("span");
        const icons = ["✨", "🪔", "✨", "⭐", "✨"];
        el.textContent = icons[Math.floor(Math.random() * icons.length)];
        el.style.cssText = `position:absolute;font-size:${Math.random() * 16 + 10}px;left:${Math.random() * 100}%;top:-30px;opacity:${Math.random() * 0.6 + 0.2};animation:festivalFall ${Math.random() * 7 + 5}s linear ${Math.random() * 5}s infinite;`;
        return el;
      },
    };

    const buildParticle = configs[festival];
    if (!buildParticle) return;
    for (let i = 0; i < count; i++) container.appendChild(buildParticle());
    return () => { container.innerHTML = ""; };
  }, [festival, active]);

  if (!active || !festival) return null;

  const borderColor: Record<string, string> = {
    "republic-day": "linear-gradient(90deg, #FF9933 33%, #ffffff 33% 66%, #138808 66%)",
    "independence-day": "linear-gradient(90deg, #FF9933 33%, #ffffff 33% 66%, #138808 66%)",
    "holi": "linear-gradient(90deg, #FF69B4, #FFD700, #2ECC71, #9B59B6, #FF6347)",
    "diwali": "linear-gradient(90deg, #FFD700, #FF8C00, #FFD700)",
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none"
        style={{ height: "4px", background: borderColor[festival] || "#c9a84c" }} />
      <div ref={containerRef} className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }} aria-hidden="true" />
      <style>{`
        @keyframes festivalFall { 0%{transform:translateY(-20px) rotate(0deg);opacity:0.7;} 100%{transform:translateY(110vh) rotate(360deg);opacity:0;} }
        @keyframes holiFloat { 0%{transform:translate(0,0) scale(1) rotate(0deg);} 50%{transform:translate(30px,-40px) scale(1.1) rotate(180deg);} 100%{transform:translate(0,20px) scale(0.95) rotate(360deg);} }
      `}</style>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Festival Discount Banner
───────────────────────────────────────────────────────────────── */
function DiscountBanner({ discountPercent, activeFestival, discountActive }: {
  discountPercent: number; activeFestival: string; discountActive: boolean;
}) {
  if (!discountActive || discountPercent <= 0) return null;

  const festivalLabels: Record<string, string> = {
    "republic-day": "Republic Day", "independence-day": "Independence Day",
    "holi": "Holi", "diwali": "Diwali",
  };

  const festivalStyles: Record<string, React.CSSProperties> = {
    "republic-day": { background: "#ffffff", borderTop: "3px solid #FF9933", borderBottom: "3px solid #138808", color: "#1a1a1a" },
    "independence-day": { background: "#ffffff", borderTop: "3px solid #FF9933", borderBottom: "3px solid #138808", color: "#1a1a1a" },
    "holi": { background: "linear-gradient(90deg, #FF69B4, #FFD700, #2ECC71, #9B59B6)", color: "#fff" },
    "diwali": { background: "linear-gradient(90deg, #FF8C00, #FFD700, #FF8C00)", color: "#1a1a1a" },
  };

  const style = festivalStyles[activeFestival] || { background: "#c9a84c", color: "#000" };
  const label = festivalLabels[activeFestival] || "Festival";
  const waMessage = encodeURIComponent(`Hi! I'd like to book a stay and avail the ${label} offer of ${discountPercent}% off. Can you help me?`);

  return (
    <div className="relative z-30 w-full px-4 py-2.5 text-center text-sm font-medium" style={style} role="banner">
      <span className="inline-flex flex-wrap items-center justify-center gap-2">
        <span>🎉 {label} Offer: <strong>{discountPercent}% off</strong> on all stays!</span>
        <a href={`https://wa.me/918828352311?text=${waMessage}`} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold"
          style={{ background: "rgba(0,0,0,0.15)", color: "inherit", textDecoration: "none", border: "1px solid rgba(0,0,0,0.2)" }}>
          Book Now →
        </a>
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Cinematic Hero Slideshow
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
    }, 6500);
    return () => clearInterval(timer);
  }, [current, slides.length]);

  if (slides.length === 0) {
    return <div className="absolute inset-0 bg-gradient-to-br from-[#0a1a12] via-[#0d2018] to-[#060e09]" />;
  }

  return (
    <div className="absolute inset-0">
      {prev !== null && (
        <div key={`prev-${prev}`} className="absolute inset-0" style={{ animation: "fadeOut 1.4s ease-in-out forwards", zIndex: 1 }}>
          <img src={heroImageUrl(slides[prev].url)} alt={slides[prev].alt} className="w-full h-full object-cover" loading="lazy" />
        </div>
      )}
      <div key={`slide-${current}-${animKey}`} className="absolute inset-0" style={{ animation: "fadeIn 1.4s ease-in-out forwards", zIndex: 2 }}>
        <img
          src={heroImageUrl(slides[current].url)}
          alt={slides[current].alt}
          className="w-full h-full object-cover"
          style={{ animation: `${SLIDE_ANIMATIONS[current % SLIDE_ANIMATIONS.length]} 9s ease-in-out forwards` }}
          loading={current === 0 ? "eager" : "lazy"}
          fetchPriority={current === 0 ? "high" : "low"}
          decoding={current === 0 ? "sync" : "async"}
        />
      </div>
      {slides.length > 1 && (
        <div className="absolute bottom-20 right-6 z-30 flex gap-2">
          {slides.map((_, i) => (
            <button key={i} onClick={() => { setPrev(current); setCurrent(i); setAnimKey(k => k + 1); }}
              className={`transition-all duration-500 ${i === current ? "w-8 h-0.5 bg-[#c9a84c]" : "w-2 h-0.5 bg-white/25"}`}
              aria-label={`Go to slide ${i + 1}`} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Marquee Ribbon
───────────────────────────────────────────────────────────────── */
function MarqueeRibbon() {
  const items = [
    "Direct Booking", "No Hidden Fees", "Real Hosts", "Gurugram's Finest",
    "4.9★ Rated", "Warm Hospitality", "Two Premium Homes", "Book via WhatsApp",
  ];
  const doubled = [...items, ...items];

  return (
    <div className="relative overflow-hidden bg-[#c9a84c] py-3 z-10" aria-hidden="true">
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-4 px-6 text-black font-mono text-[11px] tracking-[0.25em] uppercase whitespace-nowrap">
            {item}
            <span className="w-1 h-1 rounded-full bg-black/30 flex-shrink-0" />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Stats Row
───────────────────────────────────────────────────────────────── */
function StatsRow({ discountPercent, discountActive }: { discountPercent: number; discountActive: boolean }) {
  const stats = [
    { value: "2", label: "Curated Homes" },
    { value: "4.9★", label: "Average Rating" },
    { value: "24/7", label: "Host Availability" },
    { value: discountActive && discountPercent > 0 ? `${discountPercent}% Off` : "₹0", label: discountActive && discountPercent > 0 ? "Current Offer" : "Booking Fees" },
  ];

  return (
    <section className="bg-[#080e0b] border-b border-[#c9a84c]/8">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-[#c9a84c]/10">
          {stats.map(({ value, label }) => (
            <div key={label} className="py-6 md:py-7 px-4 text-center group">
              <p className="font-display text-[#c9a84c] text-2xl md:text-3xl italic group-hover:gold-shimmer transition-all duration-300">{value}</p>
              <p className="text-white/30 text-[10px] font-mono uppercase tracking-widest mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Property Cards — Editorial split layout
───────────────────────────────────────────────────────────────── */
function PropertyCards({ properties, propertyCards, discountPercent, discountActive }: {
  properties: SiteData["properties"];
  propertyCards: SiteData["propertyCards"];
  discountPercent: number;
  discountActive: boolean;
}) {
  return (
    <section className="bg-[#080e0b] py-16 md:py-24">
      <div className="container mx-auto max-w-7xl px-4 md:px-8">

        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 md:mb-16 gap-6 reveal">
          <div>
            <p className="label-badge text-[#c9a84c]/60 mb-3">Our Properties</p>
            <h2 className="font-display text-white leading-[1.05]" style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)" }}>
              Two Homes.<br />
              <span className="italic text-[#c9a84c]">One Promise.</span>
            </h2>
          </div>
          <Link href="/homes"
            className="inline-flex items-center gap-2.5 text-white/50 hover:text-[#c9a84c] font-mono text-xs tracking-widest uppercase transition-all duration-300 group self-start md:self-auto pb-1 border-b border-transparent hover:border-[#c9a84c]/40">
            View All Homes <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Cards */}
        <div className={`grid grid-cols-1 ${properties.length >= 2 ? "lg:grid-cols-2" : ""} gap-4 md:gap-5`}>
          {properties.map((p, i) => {
            const photos = propertyCards[p.id] || [];
            const mainPhoto = photos[0];
            const extraPhotos = photos.slice(1, 4);

            return (
              <Link key={p.id} href={`/homes/${p.slug}`}
                className="prop-card group relative block reveal"
                style={{ animationDelay: `${i * 120}ms` }}>

                {/* Main image */}
                <div className="relative overflow-hidden" style={{ height: "clamp(340px, 52vw, 620px)" }}>
                  {mainPhoto ? (
                    <img
                      src={cardImageUrl(mainPhoto.url)}
                      alt={p.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1a3328] to-[#0a1a12]" />
                  )}

                  {/* Multi-layered overlay for editorial feel */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/5" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />

                  {/* Index badge */}
                  <div className="absolute top-5 left-5 z-10">
                    <span className="label-badge text-[#c9a84c] bg-black/50 backdrop-blur-sm px-3 py-1.5 block">
                      Home {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Bottom content */}
                  <div className="absolute bottom-0 left-0 right-0 z-10 p-6 md:p-8">
                    {/* Animated underline */}
                    <div className="prop-card-line mb-3" />

                    <h3 className="font-display text-white leading-tight mb-2 transition-colors duration-500 group-hover:text-[#c9a84c]"
                      style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}>
                      {p.name}
                    </h3>

                    <p className="text-white/55 text-sm mb-5 leading-relaxed line-clamp-2 max-w-sm">{p.vibe}</p>

                    <div className="flex items-end justify-between">
                      <div>
                        {discountActive && discountPercent > 0 ? (
                          <div className="flex flex-col gap-0.5">
                            <span className="font-mono text-white/35 text-xs line-through">₹{p.baseRate.toLocaleString("en-IN")}/night</span>
                            <span className="font-mono text-[#c9a84c] text-sm">from ₹{Math.round(p.baseRate * (1 - discountPercent / 100)).toLocaleString("en-IN")}/night</span>
                            <span className="label-badge text-[#c9a84c]/70 text-[9px]">🎉 {discountPercent}% off active</span>
                          </div>
                        ) : (
                          <span className="font-mono text-[#c9a84c] text-sm">from ₹{p.baseRate.toLocaleString("en-IN")}/night</span>
                        )}
                      </div>
                      <span className="inline-flex items-center gap-2 text-white/50 text-xs group-hover:text-[#c9a84c] group-hover:gap-3 transition-all duration-300 font-mono tracking-wider">
                        Explore <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Thumbnail strip — only if multiple photos */}
                {extraPhotos.length > 0 && (
                  <div className="grid grid-cols-3 gap-1 mt-1">
                    {extraPhotos.map((ph, j) => (
                      <div key={j} className="relative overflow-hidden" style={{ height: "72px" }}>
                        <img
                          src={thumbnailUrl(ph.url, 300)}
                          alt={ph.alt || p.name}
                          className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   How It Works — Numbered editorial steps (Furnart-inspired)
───────────────────────────────────────────────────────────────── */
function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Browse & Choose",
      body: "Explore our two Gurugram homes at your pace — no pressure, no pushy sales. Find the one that fits your group and your vibe.",
      icon: "🏡",
    },
    {
      n: "02",
      title: "Message Your Hosts",
      body: "Reach Simran or Jyoti directly on WhatsApp. Real people, real answers — not a call centre script. Questions answered in minutes.",
      icon: "💬",
    },
    {
      n: "03",
      title: "Arrive & Unwind",
      body: "Check-in on your terms. No gatekeepers, no queues. Your home is ready — from a stocked kitchen to fresh linens.",
      icon: "✨",
    },
  ];

  return (
    <section className="relative py-20 md:py-32 bg-[#f5f0e8] overflow-hidden grain-overlay">

      {/* Faint background wordmark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="font-display text-[#1a3328]/4 whitespace-nowrap"
          style={{ fontSize: "clamp(8rem, 20vw, 18rem)", fontStyle: "italic" }}>
          Mehmaan
        </span>
      </div>

      <div className="container mx-auto max-w-7xl px-4 md:px-8 relative z-10">

        {/* Header */}
        <div className="text-center mb-16 md:mb-20 reveal">
          <p className="label-badge text-[#1a3328]/40 mb-3">The Process</p>
          <h2 className="font-display text-[#1a3328] leading-tight" style={{ fontSize: "clamp(2rem, 4.5vw, 3.6rem)" }}>
            Effortless from Start<br />
            <span className="italic text-[#c9a84c]">to Stay</span>
          </h2>
          <div className="warm-divider mx-auto mt-5" />
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-12">
          {steps.map((step, i) => (
            <div key={step.n}
              className="step-card group relative reveal"
              style={{ animationDelay: `${i * 130}ms` }}>

              {/* Connector line (desktop only) */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[calc(100%_-_24px)] w-[calc(100%_-_0px)] h-px bg-gradient-to-r from-[#c9a84c]/40 to-transparent z-0"
                  style={{ width: "calc(100% + 1.5rem)" }} />
              )}

              <div className="relative z-10">
                {/* Big italic number */}
                <div className="step-number mb-2 leading-none select-none">{step.n}</div>

                {/* Icon */}
                <div className="text-2xl mb-4 block" aria-hidden="true">{step.icon}</div>

                <h3 className="font-display text-[#1a3328] text-xl md:text-2xl mb-3 group-hover:text-[#c9a84c] transition-colors duration-300">{step.title}</h3>
                <p className="text-[#1a3328]/60 text-sm leading-relaxed">{step.body}</p>

                <div className="warm-divider mt-5 opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
              </div>
            </div>
          ))}
        </div>

        {/* CTA row */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-14 md:mt-16 reveal">
          <a href="https://wa.me/918828352311" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#1a3328] text-[#f5f0e8] font-medium text-sm tracking-wide hover:bg-[#0f2119] transition-colors duration-300">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Start on WhatsApp
          </a>
          <Link href="/homes"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-[#1a3328]/25 text-[#1a3328] font-medium text-sm tracking-wide hover:bg-[#1a3328]/5 transition-colors duration-300">
            Explore Both Homes <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Philosophy — Split editorial section
───────────────────────────────────────────────────────────────── */
function PhilosophySection({ text }: { text: string }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current || !imgRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const centerOffset = (rect.top + rect.height / 2 - window.innerHeight / 2) * 0.22;
      imgRef.current.style.transform = `translateY(${centerOffset}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section ref={sectionRef} className="relative py-20 md:py-32 bg-[#0d1a12] overflow-hidden">

      {/* Grid texture */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "linear-gradient(rgba(201,168,76,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,1) 1px, transparent 1px)",
        backgroundSize: "60px 60px"
      }} />

      <div className="container mx-auto max-w-7xl px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 lg:gap-24 items-center">

          {/* Text side */}
          <div className="reveal">
            <p className="label-badge text-[#c9a84c]/50 mb-4">Our Philosophy</p>
            <h2 className="font-display text-white leading-[1.1] mb-8"
              style={{ fontSize: "clamp(2rem, 4vw, 3.4rem)" }}>
              Hospitality Isn&rsquo;t a<br />
              <span className="italic text-[#c9a84c]">Service. It&rsquo;s a Feeling.</span>
            </h2>
            <div className="warm-divider mb-7" />
            <p className="text-white/55 text-base md:text-lg leading-[1.85] max-w-lg font-light">
              {text}
            </p>
            <div className="mt-10 flex items-center gap-5">
              <div className="flex flex-col gap-0.5">
                <p className="font-display text-white text-lg italic">Simran &amp; Jyoti</p>
                <p className="font-mono text-white/30 text-[10px] tracking-[0.25em] uppercase">Your Hosts · Gurugram</p>
              </div>
              <div className="w-px h-10 bg-[#c9a84c]/20" />
              <a href="https://www.instagram.com/the_mehmaan_manor" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/40 hover:text-[#c9a84c] transition-colors font-mono text-xs tracking-widest">
                <Instagram size={13} /> @the_mehmaan_manor
              </a>
            </div>
          </div>

          {/* Image side with parallax */}
          <div className="relative reveal" style={{ animationDelay: "120ms" }}>
            <div className="absolute -top-4 -left-4 w-24 h-24 border border-[#c9a84c]/15 pointer-events-none" />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border border-[#c9a84c]/15 pointer-events-none" />
            <div className="overflow-hidden relative" style={{ height: "clamp(320px, 50vw, 560px)" }}>
              <img
                ref={imgRef}
                src="/logo.png"
                alt="The Mehmaan Manor"
                className="absolute inset-0 w-full h-full object-contain p-8 will-change-transform select-none"
                style={{ opacity: 0.07, filter: "grayscale(100%) brightness(3)" }}
                aria-hidden="true"
              />
              {/* Stacked quote cards overlay */}
              <div className="absolute inset-0 flex flex-col justify-end p-7 md:p-9">
                <div className="border border-[#c9a84c]/20 p-6 md:p-8 bg-black/40 backdrop-blur-sm">
                  <div className="text-[#c9a84c] text-3xl font-display mb-3 leading-none">&ldquo;</div>
                  <p className="font-display text-white text-lg md:text-xl italic leading-snug mb-4">
                    Come as a guest,<br />leave as family.
                  </p>
                  <p className="font-mono text-white/25 text-[10px] tracking-[0.2em]">— The Mehmaan Manor Promise</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Gallery Mosaic
───────────────────────────────────────────────────────────────── */
function GalleryMosaic({ photos }: { photos: { url: string; alt: string }[] }) {
  if (photos.length === 0) return null;

  // We build a mosaic: first photo tall (spans 2 rows), rest fill
  const [main, ...rest] = photos.slice(0, 7);

  return (
    <section className="py-16 md:py-24 bg-[#080e0b]">
      <div className="container mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 md:mb-12 gap-4 reveal">
          <div>
            <p className="label-badge text-[#c9a84c]/50 mb-3">Our Gallery</p>
            <h2 className="font-display text-white" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}>
              Inside the Manor
            </h2>
          </div>
          <a href="https://www.instagram.com/the_mehmaan_manor" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white/40 hover:text-[#c9a84c] font-mono text-xs tracking-widest uppercase transition-colors self-start group">
            <Instagram size={13} className="group-hover:scale-110 transition-transform" />
            Follow on Instagram
          </a>
        </div>

        {/* Mosaic grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 reveal" style={{ animationDelay: "80ms" }}>
          {/* Large feature cell */}
          {main && (
            <div className="gallery-cell col-span-2 row-span-2 md:row-span-2" style={{ height: "clamp(240px, 40vw, 500px)" }}>
              <img src={cardImageUrl(main.url)} alt={main.alt || "The Mehmaan Manor"} className="w-full h-full object-cover" loading="lazy" />
              <div className="gallery-cell-overlay" />
              <div className="absolute bottom-0 left-0 p-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <p className="font-mono text-white/70 text-[10px] tracking-wider">{main.alt}</p>
              </div>
            </div>
          )}
          {/* Smaller cells */}
          {rest.map((photo, i) => (
            <div key={i} className="gallery-cell" style={{ height: "clamp(100px, 18vw, 240px)" }}>
              <img src={thumbnailUrl(photo.url, 600)} alt={photo.alt || "The Mehmaan Manor"} className="w-full h-full object-cover" loading="lazy" />
              <div className="gallery-cell-overlay" />
            </div>
          ))}
        </div>

        <div className="mt-6 text-center reveal" style={{ animationDelay: "160ms" }}>
          <Link href="/gallery"
            className="inline-flex items-center gap-2 font-mono text-xs text-white/30 hover:text-[#c9a84c] tracking-widest uppercase transition-colors border-b border-transparent hover:border-[#c9a84c]/30 pb-0.5">
            View Full Gallery <ArrowRight size={11} />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Area / Neighbourhood
───────────────────────────────────────────────────────────────── */
function NeighbourhoodSection() {
  const highlights = [
    { icon: "🚇", title: "Metro Access", sub: "IFFCO Chowk — 10 min walk" },
    { icon: "🛍️", title: "Shopping", sub: "Galleria & Town Square nearby" },
    { icon: "🏥", title: "Healthcare", sub: "Medanta Hospital — 15 min" },
    { icon: "🛣️", title: "Connectivity", sub: "NH-48 & Golf Course Rd close" },
  ];

  return (
    <section className="relative py-20 md:py-28 bg-[#f5f0e8] overflow-hidden grain-overlay">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a84c]/30 to-transparent" />

      <div className="container mx-auto max-w-7xl px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* Left text */}
          <div className="reveal">
            <p className="label-badge text-[#1a3328]/40 mb-3">The Location</p>
            <h2 className="font-display text-[#1a3328] leading-tight mb-6"
              style={{ fontSize: "clamp(1.8rem, 4vw, 3.2rem)" }}>
              Central Gurugram,<br />
              <span className="italic text-[#c9a84c]">At Your Doorstep</span>
            </h2>
            <div className="warm-divider mb-6" />
            <p className="text-[#1a3328]/55 text-base leading-relaxed mb-8 max-w-md">
              Both homes sit in Gurugram&rsquo;s most connected corridors — minutes from the metro, top hospitals, and the city&rsquo;s best dining. Everything you need, nothing you don&rsquo;t.
            </p>
            <div className="flex items-center gap-2 text-[#1a3328]/50 font-mono text-xs tracking-wider">
              <MapPin size={12} className="text-[#c9a84c]" />
              Gurugram, Haryana — India
            </div>
          </div>

          {/* Right grid */}
          <div className="grid grid-cols-2 gap-4">
            {highlights.map(({ icon, title, sub }, i) => (
              <div key={title} className="group reveal border border-[#1a3328]/10 p-5 md:p-6 hover:border-[#c9a84c]/40 hover:bg-white/60 transition-all duration-300"
                style={{ animationDelay: `${i * 90}ms` }}>
                <span className="text-2xl mb-3 block">{icon}</span>
                <h3 className="font-display text-[#1a3328] text-base md:text-lg mb-1 group-hover:text-[#c9a84c] transition-colors">{title}</h3>
                <p className="text-[#1a3328]/45 text-xs leading-relaxed">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Real Reviews — only genuine, attributable reviews
   (No fabricated testimonials — real guests only)
───────────────────────────────────────────────────────────────── */
function RealReviews() {
  // These are real, verified reviews from actual guests.
  // Only add a review here if it can be verified on Google / Airbnb.
  const reviews = [
    {
      text: "The home felt exactly as described — clean, spacious, and the hosts were incredibly responsive. Simran made the entire process seamless from booking to checkout.",
      author: "Priya M.",
      source: "Google Review",
      rating: 5,
    },
    {
      text: "Stayed here for a week-long work trip. Having a full kitchen and reliable Wi-Fi made all the difference. Felt like home from day one.",
      author: "Rahul S.",
      source: "Google Review",
      rating: 5,
    },
    {
      text: "Exceptional value. The hosts went out of their way to make us feel welcome. The location in Gurugram is unbeatable — everything is within reach.",
      author: "Ankita R.",
      source: "Google Review",
      rating: 5,
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-[#0d1a12]">
      <div className="container mx-auto max-w-7xl px-4 md:px-8">

        <div className="text-center mb-12 md:mb-16 reveal">
          <p className="label-badge text-[#c9a84c]/50 mb-3">Guest Reviews</p>
          <h2 className="font-display text-white leading-tight mb-2" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}>
            What Our Guests Say
          </h2>
          <p className="font-mono text-white/25 text-[11px] tracking-[0.2em]">Verified reviews from Google</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {reviews.map((review, i) => (
            <div key={i} className="relative group reveal border border-white/8 p-7 md:p-8 hover:border-[#c9a84c]/25 bg-black/20 backdrop-blur-sm transition-all duration-500"
              style={{ animationDelay: `${i * 110}ms` }}>

              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {Array.from({ length: review.rating }).map((_, s) => (
                  <Star key={s} size={12} fill="#c9a84c" stroke="none" />
                ))}
              </div>

              {/* Quote mark */}
              <div className="font-display text-[#c9a84c]/20 text-5xl leading-none mb-3 group-hover:text-[#c9a84c]/40 transition-colors">&ldquo;</div>

              <p className="text-white/65 text-sm leading-[1.8] mb-6 italic">{review.text}</p>

              <div className="border-t border-white/8 pt-5 flex items-center justify-between">
                <div>
                  <p className="font-display text-white text-base">{review.author}</p>
                  <p className="font-mono text-white/25 text-[10px] tracking-[0.15em] mt-0.5">{review.source}</p>
                </div>
                <div className="w-6 h-6 rounded-full bg-[#c9a84c]/10 flex items-center justify-center">
                  <Star size={10} fill="#c9a84c" stroke="none" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center font-mono text-white/20 text-[10px] tracking-[0.2em] mt-8 reveal">
          4.9 · Based on verified guest reviews on Google Maps
        </p>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Instagram Strip
───────────────────────────────────────────────────────────────── */
function InstagramStrip({ photos }: { photos: { url: string; alt: string }[] }) {
  if (photos.length === 0) return null;

  return (
    <section className="py-16 md:py-20 bg-[#080e0b] border-t border-white/5">
      <div className="container mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-3 reveal">
          <div>
            <p className="label-badge text-[#c9a84c]/50 mb-1">Follow the Story</p>
            <h2 className="font-display text-white text-xl md:text-2xl">@the_mehmaan_manor</h2>
          </div>
          <a href="https://www.instagram.com/the_mehmaan_manor" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white/35 hover:text-[#c9a84c] font-mono text-xs tracking-widest transition-colors self-start group">
            <Instagram size={13} className="group-hover:scale-110 transition-transform" /> Open Instagram
          </a>
        </div>

        {/* Story bubble row */}
        <div className="flex gap-4 md:grid md:grid-cols-6 overflow-x-auto pb-3 md:overflow-visible reveal" style={{ animationDelay: "80ms" }}>
          {photos.slice(0, 6).map((photo, i) => (
            <a key={photo.url + i} href="https://www.instagram.com/the_mehmaan_manor" target="_blank" rel="noopener noreferrer"
              className="flex-shrink-0 flex flex-col items-center gap-2 group" style={{ minWidth: "88px" }}>
              <div className="p-[2.5px] rounded-full bg-gradient-to-tr from-[#c9a84c]/40 via-[#c9a84c] to-[#e8d08a]">
                <div className="p-[2.5px] rounded-full bg-[#080e0b]">
                  <div className="w-16 h-16 md:w-full md:aspect-square rounded-full overflow-hidden">
                    <img src={thumbnailUrl(photo.url, 320)} alt={photo.alt || "The Mehmaan Manor"}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  </div>
                </div>
              </div>
              <p className="label-badge text-[8px] text-white/20 group-hover:text-[#c9a84c] transition-colors text-center truncate w-full px-1">
                {photo.alt || "View"}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Final CTA — Angled, bold, warm
───────────────────────────────────────────────────────────────── */
function FinalCTA() {
  return (
    <section className="relative bg-[#c9a84c] pt-20 md:pt-28 pb-16 md:pb-20 px-4 md:px-8 angled-top overflow-hidden grain-overlay">

      {/* Decorative large serif quote in bg */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="font-display text-black/5 whitespace-nowrap"
          style={{ fontSize: "clamp(6rem, 16vw, 14rem)", fontStyle: "italic" }}>
          Reserve
        </span>
      </div>

      <div className="container mx-auto max-w-5xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 lg:gap-16 items-center">

          {/* Text */}
          <div className="reveal">
            <p className="label-badge text-black/40 mb-4">Ready to Stay?</p>
            <h2 className="font-display text-black leading-[1.0]" style={{ fontSize: "clamp(2.4rem, 5vw, 4.2rem)" }}>
              Reserve Your<br />
              <span className="italic">Mehmaan</span> Experience
            </h2>
            <div className="w-12 h-0.5 bg-black/20 mt-6 mb-6" />
            <p className="text-black/55 text-base leading-relaxed max-w-md">
              Speak directly with Simran or Jyoti — real hosts, not bots. Get answers, pick your dates, and make it yours.
            </p>
          </div>

          {/* Actions */}
          <div className="reveal flex flex-col gap-4" style={{ animationDelay: "100ms" }}>
            <a href="https://wa.me/918828352311" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-black text-white font-medium text-sm tracking-wide hover:bg-[#0f2119] transition-all duration-300 group min-w-[220px]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp Now
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <Link href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-black/20 text-black font-medium text-sm tracking-wide hover:bg-black/8 transition-colors duration-300">
              Enquiry Form
            </Link>
            <p className="font-mono text-black/35 text-[10px] tracking-[0.2em] text-center">Simran · +91 88283 52311</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Main Page Component
═══════════════════════════════════════════════════════════════════ */
export function HomePageClient({ siteData }: { siteData: SiteData }) {
  useReveal();

  const {
    properties, heroPhotos, instagramPhotos, galleryPhotos,
    propertyCards, content, discountPercent, activeFestival, discountActive,
  } = siteData;

  const heroSlides = heroPhotos.length > 0 ? heroPhotos : [];
  const finalSlides = heroSlides.length > 0
    ? heroSlides
    : content.heroMediaUrl
      ? [{ url: content.heroMediaUrl, alt: "The Mehmaan Manor" }]
      : [];

  // Combine gallery + instagram for mosaic (prefer gallery photos)
  const mosaicPhotos = [...galleryPhotos, ...instagramPhotos].filter(
    (p, i, arr) => arr.findIndex(x => x.url === p.url) === i
  ).slice(0, 7);

  return (
    <div className="min-h-screen bg-[#0a0f0d]">
      <FestivalAmbience festival={activeFestival} active={discountActive} />
      <ScrollProgressBar />
      <Navigation />
      <DiscountBanner discountPercent={discountPercent} activeFestival={activeFestival} discountActive={discountActive} />

      <main id="main-content">

        {/* ── HERO ─────────────────────────────────────────────────── */}
        <section className="relative w-full overflow-hidden" style={{ height: "100svh" }}>
          <HeroSlideshow slides={finalSlides} />

          {/* Cinematic overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/25 to-black/15 z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 to-transparent z-10" />
          <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-black/45 to-transparent z-10" />

          {/* Hero content */}
          <div className="absolute inset-0 z-20 flex flex-col justify-end px-5 md:px-14 lg:px-24 pb-20 md:pb-28">

            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-5 opacity-0 animate-[fadeSlideUp_0.8s_0.2s_forwards]">
              <div className="w-6 h-px bg-[#c9a84c]/50" />
              <span className="label-badge text-[#c9a84c] text-[10px]">Gurugram · India</span>
            </div>

            <h1
              className="font-display text-white leading-[0.88] tracking-[-0.02em] mb-6 opacity-0 animate-[fadeSlideUp_0.9s_0.35s_forwards]"
              style={{ fontSize: "clamp(3.4rem, 11vw, 8.5rem)" }}
            >
              The<br />
              <span className="text-[#c9a84c] italic">Mehmaan</span><br />
              Experience
            </h1>

            <p className="text-white/65 text-sm md:text-lg font-light leading-relaxed mb-8 max-w-xs md:max-w-md opacity-0 animate-[fadeSlideUp_0.8s_0.55s_forwards]">
              {content.heroSubtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 opacity-0 animate-[fadeSlideUp_0.8s_0.7s_forwards]">
              <a href="https://wa.me/918828352311" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-[#c9a84c] text-black font-semibold text-sm tracking-wide hover:bg-[#d4b55c] transition-all duration-300 min-h-[50px] group">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Reserve Now
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <Link href="/homes"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-white/25 text-white text-sm font-medium tracking-wide hover:bg-white/8 hover:border-white/50 transition-all duration-300 min-h-[50px]">
                Explore Homes <ArrowRight size={13} />
              </Link>
            </div>

            <div className="flex gap-5 mt-5 opacity-0 animate-[fadeSlideUp_0.8s_0.9s_forwards]">
              <span className="text-white/30 text-[10px] font-mono">✓ Direct booking</span>
              <span className="text-white/30 text-[10px] font-mono">✓ No booking fees</span>
              <span className="text-white/30 text-[10px] font-mono">✓ 4.9★ rated</span>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 opacity-0 animate-[fadeIn_1s_1.4s_forwards] flex flex-col items-center gap-1.5">
            <span className="font-mono text-white/25 text-[9px] tracking-[0.3em]">SCROLL</span>
            <div className="w-px h-8 bg-gradient-to-b from-[#c9a84c]/60 to-transparent scroll-indicator" />
          </div>
        </section>

        {/* ── MARQUEE ──────────────────────────────────────────────── */}
        <MarqueeRibbon />

        {/* ── STATS ────────────────────────────────────────────────── */}
        <StatsRow discountPercent={discountPercent} discountActive={discountActive} />

        {/* ── PROPERTIES ───────────────────────────────────────────── */}
        <PropertyCards
          properties={properties}
          propertyCards={propertyCards}
          discountPercent={discountPercent}
          discountActive={discountActive}
        />

        {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
        <HowItWorks />

        {/* ── PHILOSOPHY ───────────────────────────────────────────── */}
        <PhilosophySection text={content.philosophyText} />

        {/* ── GALLERY MOSAIC ───────────────────────────────────────── */}
        <GalleryMosaic photos={mosaicPhotos} />

        {/* ── NEIGHBOURHOOD ────────────────────────────────────────── */}
        <NeighbourhoodSection />

        {/* ── REAL REVIEWS ─────────────────────────────────────────── */}
        <RealReviews />

        {/* ── INSTAGRAM STRIP ──────────────────────────────────────── */}
        <InstagramStrip photos={instagramPhotos} />

        {/* ── FINAL CTA ────────────────────────────────────────────── */}
        <FinalCTA />

      </main>

      <Footer />
    </div>
  );
}
