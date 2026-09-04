"use client";

import { useEffect, useRef, useState } from "react";
import type React from "react";
import Link from "next/link";
import { ArrowRight, Instagram, MapPin, ExternalLink } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ScrollProgressBar } from "@/components/3d-effects";
import { heroImageUrl, cardImageUrl, thumbnailUrl } from "@/lib/cloudinary";
import {
  SplitText,
  SplitChars,
  ImgReveal,
  ParallaxImg,
  LineReveal,
  GridReveal,
  LineDraw,
  SectionProgressLine,
} from "@/components/mova-animations";

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

const SLIDE_ANIMATIONS = [
  "kenBurnsIn", "kenBurnsOut", "panLeft", "panRight", "panUp",
];

/* ─────────────────────────────────────────────────────────────────
   Legacy reveal hook
───────────────────────────────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("active"); io.unobserve(e.target); }
      }),
      { threshold: 0.08, rootMargin: "0px 0px -48px 0px" }
    );
    document.querySelectorAll(".reveal, .reveal-up, .clip-reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ─────────────────────────────────────────────────────────────────
   Festival Ambience
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
        @keyframes festivalFall{0%{transform:translateY(-20px) rotate(0deg);opacity:.7}100%{transform:translateY(110vh) rotate(360deg);opacity:0}}
        @keyframes holiFloat{0%{transform:translate(0,0) scale(1) rotate(0deg)}50%{transform:translate(30px,-40px) scale(1.1) rotate(180deg)}100%{transform:translate(0,20px) scale(.95) rotate(360deg)}}
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
    "holi": { background: "linear-gradient(90deg,#FF69B4,#FFD700,#2ECC71,#9B59B6)", color: "#fff" },
    "diwali": { background: "linear-gradient(90deg,#FF8C00,#FFD700,#FF8C00)", color: "#1a1a1a" },
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
          style={{ background: "rgba(0,0,0,0.15)", color: "inherit", border: "1px solid rgba(0,0,0,0.2)" }}>
          Book Now →
        </a>
      </span>
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
    }, 6500);
    return () => clearInterval(timer);
  }, [current, slides.length]);

  if (slides.length === 0) return <div className="absolute inset-0 bg-gradient-to-br from-[#0a1a12] via-[#0d2018] to-[#060e09]" />;

  return (
    <div className="absolute inset-0">
      {prev !== null && (
        <div key={`prev-${prev}`} className="absolute inset-0" style={{ animation: "fadeOut 1.4s ease-in-out forwards", zIndex: 1 }}>
          <img src={heroImageUrl(slides[prev].url)} alt={slides[prev].alt} className="w-full h-full object-cover" loading="lazy" />
        </div>
      )}
      <div key={`slide-${current}-${animKey}`} className="absolute inset-0" style={{ animation: "fadeIn 1.4s ease-in-out forwards", zIndex: 2 }}>
        <img src={heroImageUrl(slides[current].url)} alt={slides[current].alt} className="w-full h-full object-cover"
          style={{ animation: `${SLIDE_ANIMATIONS[current % SLIDE_ANIMATIONS.length]} 9s ease-in-out forwards` }}
          loading={current === 0 ? "eager" : "lazy"} fetchPriority={current === 0 ? "high" : "low"} decoding={current === 0 ? "sync" : "async"} />
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
   HERO SECTION — MOVA per-char cinematic entrance
───────────────────────────────────────────────────────────────── */
function HeroSection({ slides, content }: {
  slides: { url: string; alt: string }[];
  content: SiteData["content"];
}) {
  // each word of the headline enters character by character
  const lines = [
    { text: "The", delay: 0.3, color: "text-white" },
    { text: "Mehmaan", delay: 0.5, color: "text-[#c9a84c] italic" },
    { text: "Experience", delay: 0.85, color: "text-white" },
  ];

  return (
    <section className="relative w-full overflow-hidden" style={{ height: "100svh" }}>
      <HeroSlideshow slides={slides} />

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/25 to-black/15 z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/55 to-transparent z-10" />
      <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-black/45 to-transparent z-10" />

      <div className="absolute inset-0 z-20 flex flex-col justify-end px-5 md:px-14 lg:px-24 pb-20 md:pb-28">

        {/* Location tag */}
        <div className="flex items-center gap-3 mb-5 hero-line-enter" style={{ animationDelay: "0.15s" }}>
          <div className="w-6 h-px bg-[#c9a84c]/50" />
          <span className="label-badge text-[#c9a84c] text-[10px]">Gurugram · India</span>
        </div>

        {/* Giant headline — per-character stagger */}
        <h1
          className="font-display leading-[0.88] tracking-[-0.02em] mb-6"
          style={{ fontSize: "clamp(3.4rem,11vw,8.5rem)" }}
          aria-label="The Mehmaan Experience"
        >
          {lines.map(({ text, delay, color }) => (
            <span key={text} className={`block ${color}`}>
              {text.split("").map((ch, i) => (
                <span
                  key={i}
                  className="inline-block hero-line-enter"
                  style={{ animationDelay: `${delay + i * 0.052}s` }}
                >
                  {ch}
                </span>
              ))}
            </span>
          ))}
        </h1>

        {/* Subtitle */}
        <p
          className="text-white/65 text-sm md:text-lg font-light leading-relaxed mb-8 max-w-xs md:max-w-md hero-line-enter"
          style={{ animationDelay: "1.35s" }}
        >
          {content.heroSubtitle}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 hero-line-enter" style={{ animationDelay: "1.55s" }}>
          <a
            href="https://wa.me/918828352311"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-[#c9a84c] text-black font-semibold text-sm tracking-wide hover:bg-[#d4b55c] transition-all duration-300 min-h-[50px] group"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
            Reserve Now <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </a>
          <Link
            href="/homes"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-white/25 text-white text-sm font-medium tracking-wide hover:bg-white/10 hover:border-white/50 transition-all duration-300 min-h-[50px]"
          >
            Explore Homes <ArrowRight size={13} />
          </Link>
        </div>

        {/* Trust badges */}
        <div className="flex gap-5 mt-5 hero-line-enter" style={{ animationDelay: "1.8s" }}>
          <span className="text-white/30 text-[10px] font-mono">✓ Direct booking</span>
          <span className="text-white/30 text-[10px] font-mono">✓ No booking fees</span>
          <span className="text-white/30 text-[10px] font-mono">✓ 4.9★ rated</span>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5"
        style={{ opacity: 0, animation: "fadeIn 1s 2.2s forwards" }}
      >
        <span className="font-mono text-white/25 text-[9px] tracking-[0.3em]">SCROLL</span>
        <div className="w-px h-8 bg-gradient-to-b from-[#c9a84c]/60 to-transparent scroll-indicator" />
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Social Proof Ticker — rotating recent activity
───────────────────────────────────────────────────────────────── */
const SOCIAL_PROOF_ITEMS = [
  { icon: "🏠", text: "Someone from Delhi just viewed Sushant Lok", time: "2 min ago" },
  { icon: "📅", text: "Weekend dates filling fast — only a few open slots left", time: "" },
  { icon: "⭐", text: "\"Felt like home the moment we walked in\" — Priya M.", time: "last week" },
  { icon: "✅", text: "Booking confirmed for this weekend", time: "4 hours ago" },
  { icon: "💬", text: "Host responded in under 3 minutes", time: "today" },
  { icon: "🎉", text: "2 groups stayed last weekend — both rated 5 stars", time: "" },
];

function SocialProofTicker() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % SOCIAL_PROOF_ITEMS.length);
        setVisible(true);
      }, 350);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const item = SOCIAL_PROOF_ITEMS[idx];

  return (
    <div
      className="relative z-10 py-2.5 px-4"
      style={{ background: "var(--bg-elevated)", borderBottom: "1px solid var(--border-gold)" }}
    >
      <div className="container mx-auto max-w-5xl">
        <div
          className="flex items-center justify-center gap-3 text-xs font-mono transition-all duration-300"
          style={{
            color: "var(--text-secondary)",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(-6px)",
          }}
        >
          <span className="text-sm">{item.icon}</span>
          <span style={{ color: "var(--text-secondary)" }}>{item.text}</span>
          {item.time && (
            <span
              className="px-2 py-0.5 rounded-full font-mono text-[10px] tracking-wider"
              style={{ background: "var(--gold-faint)", color: "var(--gold)" }}
            >
              {item.time}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Urgency Banner — above property cards
───────────────────────────────────────────────────────────────── */
function UrgencyBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      className="relative z-10"
      style={{ background: "rgba(201,168,76,0.08)", borderBottom: "1px solid rgba(201,168,76,0.2)" }}
    >
      <div className="container mx-auto max-w-7xl px-4 md:px-8 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-base">🔥</span>
          <p className="text-xs font-mono" style={{ color: "var(--text-secondary)" }}>
            <span style={{ color: "var(--gold)", fontWeight: 600 }}>Only 2 properties available</span>
            {" "}— weekend dates book 3–5 days in advance on average.
          </p>
          <a
            href="https://wa.me/918828352311?text=Hi%21+I%27d+like+to+check+availability+for+a+stay."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-mono tracking-wider uppercase transition-all duration-200"
            style={{ background: "var(--gold)", color: "#000" }}
          >
            Check Dates →
          </a>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="flex-shrink-0 text-xs font-mono opacity-40 hover:opacity-70 transition-opacity"
          style={{ color: "var(--text-secondary)" }}
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Scarcity Strip — before final CTA
───────────────────────────────────────────────────────────────── */
function ScarcityStrip() {
  return (
    <section
      className="py-10 md:py-14 relative overflow-hidden"
      style={{ background: "var(--bg-elevated)", borderTop: "1px solid var(--border-default)" }}
    >
      <div className="container mx-auto max-w-5xl px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left: trust signals */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center md:justify-start">
            {[
              { icon: "⭐⭐⭐⭐⭐", label: "4.9 on Google", sub: "from real guests" },
              { icon: "⚡", label: "Responds in 5 min", sub: "avg WhatsApp reply time" },
              { icon: "🏠", label: "2 homes only", sub: "limited availability" },
              { icon: "💸", label: "No OTA markup", sub: "save vs Airbnb" },
            ].map(({ icon, label, sub }) => (
              <div key={label} className="text-center px-4">
                <p className="text-base leading-none mb-1">{icon}</p>
                <p className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>{label}</p>
                <p className="text-[10px] font-mono mt-0.5" style={{ color: "var(--text-tertiary)" }}>{sub}</p>
              </div>
            ))}
          </div>
          {/* Right: CTA */}
          <a
            href="https://wa.me/918828352311?text=Hi%21+I%27d+like+to+book+a+stay+at+The+Mehmaan+Manor."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 font-semibold text-sm tracking-wide transition-all duration-300 flex-shrink-0 group"
            style={{ background: "var(--gold)", color: "#000" }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Message Us Now
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Exit Intent Nudge — fires once when cursor leaves top of page
───────────────────────────────────────────────────────────────── */
function ExitIntentNudge() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const firedRef = useRef(false);

  useEffect(() => {
    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 10 && !firedRef.current && !dismissed) {
        firedRef.current = true;
        setTimeout(() => setShow(true), 200);
      }
    };
    document.addEventListener("mouseleave", onMouseLeave);
    return () => document.removeEventListener("mouseleave", onMouseLeave);
  }, [dismissed]);

  const handleDismiss = () => { setShow(false); setDismissed(true); };

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}
      onClick={handleDismiss}
    >
      <div
        className="relative max-w-md w-full p-8 text-center"
        style={{ background: "var(--bg-raised)", border: "1px solid var(--border-gold)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 font-mono text-xs opacity-40 hover:opacity-70"
          style={{ color: "var(--text-secondary)" }}
        >✕</button>

        <p className="text-3xl mb-4">🏠</p>
        <h3
          className="font-display text-2xl md:text-3xl italic mb-3 leading-tight"
          style={{ color: "var(--text-primary)" }}
        >
          Before you go…
        </h3>
        <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>
          Weekend dates fill up fast. Drop us a message — no commitment, just a quick chat about availability.
        </p>

        <a
          href="https://wa.me/918828352311?text=Hi%21+I+was+browsing+The+Mehmaan+Manor+and+wanted+to+check+availability."
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleDismiss}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 font-semibold text-sm mb-3"
          style={{ background: "var(--gold)", color: "#000" }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          Check Availability on WhatsApp
        </a>
        <button
          onClick={handleDismiss}
          className="w-full text-xs font-mono py-2 transition-opacity opacity-40 hover:opacity-60"
          style={{ color: "var(--text-secondary)" }}
        >
          No thanks, I&rsquo;ll decide later
        </button>

        <p className="text-[10px] font-mono mt-4 tracking-wider" style={{ color: "var(--text-faint)" }}>
          SIMRAN · +91 88283 52311 · RESPONDS IN &lt;5 MIN
        </p>
      </div>
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
    <div className="relative overflow-hidden py-3 z-10" style={{ background: "var(--gold)" }} aria-hidden="true">
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-4 px-6 font-mono text-[11px] tracking-[0.25em] uppercase whitespace-nowrap" style={{ color: "rgba(0,0,0,0.75)" }}>
            {item}<span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: "rgba(0,0,0,0.3)" }} />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Stats Row — kinetic character stagger
───────────────────────────────────────────────────────────────── */
function StatsRow({ discountPercent, discountActive }: { discountPercent: number; discountActive: boolean }) {
  const stats = [
    { value: "2", label: "Curated Homes" },
    { value: "4.9★", label: "Average Rating" },
    { value: "24/7", label: "Host Availability" },
    ...(discountActive && discountPercent > 0
      ? [{ value: `${discountPercent}%`, label: "Current Offer" }]
      : [{ value: "Free", label: "No Platform Fees" }]),
  ];
  return (
    <section className="theme-transition" style={{ background: "var(--bg-surface)", borderBottom: "1px solid var(--border-gold)" }}>
      <div className="container mx-auto max-w-5xl px-4">
        <GridReveal className="grid grid-cols-2 md:grid-cols-4" stagger={80}>
          {stats.map(({ value, label }) => (
            <div key={label} className="py-6 md:py-7 px-4 text-center" style={{ borderRight: "1px solid var(--border-gold)" }}>
              <SplitChars
                text={value}
                as="p"
                className="font-display text-2xl md:text-3xl italic"
                style={{ color: "var(--gold)" }}
                stagger={60}
              />
              <p className="text-[10px] font-mono uppercase tracking-widest mt-1" style={{ color: "var(--text-tertiary)" }}>{label}</p>
            </div>
          ))}
        </GridReveal>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Property Cards — image wipe + split headline + scrim text
───────────────────────────────────────────────────────────────── */
function PropertyCards({ properties, propertyCards, discountPercent, discountActive }: {
  properties: SiteData["properties"]; propertyCards: SiteData["propertyCards"];
  discountPercent: number; discountActive: boolean;
}) {
  return (
    <section className="theme-transition py-16 md:py-24 relative overflow-hidden" style={{ background: "var(--bg-surface)" }}>
      <SectionProgressLine />

      <div className="container mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 md:mb-16 gap-6">
          <div>
            <LineReveal>
              <p className="label-badge mb-3" style={{ color: "var(--text-tertiary)" }}>Our Properties</p>
            </LineReveal>
            <SplitText
              text="Two Homes."
              as="h2"
              className="font-display leading-[1.05] block"
              style={{ fontSize: "clamp(2.2rem,5vw,4rem)", color: "var(--text-primary)" }}
              delay={80}
            />
            <SplitText
              text="One Promise."
              as="span"
              className="font-display italic leading-[1.05] block"
              style={{ fontSize: "clamp(2.2rem,5vw,4rem)", color: "var(--gold)" }}
              delay={220}
            />
          </div>
          <LineReveal delay={300}>
            <Link href="/homes"
              className="inline-flex items-center gap-2.5 font-mono text-xs tracking-widest uppercase transition-all duration-300 group self-start md:self-auto pb-1 underline-wipe"
              style={{ color: "var(--text-tertiary)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--gold)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-tertiary)")}>
              View All Homes <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </LineReveal>
        </div>

        <div className={`grid grid-cols-1 ${properties.length >= 2 ? "lg:grid-cols-2" : ""} gap-4 md:gap-5`}>
          {properties.map((p, i) => {
            const photos = propertyCards[p.id] || [];
            const mainPhoto = photos[0];
            const extraPhotos = photos.slice(1, 4);
            return (
              <Link key={p.id} href={`/homes/${p.slug}`} className="prop-card group relative block">
                {/* Main image container — ImgReveal handles fade-in, no clip-path */}
                <ImgReveal delay={i * 160} className="img-sweep-wrap" style={{ height: "clamp(340px,52vw,620px)" }}>
                  {mainPhoto ? (
                    <img
                      src={cardImageUrl(mainPhoto.url)}
                      alt={p.name}
                      className="w-full h-full object-cover"
                      style={{ display: "block", width: "100%", height: "100%" }}
                    />
                  ) : (
                    <div className="w-full h-full" style={{ background: "linear-gradient(135deg,#1a3328,#0a1a12)" }} />
                  )}
                  {/* Gradient overlays — absolutely positioned over the image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/5 pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent pointer-events-none" />

                  <div className="absolute top-5 left-5 z-10">
                    <span className="label-badge bg-black/50 backdrop-blur-sm px-3 py-1.5 block" style={{ color: "var(--gold)" }}>
                      Home {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 z-10 p-6 md:p-8">
                    <div className="prop-card-line mb-3" />
                    <h3 className="font-display text-white leading-tight mb-2 transition-colors duration-500 group-hover:text-[#c9a84c]"
                      style={{ fontSize: "clamp(1.8rem,3.5vw,2.8rem)" }}>{p.name}</h3>
                    <p className="text-white/55 text-sm mb-5 leading-relaxed line-clamp-2 max-w-sm scrim-text">{p.vibe}</p>
                    <div className="flex items-end justify-between">
                      <div>
                        {discountActive && discountPercent > 0 ? (
                          <div className="flex flex-col gap-0.5">
                            <span className="font-mono text-white/35 text-xs line-through">₹{p.baseRate.toLocaleString("en-IN")}/night</span>
                            <span className="font-mono text-sm" style={{ color: "var(--gold)" }}>from ₹{Math.round(p.baseRate * (1 - discountPercent / 100)).toLocaleString("en-IN")}/night</span>
                            <span className="label-badge text-[9px]" style={{ color: "rgba(201,168,76,0.7)" }}>🎉 {discountPercent}% off active</span>
                          </div>
                        ) : (
                          <span className="font-mono text-sm" style={{ color: "var(--gold)" }}>from ₹{p.baseRate.toLocaleString("en-IN")}/night</span>
                        )}
                      </div>
                      <span className="inline-flex items-center gap-2 text-xs font-mono tracking-wider text-white/50 group-hover:text-[#c9a84c] group-hover:gap-3 transition-all duration-300">
                        Explore <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </ImgReveal>

                {extraPhotos.length > 0 && (
                  <div className="grid grid-cols-3 gap-1 mt-1">
                    {extraPhotos.map((ph, j) => (
                      <ImgReveal key={j} delay={i * 160 + 300 + j * 70} style={{ height: "72px" }}>
                        <img
                          src={thumbnailUrl(ph.url, 300)}
                          alt={ph.alt || p.name}
                          className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
                          style={{ display: "block", width: "100%", height: "100%" }}
                        />
                      </ImgReveal>
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
   How It Works
───────────────────────────────────────────────────────────────── */
function HowItWorks() {
  const steps = [
    { n: "01", title: "Browse & Choose", body: "Explore our two Gurugram homes at your pace — no pressure, no pushy sales. Find the one that fits your group and your vibe.", icon: "🏡" },
    { n: "02", title: "Message Your Hosts", body: "Reach Simran or Jyoti directly on WhatsApp. Real people, real answers — not a call centre script. Questions answered in minutes.", icon: "💬" },
    { n: "03", title: "Arrive & Unwind", body: "Check-in on your terms. No gatekeepers, no queues. Your home is ready — from a stocked kitchen to fresh linens.", icon: "✨" },
  ];

  return (
    <section className="theme-transition relative py-20 md:py-32 overflow-hidden grain-overlay" style={{ background: "var(--section-how)" }}>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="font-display whitespace-nowrap" style={{ fontSize: "clamp(8rem,20vw,18rem)", fontStyle: "italic", color: "var(--text-faint)" }}>
          Mehmaan
        </span>
      </div>

      <div className="container mx-auto max-w-7xl px-4 md:px-8 relative z-10">
        <div className="text-center mb-16 md:mb-20">
          <LineReveal>
            <p className="label-badge mb-3" style={{ color: "var(--section-how-label)" }}>The Process</p>
          </LineReveal>
          <SplitText
            text="Effortless from Start"
            as="h2"
            className="font-display leading-tight block"
            style={{ fontSize: "clamp(2rem,4.5vw,3.6rem)", color: "var(--section-how-text)" }}
            delay={80}
          />
          <SplitText
            text="to Stay"
            as="span"
            className="font-display italic block"
            style={{ fontSize: "clamp(2rem,4.5vw,3.6rem)", color: "var(--gold)" }}
            delay={280}
          />
          <LineDraw className="mx-auto mt-5" style={{ maxWidth: "48px" }} delay={450} />
        </div>

        <GridReveal className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-12" stagger={130}>
          {steps.map((step, i) => (
            <div key={step.n} className="step-card group relative">
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 h-px z-0"
                  style={{ left: "calc(100% - 24px)", width: "calc(100% + 1.5rem)", background: "linear-gradient(90deg,var(--gold-muted),transparent)" }} />
              )}
              <div className="relative z-10">
                <div className="step-number mb-2 leading-none select-none">{step.n}</div>
                <div className="text-2xl mb-4 block" aria-hidden="true">{step.icon}</div>
                <h3 className="font-display text-xl md:text-2xl mb-3 transition-colors duration-300 group-hover:text-[#c9a84c]"
                  style={{ color: "var(--section-how-text)" }}>{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--section-how-sub)" }}>{step.body}</p>
                <div className="warm-divider mt-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          ))}
        </GridReveal>

        <LineReveal delay={400}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-14 md:mt-16">
            <a href="https://wa.me/918828352311" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 font-medium text-sm tracking-wide transition-colors duration-300"
              style={{ background: "var(--section-how-btn-bg)", color: "var(--section-how-btn-text)" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
              Start on WhatsApp
            </a>
            <Link href="/homes"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border font-medium text-sm tracking-wide transition-colors duration-300"
              style={{ borderColor: "var(--section-how-btn-border)", color: "var(--section-how-text)" }}>
              Explore Both Homes <ArrowRight size={14} />
            </Link>
          </div>
        </LineReveal>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Philosophy — parallax image + split text
───────────────────────────────────────────────────────────────── */
function PhilosophySection({ text }: { text: string }) {
  return (
    <section className="theme-transition relative py-20 md:py-32 overflow-hidden" style={{ background: "var(--bg-raised)" }}>
      <div className="absolute inset-0 opacity-[0.025]" style={{
        backgroundImage: "linear-gradient(var(--gold) 1px,transparent 1px),linear-gradient(90deg,var(--gold) 1px,transparent 1px)",
        backgroundSize: "60px 60px"
      }} />
      <SectionProgressLine />

      <div className="container mx-auto max-w-7xl px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 lg:gap-24 items-center">

          <div>
            <LineReveal>
              <p className="label-badge mb-4" style={{ color: "var(--text-tertiary)" }}>Our Philosophy</p>
            </LineReveal>
            <SplitText
              text="Hospitality Isn't a"
              as="h2"
              className="font-display leading-[1.1] block"
              style={{ fontSize: "clamp(2rem,4vw,3.4rem)", color: "var(--text-primary)" }}
              delay={80}
            />
            <SplitText
              text="Service. It's a Feeling."
              as="span"
              className="font-display italic leading-[1.1] block mb-8"
              style={{ fontSize: "clamp(2rem,4vw,3.4rem)", color: "var(--gold)" }}
              delay={280}
            />
            <LineDraw className="mb-7" style={{ maxWidth: "48px" }} delay={450} />
            <LineReveal delay={500}>
              <p className="text-base md:text-lg leading-[1.85] max-w-lg font-light" style={{ color: "var(--text-secondary)" }}>{text}</p>
            </LineReveal>
            <LineReveal delay={620}>
              <div className="mt-10 flex items-center gap-5">
                <div className="flex flex-col gap-0.5">
                  <p className="font-display text-lg italic" style={{ color: "var(--text-primary)" }}>Simran &amp; Jyoti</p>
                  <p className="font-mono text-[10px] tracking-[0.25em] uppercase" style={{ color: "var(--text-tertiary)" }}>Your Hosts · Gurugram</p>
                </div>
                <div className="w-px h-10" style={{ background: "var(--border-gold)" }} />
                <a href="https://www.instagram.com/the_mehmaan_manor" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 font-mono text-xs tracking-widest transition-colors hover:text-[#c9a84c] underline-wipe"
                  style={{ color: "var(--text-tertiary)" }}>
                  <Instagram size={13} /> @the_mehmaan_manor
                </a>
              </div>
            </LineReveal>
          </div>

          {/* Parallax image column */}
          <LineReveal delay={200}>
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 pointer-events-none" style={{ border: "1px solid var(--border-gold)" }} />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 pointer-events-none" style={{ border: "1px solid var(--border-gold)" }} />

              <ParallaxImg speed={0.14} style={{ height: "clamp(320px,50vw,560px)" }}>
                <img src="/logo.png" alt="" className="w-full h-full object-contain p-8 select-none"
                  style={{ opacity: 0.06, filter: "grayscale(100%) brightness(3)" }} aria-hidden="true" />
              </ParallaxImg>

              {/* Quote card overlay */}
              <div className="absolute bottom-6 left-6 right-6 z-10">
                <div className="p-6 md:p-8 backdrop-blur-sm" style={{ border: "1px solid var(--border-gold)", background: "var(--card-bg)" }}>
                  <div className="text-3xl font-display mb-3 leading-none" style={{ color: "var(--gold)" }}>&ldquo;</div>
                  <p className="font-display text-lg md:text-xl italic leading-snug mb-4" style={{ color: "var(--text-primary)" }}>
                    Come as a guest,<br />leave as family.
                  </p>
                  <p className="font-mono text-[10px] tracking-[0.2em]" style={{ color: "var(--text-faint)" }}>— The Mehmaan Manor Promise</p>
                </div>
              </div>
            </div>
          </LineReveal>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Gallery Mosaic — staggered wipe-in grid
───────────────────────────────────────────────────────────────── */
function GalleryMosaic({ photos }: { photos: { url: string; alt: string }[] }) {
  if (photos.length === 0) return null;
  const [main, ...rest] = photos.slice(0, 7);

  return (
    <section className="theme-transition py-16 md:py-24 relative overflow-hidden" style={{ background: "var(--bg-surface)" }}>
      <SectionProgressLine />

      <div className="container mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 md:mb-12 gap-4">
          <div>
            <LineReveal>
              <p className="label-badge mb-3" style={{ color: "var(--text-tertiary)" }}>Our Gallery</p>
            </LineReveal>
            <SplitText
              text="Inside the Manor"
              as="h2"
              className="font-display block"
              style={{ fontSize: "clamp(1.8rem,4vw,3rem)", color: "var(--text-primary)" }}
              delay={80}
            />
          </div>
          <LineReveal delay={200}>
            <a href="https://www.instagram.com/the_mehmaan_manor" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase transition-colors self-start group hover:text-[#c9a84c] underline-wipe"
              style={{ color: "var(--text-tertiary)" }}>
              <Instagram size={13} className="group-hover:scale-110 transition-transform" /> Follow on Instagram
            </a>
          </LineReveal>
        </div>

        {/* Mosaic grid — each cell fades + scales in staggered */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
          {main && (
            <ImgReveal
              delay={0}
              className="col-span-2 row-span-2 md:row-span-2 gallery-cell img-sweep-wrap"
              style={{ height: "clamp(240px,40vw,500px)" }}
            >
              <img
                src={cardImageUrl(main.url)}
                alt={main.alt || "The Mehmaan Manor"}
                className="w-full h-full object-cover"
                style={{ display: "block", width: "100%", height: "100%" }}
                loading="lazy"
              />
              <div className="gallery-cell-overlay" />
            </ImgReveal>
          )}
          {rest.map((photo, i) => (
            <ImgReveal
              key={i}
              delay={120 + i * 90}
              className="gallery-cell img-sweep-wrap"
              style={{ height: "clamp(100px,18vw,240px)" }}
            >
              <img
                src={thumbnailUrl(photo.url, 600)}
                alt={photo.alt || "The Mehmaan Manor"}
                className="w-full h-full object-cover"
                style={{ display: "block", width: "100%", height: "100%" }}
                loading="lazy"
              />
              <div className="gallery-cell-overlay" />
            </ImgReveal>
          ))}
        </div>

        <LineReveal delay={300}>
          <div className="mt-6 text-center">
            <Link href="/gallery" className="inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase transition-colors border-b border-transparent hover:border-[#c9a84c]/30 pb-0.5 hover:text-[#c9a84c]"
              style={{ color: "var(--text-faint)" }}>
              View Full Gallery <ArrowRight size={11} />
            </Link>
          </div>
        </LineReveal>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Neighbourhood
───────────────────────────────────────────────────────────────── */
function NeighbourhoodSection() {
  const highlights = [
    { icon: "🚇", title: "Metro Access", sub: "IFFCO Chowk — 10 min walk" },
    { icon: "🛍️", title: "Shopping", sub: "Galleria & Town Square nearby" },
    { icon: "🏥", title: "Healthcare", sub: "Medanta Hospital — 15 min" },
    { icon: "🛣️", title: "Connectivity", sub: "NH-48 & Golf Course Rd close" },
  ];

  return (
    <section className="theme-transition relative py-20 md:py-28 overflow-hidden grain-overlay" style={{ background: "var(--section-nb)" }}>
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg,transparent,var(--gold-muted),transparent)" }} />

      <div className="container mx-auto max-w-7xl px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div>
            <LineReveal>
              <p className="label-badge mb-3" style={{ color: "var(--section-nb-label)" }}>The Location</p>
            </LineReveal>
            <SplitText
              text="Central Gurugram,"
              as="h2"
              className="font-display leading-tight block"
              style={{ fontSize: "clamp(1.8rem,4vw,3.2rem)", color: "var(--section-nb-text)" }}
              delay={80}
            />
            <SplitText
              text="At Your Doorstep"
              as="span"
              className="font-display italic block mb-6"
              style={{ fontSize: "clamp(1.8rem,4vw,3.2rem)", color: "var(--gold)" }}
              delay={240}
            />
            <LineDraw className="mb-6" style={{ maxWidth: "48px" }} delay={400} />
            <LineReveal delay={450}>
              <p className="text-base leading-relaxed mb-8 max-w-md" style={{ color: "var(--section-nb-sub)" }}>
                Both homes sit in Gurugram&rsquo;s most connected corridors — minutes from the metro, top hospitals, and the city&rsquo;s best dining.
              </p>
            </LineReveal>
            <LineReveal delay={500}>
              <div className="flex items-center gap-2 font-mono text-xs tracking-wider" style={{ color: "var(--section-nb-sub)" }}>
                <MapPin size={12} style={{ color: "var(--gold)" }} /> Gurugram, Haryana — India
              </div>
            </LineReveal>
          </div>

          <GridReveal className="grid grid-cols-2 gap-4" stagger={90} delay={100}>
            {highlights.map(({ icon, title, sub }) => (
              <div key={title}
                className="group transition-all duration-300 p-5 md:p-6"
                style={{ border: "1px solid var(--section-nb-card-border)", background: "var(--section-nb-card)" }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "var(--gold-muted)";
                  (e.currentTarget as HTMLDivElement).style.background = "var(--section-nb-card-hover)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "var(--section-nb-card-border)";
                  (e.currentTarget as HTMLDivElement).style.background = "var(--section-nb-card)";
                }}>
                <span className="text-2xl mb-3 block">{icon}</span>
                <h3 className="font-display text-base md:text-lg mb-1 transition-colors" style={{ color: "var(--section-nb-text)" }}>{title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "var(--section-nb-sub)" }}>{sub}</p>
              </div>
            ))}
          </GridReveal>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Review Nudge
───────────────────────────────────────────────────────────────── */
function ReviewNudge() {
  return (
    <section className="theme-transition py-16 md:py-20" style={{ background: "var(--bg-elevated)", borderTop: "1px solid var(--border-default)" }}>
      <div className="container mx-auto max-w-3xl px-4 md:px-8 text-center">
        <LineReveal>
          <p className="label-badge mb-4" style={{ color: "var(--text-tertiary)" }}>Guest Reviews</p>
        </LineReveal>
        <SplitText
          text="Stayed with Us?"
          as="h2"
          className="font-display leading-tight mb-4 block"
          style={{ fontSize: "clamp(1.6rem,3.5vw,2.6rem)", color: "var(--text-primary)" }}
          delay={80}
        />
        <LineReveal delay={200}>
          <p className="text-base leading-relaxed mb-8 max-w-md mx-auto" style={{ color: "var(--text-secondary)" }}>
            We let real experiences speak for themselves. If you&rsquo;ve stayed at The Mehmaan Manor, we&rsquo;d love to hear from you — directly on Google.
          </p>
        </LineReveal>
        <LineReveal delay={320}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://g.page/r/the-mehmaan-manor/review" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 font-medium text-sm tracking-wide transition-all duration-300 group"
              style={{ background: "var(--gold)", color: "#000" }}>
              Leave a Google Review
              <ExternalLink size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </a>
            <a href="https://www.instagram.com/the_mehmaan_manor" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 font-medium text-sm tracking-wide transition-all duration-300"
              style={{ border: "1px solid var(--border-default)", color: "var(--text-secondary)" }}>
              <Instagram size={14} /> Tag Us on Instagram
            </a>
          </div>
        </LineReveal>
        <LineReveal delay={420}>
          <p className="font-mono text-[10px] tracking-[0.2em] mt-6" style={{ color: "var(--text-faint)" }}>
            4.9 · Rated on Google Maps by real guests
          </p>
        </LineReveal>
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
    <section className="theme-transition py-16 md:py-20" style={{ background: "var(--bg-surface)", borderTop: "1px solid var(--border-default)" }}>
      <div className="container mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-3">
          <div>
            <LineReveal>
              <p className="label-badge mb-1" style={{ color: "var(--text-tertiary)" }}>Follow the Story</p>
            </LineReveal>
            <SplitText
              text="@the_mehmaan_manor"
              as="h2"
              className="font-display text-xl md:text-2xl block"
              style={{ color: "var(--text-primary)" }}
              delay={80}
            />
          </div>
          <LineReveal delay={200}>
            <a href="https://www.instagram.com/the_mehmaan_manor" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-mono text-xs tracking-widest transition-colors self-start group hover:text-[#c9a84c] underline-wipe"
              style={{ color: "var(--text-tertiary)" }}>
              <Instagram size={13} className="group-hover:scale-110 transition-transform" /> Open Instagram
            </a>
          </LineReveal>
        </div>

        <GridReveal className="flex gap-6 md:grid md:grid-cols-6 overflow-x-auto pb-3 md:overflow-visible" stagger={70} delay={100}>
          {photos.slice(0, 6).map((photo, i) => (
            <a key={photo.url + i} href="https://www.instagram.com/the_mehmaan_manor" target="_blank" rel="noopener noreferrer"
              className="flex-shrink-0 flex flex-col items-center gap-3 group" style={{ minWidth: "110px" }}>
              <div className="p-[3px] rounded-full bg-gradient-to-tr from-[#c9a84c]/40 via-[#c9a84c] to-[#e8d08a] transition-all duration-300 group-hover:shadow-[0_0_18px_rgba(201,168,76,0.45)]">
                <div className="p-[3px] rounded-full" style={{ background: "var(--bg-surface)" }}>
                  <div className="w-24 h-24 md:w-full md:aspect-square rounded-full overflow-hidden">
                    <img src={thumbnailUrl(photo.url, 400)} alt={photo.alt || "The Mehmaan Manor"}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  </div>
                </div>
              </div>
              <p className="font-mono text-[10px] tracking-widest uppercase transition-colors duration-300 text-center truncate w-full px-1 group-hover:text-[#c9a84c]"
                style={{ color: "var(--text-tertiary)" }}>
                {photo.alt || "View"}
              </p>
            </a>
          ))}
        </GridReveal>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Final CTA
───────────────────────────────────────────────────────────────── */
function FinalCTA() {
  return (
    <section className="relative pt-20 md:pt-28 pb-16 md:pb-20 px-4 md:px-8 angled-top overflow-hidden grain-overlay" style={{ background: "var(--gold)" }}>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="font-display whitespace-nowrap" style={{ fontSize: "clamp(6rem,16vw,14rem)", fontStyle: "italic", color: "rgba(0,0,0,0.05)" }}>
          Reserve
        </span>
      </div>

      <div className="container mx-auto max-w-5xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 lg:gap-16 items-center">
          <div>
            <LineReveal>
              <p className="label-badge mb-4" style={{ color: "rgba(0,0,0,0.45)" }}>Ready to Stay?</p>
            </LineReveal>
            <SplitText
              text="Reserve Your"
              as="h2"
              className="font-display leading-[1.0] block"
              style={{ fontSize: "clamp(2.4rem,5vw,4.2rem)", color: "rgba(0,0,0,0.88)" }}
              delay={80}
            />
            <SplitText
              text="Mehmaan Experience"
              as="span"
              className="font-display italic leading-[1.0] block"
              style={{ fontSize: "clamp(2.4rem,5vw,4.2rem)", color: "rgba(0,0,0,0.88)" }}
              delay={280}
            />
            <LineDraw
              className="mt-6 mb-6"
              style={{ maxWidth: "48px", background: "linear-gradient(90deg,rgba(0,0,0,0.3),rgba(0,0,0,0.05))" }}
              delay={450}
            />
            <LineReveal delay={520}>
              <p className="text-base leading-relaxed max-w-md" style={{ color: "rgba(0,0,0,0.55)" }}>
                Speak directly with Simran or Jyoti — real hosts, not bots. Get answers, pick your dates, and make it yours.
              </p>
            </LineReveal>
          </div>

          <LineReveal delay={200}>
            <div className="flex flex-col gap-4">
              <a href="https://wa.me/918828352311" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 font-medium text-sm tracking-wide transition-all duration-300 group min-w-[220px] hover:opacity-90"
                style={{ background: "#1a2420", color: "#f5f0e8" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                WhatsApp Now
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <Link href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 font-medium text-sm tracking-wide transition-colors duration-300 hover:bg-black/10"
                style={{ borderColor: "rgba(0,0,0,0.22)", color: "rgba(0,0,0,0.75)" }}>
                Enquiry Form
              </Link>
              <p className="font-mono text-[10px] tracking-[0.2em] text-center" style={{ color: "rgba(0,0,0,0.35)" }}>Simran · +91 88283 52311</p>
            </div>
          </LineReveal>
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

  const { properties, heroPhotos, instagramPhotos, galleryPhotos, propertyCards, content, discountPercent, activeFestival, discountActive } = siteData;

  const heroSlides = heroPhotos.length > 0 ? heroPhotos : [];
  const finalSlides = heroSlides.length > 0
    ? heroSlides
    : content.heroMediaUrl
      ? [{ url: content.heroMediaUrl, alt: "The Mehmaan Manor" }]
      : [];
  const mosaicPhotos = [...galleryPhotos, ...instagramPhotos]
    .filter((p, i, arr) => arr.findIndex(x => x.url === p.url) === i)
    .slice(0, 7);

  return (
    <div className="min-h-screen theme-transition" style={{ background: "var(--bg-page)" }}>
      <FestivalAmbience festival={activeFestival} active={discountActive} />
      <ScrollProgressBar />
      <Navigation />
      <DiscountBanner discountPercent={discountPercent} activeFestival={activeFestival} discountActive={discountActive} />

      <main id="main-content">
        <HeroSection slides={finalSlides} content={content} />
        {/* Social proof activity ticker — right after hero, before ribbon */}
        <SocialProofTicker />
        <MarqueeRibbon />
        <StatsRow discountPercent={discountPercent} discountActive={discountActive} />
        {/* Urgency banner — scarcity nudge above property cards */}
        <UrgencyBanner />
        <PropertyCards properties={properties} propertyCards={propertyCards} discountPercent={discountPercent} discountActive={discountActive} />
        <HowItWorks />
        <PhilosophySection text={content.philosophyText} />
        <GalleryMosaic photos={mosaicPhotos} />
        <NeighbourhoodSection />
        <ReviewNudge />
        <InstagramStrip photos={instagramPhotos} />
        {/* Scarcity trust strip — between instagram and final CTA */}
        <ScarcityStrip />
        <FinalCTA />
      </main>

      {/* Exit intent — fires once when user tries to leave */}
      <ExitIntentNudge />

      <Footer />
    </div>
  );
}
