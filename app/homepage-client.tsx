"use client";

import { useEffect, useRef, useState } from "react";
import type React from "react";
import Link from "next/link";
import { ArrowRight, Instagram, ChevronDown } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ScrollProgressBar } from "@/components/3d-effects";

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
}

// Different cinematic animations for each slide
const SLIDE_ANIMATIONS = [
  "kenBurnsIn",      // slow zoom in
  "kenBurnsOut",     // slow zoom out
  "panLeft",         // pan left to right
  "panRight",        // pan right to left
  "panUp",           // pan bottom to top
];

function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("active"); io.unobserve(e.target); }
      }),
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

// JS Parallax — works on ALL browsers including mobile
function useParallax(ref: React.RefObject<HTMLDivElement>, speed = 0.4) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * speed;
      const bg = el.querySelector(".parallax-bg") as HTMLElement | null;
      if (bg) bg.style.transform = `translateY(${offset}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [ref, speed]);
}

function ParallaxBg({ url, speed = 0.35 }: { url: string; speed?: number }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current || !bgRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * speed;
      bgRef.current.style.transform = `translateY(${offset}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [speed]);

  return (
    <div ref={sectionRef} className="absolute inset-0 overflow-hidden -z-10">
      <div
        ref={bgRef}
        className="absolute inset-[-30%] will-change-transform"
        style={{
          backgroundImage: `url(${url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    </div>
  );
}

// ── Area Section with true reverse parallax ──────────────────────────
function AreaSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section ref={sectionRef} className="relative py-10 md:py-16 border-t border-white/5 bg-[#080e0b]">
      {/* Content */}
      <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10">
        <p className="font-mono text-[#c9a84c]/50 text-[10px] tracking-[0.4em] uppercase mb-2 text-center reveal">The Area</p>
        <h2 className="font-display text-white text-center mb-6 md:mb-10 reveal" style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)" }}>
          Central Gurugram, At Your Doorstep
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {[
            { icon: "🚇", title: "Metro Access", sub: "IFFCO Chowk — 10 min" },
            { icon: "🛍️", title: "Markets", sub: "Galleria & Town Square nearby" },
            { icon: "🏥", title: "Healthcare", sub: "Medanta Hospital — 15 min" },
            { icon: "🛣️", title: "Highways", sub: "NH-48 & Golf Course Rd close" },
          ].map(({ icon, title, sub }, i) => (
            <div key={title} className="reveal border border-white/10 p-4 md:p-5 hover:border-[#c9a84c]/40 bg-black/30 backdrop-blur-sm transition-colors duration-300 group"
              style={{ animationDelay: `${i * 80}ms` }}>
              <span className="text-2xl mb-3 block">{icon}</span>
              <h3 className="font-display text-white text-base md:text-lg mb-1 group-hover:text-[#c9a84c] transition-colors">{title}</h3>
              <p className="text-white/40 text-xs leading-relaxed">{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Pull Quote with Logo Parallax ────────────────────────────────────
function PullQuoteSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current || !imgRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const centerOffset = rect.top + rect.height / 2 - window.innerHeight / 2;
      // 1:1 reverse — logo stays fixed in place as page scrolls
      const translate = centerOffset * -1;
      imgRef.current.style.transform = `translate(-50%, calc(-50% + ${translate}px))`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section ref={sectionRef} className="relative py-16 md:py-28 px-5 md:px-6 border-t border-white/5 overflow-hidden bg-[#0d1a12]">
      {/* Logo — faint, centered, parallax fixed-in-bg feel */}
      <img
        ref={imgRef}
        src="/logo.png"
        alt=""
        aria-hidden="true"
        className="absolute pointer-events-none select-none will-change-transform"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "clamp(280px, 45vw, 520px)",
          opacity: 0.06,
          filter: "grayscale(100%) brightness(2)",
        }}
      />
      {/* Content */}
      <div className="container mx-auto max-w-3xl text-center reveal relative z-10">
        <div className="w-12 h-px bg-[#c9a84c]/40 mx-auto mb-8" />
        <h2 className="font-display text-white leading-[1.15] mb-6" style={{ fontSize: "clamp(1.8rem, 5vw, 4rem)" }}>
          &ldquo;Come as a guest,<br />
          <span className="text-[#c9a84c] italic">leave as family.&rdquo;</span>
        </h2>
        <p className="font-mono text-white/25 text-xs tracking-[0.2em]">— The Mehmaan Manor Promise</p>
      </div>
    </section>
  );
}

// ── Cinematic Slideshow ───────────────────────────────────────────────
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
    }, 6000);
    return () => clearInterval(timer);
  }, [current, slides.length]);

  if (slides.length === 0) {
    return <div className="absolute inset-0 bg-gradient-to-br from-[#0a1a12] via-[#0d2018] to-[#060e09]" />;
  }

  return (
    <div className="absolute inset-0">
      {/* Previous slide — fades out */}
      {prev !== null && (
        <div
          key={`prev-${prev}`}
          className="absolute inset-0"
          style={{ animation: "fadeOut 1.2s ease-in-out forwards", zIndex: 1 }}
        >
          <img src={slides[prev].url} alt={slides[prev].alt} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Current slide — fades in with unique Ken Burns animation */}
      <div
        key={`slide-${current}-${animKey}`}
        className="absolute inset-0"
        style={{ animation: "fadeIn 1.2s ease-in-out forwards", zIndex: 2 }}
      >
        <img
          src={slides[current].url}
          alt={slides[current].alt}
          className="w-full h-full object-cover"
          style={{ animation: `${SLIDE_ANIMATIONS[current % SLIDE_ANIMATIONS.length]} 8s ease-in-out forwards` }}
        />
      </div>

      {/* Slide indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-16 right-6 z-30 flex gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => { setPrev(current); setCurrent(i); setAnimKey(k => k + 1); }}
              className={`h-0.5 transition-all duration-500 ${i === current ? "w-6 bg-[#c9a84c]" : "w-2 bg-white/30"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* --- Main Client Component ------------------------------------------- */
export function HomePageClient({ siteData }: { siteData: SiteData }) {
  useReveal();

  const { properties, heroPhotos, instagramPhotos, galleryPhotos, propertyCards, content } = siteData;
  const photos_fallback = galleryPhotos;

  // Build slideshow from all hero photos — use all available
  const heroSlides = heroPhotos.length > 0 ? heroPhotos : [];

  // adminUrl sirf tab use karo jab koi hero photo DB mein nahi hai
  const adminUrl = content.heroMediaUrl;
  const finalSlides = heroSlides.length > 0
    ? heroSlides
    : adminUrl
      ? [{ url: adminUrl, alt: "The Mehmaan Manor" }]
      : [];

  return (
    <div className="min-h-screen bg-[#0a0f0d]">
      <ScrollProgressBar />
      <Navigation />
      <main id="main-content">

        {/* ═══ HERO — Cinematic Slideshow ═══════════════════════════════ */}
        <section className="relative w-full overflow-hidden" style={{ height: "100svh" }}>

          {/* Slideshow */}
          <HeroSlideshow slides={finalSlides} />

          {/* Cinematic overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20 z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent z-10" />
          <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/50 to-transparent z-10" />

          {/* Content */}
          <div className="absolute inset-0 z-20 flex flex-col justify-end px-5 md:px-16 lg:px-24 pb-20 md:pb-28">

            <h1
              className="font-display text-white leading-[0.9] tracking-[-0.02em] mb-4 opacity-0 animate-[fadeSlideUp_0.8s_0.3s_forwards]"
              style={{ fontSize: "clamp(3.2rem, 11vw, 8rem)" }}
            >
              The<br />
              <span className="text-[#c9a84c] italic">Mehmaan</span><br />
              Experience
            </h1>

            {/* Location tag — below headline */}
            <div className="flex items-center gap-3 mb-5 opacity-0 animate-[fadeSlideUp_0.8s_0.5s_forwards]">
              <div className="w-6 h-px bg-[#c9a84c]/60" />
              <span className="font-mono text-[#c9a84c] text-[10px] md:text-xs tracking-[0.3em] uppercase">Gurugram · India</span>
            </div>

            <p className="text-white/70 text-sm md:text-lg font-light leading-relaxed mb-8 max-w-sm md:max-w-md opacity-0 animate-[fadeSlideUp_0.8s_0.6s_forwards]">
              Two homes in Gurugram. Book directly with your hosts — no middlemen, no hidden fees.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 opacity-0 animate-[fadeSlideUp_0.8s_0.8s_forwards]">
              <a href="https://wa.me/918828352311" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-[#c9a84c] text-black font-semibold text-sm tracking-wide hover:bg-[#d4b55c] transition-all duration-300 min-h-[50px]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Reserve Now
              </a>
              <Link href="/homes"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-white/30 text-white text-sm font-medium tracking-wide hover:bg-white/10 hover:border-white/60 transition-all duration-300 min-h-[50px]">
                Explore Homes <ArrowRight size={15} />
              </Link>
            </div>

            <div className="flex gap-5 mt-5 opacity-0 animate-[fadeSlideUp_0.8s_1s_forwards]">
              <span className="text-white/35 text-[10px] font-mono">✓ Direct booking</span>
              <span className="text-white/35 text-[10px] font-mono">✓ No booking fees</span>
              <span className="text-white/35 text-[10px] font-mono">✓ 4.9★ rated</span>
            </div>
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 opacity-0 animate-[fadeIn_1s_1.5s_forwards]">
            <ChevronDown size={18} className="text-white/30 animate-bounce" />
          </div>
        </section>

        {/* ═══ STATS BAR ═══════════════════════════════════════════════ */}
        <section className="bg-[#0d1a12] border-b border-[#c9a84c]/10">
          <div className="container mx-auto max-w-4xl px-4">
            <div className="grid grid-cols-3 divide-x divide-[#c9a84c]/10">
              {[{ value: "2", label: "Homes" }, { value: "4.9★", label: "Guest Rating" }, { value: "24/7", label: "Host Support" }].map(({ value, label }) => (
                <div key={label} className="py-5 text-center">
                  <p className="font-display text-[#c9a84c] text-xl md:text-2xl">{value}</p>
                  <p className="text-white/30 text-[9px] md:text-[10px] font-mono uppercase tracking-widest mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ PROPERTIES ══════════════════════════════════════════════ */}
        <section className="bg-[#080e0b]">
          <div className="container mx-auto max-w-7xl px-3 md:px-6 py-10 md:py-16">
            <div className="text-center mb-8 md:mb-12 reveal">
              <p className="font-mono text-[#c9a84c]/60 text-[10px] tracking-[0.4em] uppercase mb-3">Our Properties</p>
              <h2 className="font-display text-white" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}>Two Homes. One Promise.</h2>
            </div>
            <div className={`grid grid-cols-1 ${properties.length >= 2 ? "lg:grid-cols-2" : ""} gap-3 md:gap-4`}>
              {properties.map((p, i) => {
                const cardPhoto = propertyCards[p.id]?.[0];
                return (
                  <Link key={p.id} href={`/homes/${p.slug}`}
                    className="group relative block overflow-hidden reveal"
                    style={{ animationDelay: `${i * 100}ms` }}>
                    <div className="relative h-[420px] sm:h-[500px] lg:h-[580px]">
                      {cardPhoto ? (
                        <img src={cardPhoto.url} alt={p.name}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#1a3328] to-[#0a1a12]" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />
                      <div className="absolute inset-0 flex flex-col justify-between p-5 md:p-7">
                        <span className="font-mono text-[#c9a84c] text-[10px] tracking-[0.3em] bg-black/40 backdrop-blur-sm px-3 py-1.5 self-start">
                          HOME {String(i + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <h3 className="font-display text-white leading-tight mb-2 group-hover:text-[#c9a84c] transition-colors duration-400"
                            style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.6rem)" }}>{p.name}</h3>
                          <p className="text-white/60 text-xs md:text-sm mb-4 line-clamp-2 max-w-sm">{p.vibe}</p>
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[#c9a84c] text-sm font-medium">from ₹{p.baseRate.toLocaleString("en-IN")}/night</span>
                            <span className="flex items-center gap-1.5 text-white/60 text-xs group-hover:text-[#c9a84c] group-hover:gap-2.5 transition-all duration-300">Explore <ArrowRight size={13} /></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>


        {/* ═══ AREA / NEIGHBORHOOD ═════════════════════════════════════ */}
        <AreaSection />

        {/* ═══ PULL QUOTE ══════════════════════════════════════════════ */}
        <PullQuoteSection />

        {/* ═══ INSTAGRAM ═══════════════════════════════════════════════ */}
        <section className="bg-[#080e0b] py-10 md:py-16 px-4 md:px-6 border-t border-white/5">
          <div className="container mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 md:mb-8 gap-3 reveal">
              <div>
                <p className="font-mono text-[#c9a84c]/50 text-[10px] tracking-[0.4em] uppercase mb-1">Follow the story</p>
                <h2 className="font-display text-white text-xl md:text-2xl">@the_mehmaan_manor</h2>
              </div>
              <a href="https://www.instagram.com/the_mehmaan_manor" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white/40 hover:text-[#c9a84c] font-mono text-xs tracking-wider transition-colors self-start">
                <Instagram size={13} /> Open Instagram
              </a>
            </div>
            <div className="flex gap-3 md:grid md:grid-cols-6 overflow-x-auto pb-2 md:overflow-visible reveal">
              {(instagramPhotos.length > 0 ? instagramPhotos : photos_fallback).slice(0, 6).map((photo, i) => (
                <a key={photo.url + i} href="https://www.instagram.com/the_mehmaan_manor" target="_blank" rel="noopener noreferrer"
                  className="flex-shrink-0 flex flex-col items-center gap-2 group" style={{ minWidth: "80px" }}>
                  <div className="p-[2.5px] rounded-full bg-gradient-to-tr from-[#1a3328] via-[#c9a84c] to-[#1a3328]">
                    <div className="p-[2px] rounded-full bg-[#080e0b]">
                      <div className="w-14 h-14 md:w-full md:h-auto md:aspect-square rounded-full overflow-hidden">
                        <img src={photo.url} alt={photo.alt || "The Mehmaan Manor"}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      </div>
                    </div>
                  </div>
                  <p className="font-mono text-[8px] md:text-[9px] text-white/25 group-hover:text-[#c9a84c] transition-colors text-center truncate w-full px-1">
                    {["Bedroom", "Living", "Balcony", "Exterior", "Kitchen", "Bathroom"][i] ?? "View"}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ FINAL CTA ═══════════════════════════════════════════════ */}
        <section className="bg-[#c9a84c] py-14 md:py-20 px-5 md:px-6">
          <div className="container mx-auto max-w-4xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="reveal">
                <p className="font-mono text-black/40 text-[10px] tracking-[0.4em] uppercase mb-3">Ready?</p>
                <h2 className="font-display text-black leading-none" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}>
                  Reserve Your<br />Mehmaan Experience
                </h2>
              </div>
              <div className="reveal space-y-4" style={{ animationDelay: "100ms" }}>
                <p className="text-black/60 text-sm leading-relaxed">Speak directly with Simran or Jyoti — real hosts, real warmth. No booking bots.</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/contact"
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-black text-white font-medium text-sm hover:bg-black/80 transition-colors">
                    Book Your Stay <ArrowRight size={15} />
                  </Link>
                  <a href="https://wa.me/918828352311" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-7 py-3.5 border-2 border-black/20 text-black font-medium text-sm hover:bg-black/5 transition-colors">
                    WhatsApp Us
                  </a>
                </div>
                <p className="font-mono text-black/35 text-[10px] tracking-wider">Simran · +91 88283 52311</p>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}

