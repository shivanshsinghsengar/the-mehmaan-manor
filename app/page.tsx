"use client";

import { useEffect, useState } from "react";
import type React from "react";
import Link from "next/link";
import { ArrowRight, Instagram } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { TiltCard, ParallaxLayer, Reveal3D, DepthText, MouseParallax, ScrollProgressBar, Float } from "@/components/3d-effects";

/* ─── Dark interior room scene SVG for the hero ─────────────────────── */
function HeroScene() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 1440 900"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="wallG" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="oklch(0.18 0.04 155)" />
          <stop offset="100%" stopColor="oklch(0.24 0.05 155)" />
        </linearGradient>
        <linearGradient id="floorG" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="oklch(0.20 0.03 80)" />
          <stop offset="100%" stopColor="oklch(0.16 0.02 80)" />
        </linearGradient>
        <radialGradient id="winG" cx="73%" cy="37%" r="30%">
          <stop offset="0%" stopColor="oklch(0.75 0.12 85)" stopOpacity="0.22" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id="lampG" cx="56%" cy="45%" r="22%">
          <stop offset="0%" stopColor="oklch(0.75 0.12 85)" stopOpacity="0.18" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id="vigG" cx="50%" cy="50%" r="75%">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="100%" stopColor="oklch(0.10 0.02 155)" stopOpacity="0.85" />
        </radialGradient>
        <filter id="glow"><feGaussianBlur stdDeviation="4" /></filter>
      </defs>

      {/* Walls */}
      <rect width="1440" height="900" fill="url(#wallG)" />
      {/* Floor */}
      <rect x="0" y="580" width="1440" height="320" fill="url(#floorG)" />
      {/* Skirting */}
      <rect x="0" y="578" width="1440" height="5" fill="oklch(0.75 0.12 85)" opacity="0.18" />

      {/* Window recess */}
      <rect x="905" y="60" width="380" height="500" rx="2" fill="oklch(0.15 0.03 155)" opacity="0.9" />
      {/* Window sky */}
      <rect x="915" y="70" width="360" height="480" fill="oklch(0.28 0.05 200)" opacity="0.9" />
      <rect x="915" y="70" width="360" height="480" fill="url(#winG)" />
      {/* Mullions */}
      <rect x="1093" y="70" width="6" height="480" fill="oklch(0.18 0.03 155)" opacity="0.9" />
      <rect x="915" y="298" width="360" height="6" fill="oklch(0.18 0.03 155)" opacity="0.9" />
      {/* Left curtain */}
      <rect x="865" y="50" width="68" height="532" rx="2" fill="oklch(0.26 0.04 155)" opacity="0.95" />
      <rect x="865" y="50" width="11" height="532" fill="oklch(0.32 0.05 155)" opacity="0.5" />
      {/* Right curtain */}
      <rect x="1272" y="50" width="68" height="532" rx="2" fill="oklch(0.26 0.04 155)" opacity="0.95" />
      <rect x="1329" y="50" width="11" height="532" fill="oklch(0.32 0.05 155)" opacity="0.5" />
      {/* Curtain rod */}
      <rect x="852" y="48" width="500" height="8" rx="4" fill="oklch(0.75 0.12 85)" opacity="0.7" />

      {/* Sofa body */}
      <rect x="82" y="452" width="680" height="128" rx="14" fill="oklch(0.25 0.04 160)" />
      <rect x="82" y="387" width="680" height="78" rx="12" fill="oklch(0.27 0.04 160)" />
      {/* Seat cushions */}
      <rect x="90" y="454" width="213" height="118" rx="8" fill="oklch(0.26 0.04 160)" />
      <rect x="311" y="454" width="213" height="118" rx="8" fill="oklch(0.26 0.04 160)" />
      <rect x="532" y="454" width="213" height="118" rx="8" fill="oklch(0.26 0.04 160)" />
      {/* Arms */}
      <rect x="64" y="392" width="50" height="188" rx="12" fill="oklch(0.27 0.04 160)" />
      <rect x="688" y="392" width="50" height="188" rx="12" fill="oklch(0.27 0.04 160)" />
      {/* Gold pillow */}
      <rect x="322" y="392" width="88" height="70" rx="8" fill="oklch(0.75 0.12 85)" opacity="0.45" />
      <rect x="340" y="410" width="52" height="34" rx="4" fill="oklch(0.78 0.10 85)" opacity="0.3" />
      {/* Cream pillow */}
      <rect x="432" y="395" width="74" height="62" rx="8" fill="oklch(0.88 0.03 85)" opacity="0.3" />
      {/* Sofa highlight */}
      <rect x="82" y="387" width="680" height="3" rx="1" fill="oklch(0.75 0.12 85)" opacity="0.12" />

      {/* Coffee table */}
      <rect x="162" y="572" width="418" height="15" rx="4" fill="oklch(0.32 0.04 80)" />
      <rect x="187" y="587" width="11" height="34" fill="oklch(0.28 0.03 80)" />
      <rect x="377" y="587" width="11" height="34" fill="oklch(0.28 0.03 80)" />
      {/* Cup */}
      <ellipse cx="282" cy="572" rx="21" ry="5" fill="oklch(0.75 0.12 85)" opacity="0.15" />
      <rect x="270" y="549" width="22" height="23" rx="3" fill="oklch(0.22 0.03 155)" opacity="0.8" />

      {/* Floor lamp pole */}
      <rect x="792" y="392" width="4" height="192" fill="oklch(0.55 0.06 80)" opacity="0.9" />
      {/* Shade */}
      <ellipse cx="794" cy="392" rx="53" ry="27" fill="oklch(0.24 0.04 155)" opacity="0.95" />
      <ellipse cx="794" cy="396" rx="44" ry="19" fill="oklch(0.75 0.12 85)" opacity="0.16" />
      <ellipse cx="794" cy="584" rx="27" ry="5" fill="oklch(0.55 0.06 80)" opacity="0.4" />
      {/* Lamp glow */}
      <ellipse cx="794" cy="352" rx="155" ry="115" fill="url(#lampG)" filter="url(#glow)" />

      {/* Bookshelf */}
      <rect x="0" y="122" width="41" height="458" fill="oklch(0.22 0.03 155)" opacity="0.95" />
      <rect x="0" y="122" width="41" height="5" fill="oklch(0.75 0.12 85)" opacity="0.3" />
      {[142,172,198,226,258,292,322,354,390,420,452,490,522].map((y, i) => (
        <rect key={i} x="3" y={y} width="35"
          height={i % 3 === 0 ? 24 : i % 3 === 1 ? 28 : 18}
          rx="1"
          fill={i % 4 === 0 ? "oklch(0.75 0.12 85)" : i % 4 === 1 ? "oklch(0.35 0.06 145)" : i % 4 === 2 ? "oklch(0.97 0.015 85)" : "oklch(0.45 0.04 200)"}
          opacity={0.5 + (i % 3) * 0.15}
        />
      ))}

      {/* Wall art frame */}
      <rect x="232" y="117" width="278" height="198" rx="3" fill="oklch(0.19 0.03 155)" opacity="0.9" />
      <rect x="242" y="127" width="258" height="178" fill="oklch(0.22 0.04 155)" opacity="0.9" />
      <ellipse cx="371" cy="216" rx="54" ry="63" fill="oklch(0.32 0.07 145)" opacity="0.4" />
      <ellipse cx="353" cy="196" rx="34" ry="46" fill="oklch(0.35 0.07 145)" opacity="0.35" />
      <rect x="367" y="251" width="5" height="53" fill="oklch(0.30 0.06 145)" opacity="0.5" />
      <rect x="232" y="117" width="278" height="198" rx="3" fill="none" stroke="oklch(0.75 0.12 85)" strokeWidth="1.5" opacity="0.35" />

      {/* Corner plant */}
      <rect x="842" y="492" width="42" height="92" rx="6" fill="oklch(0.24 0.04 155)" opacity="0.9" />
      <ellipse cx="863" cy="462" rx="50" ry="40" fill="oklch(0.30 0.08 145)" opacity="0.85" />
      <ellipse cx="841" cy="450" rx="32" ry="26" fill="oklch(0.32 0.08 145)" opacity="0.8" />
      <ellipse cx="885" cy="447" rx="30" ry="30" fill="oklch(0.28 0.08 145)" opacity="0.8" />
      <ellipse cx="863" cy="432" rx="18" ry="24" fill="oklch(0.34 0.08 145)" opacity="0.75" />

      {/* Floor light spill */}
      <ellipse cx="1090" cy="640" rx="195" ry="78" fill="oklch(0.75 0.12 85)" opacity="0.06" filter="url(#glow)" />

      {/* Vignette */}
      <rect width="1440" height="900" fill="url(#vigG)" />
      {/* Nav readability band */}
      <rect width="1440" height="115" fill="oklch(0.10 0.02 155)" opacity="0.55" />
      {/* Bottom band */}
      <rect x="0" y="782" width="1440" height="118" fill="oklch(0.10 0.02 155)" opacity="0.4" />
      {/* Left edge */}
      <rect width="75" height="900" fill="oklch(0.10 0.02 155)" opacity="0.45" />
      {/* Gold floor line */}
      <line x1="0" y1="578" x2="1440" y2="578" stroke="oklch(0.75 0.12 85)" strokeWidth="0.8" opacity="0.25" />
    </svg>
  );
}

/* ─── Property card SVG ──────────────────────────────────────────────── */
function PropertyScene({ variant }: { variant: "sushant" | "jharsa" }) {
  const s = variant === "sushant";
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full"
      preserveAspectRatio="xMidYMid slice" viewBox="0 0 600 800" aria-hidden="true">
      <defs>
        <linearGradient id={`pg-${variant}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={s ? "oklch(0.22 0.05 155)" : "oklch(0.20 0.04 170)"} />
          <stop offset="100%" stopColor={s ? "oklch(0.16 0.04 155)" : "oklch(0.15 0.04 165)"} />
        </linearGradient>
        <radialGradient id={`pw-${variant}`} cx="70%" cy="35%" r="45%">
          <stop offset="0%" stopColor="oklch(0.75 0.12 85)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id={`pv-${variant}`} cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="100%" stopColor="oklch(0.10 0.02 155)" stopOpacity="0.7" />
        </radialGradient>
      </defs>
      <rect width="600" height="800" fill={`url(#pg-${variant})`} />
      <rect width="600" height="340" fill={s ? "oklch(0.26 0.04 200)" : "oklch(0.22 0.04 185)"} opacity="0.6" />
      <rect x="0" y="560" width="600" height="240" fill="oklch(0.20 0.04 130)" opacity="0.5" />
      <rect x="60" y="160" width="480" height="420" rx="4" fill="oklch(0.85 0.02 80)" opacity="0.92" />
      <rect x="60" y="158" width="480" height="8" fill="oklch(0.75 0.12 85)" opacity="0.5" />
      {[110, 230, 370, 450].map((x, i) => [240, 360].map((y, j) => (
        <rect key={`w${i}${j}`} x={x} y={y} width={i % 2 === 0 ? 90 : 70} height={80} rx="2"
          fill="oklch(0.75 0.12 85)" opacity={0.25 + (i + j) * 0.05} />
      )))}
      <rect x="250" y="440" width="100" height="140" rx="3" fill="oklch(0.24 0.04 155)" opacity="0.9" />
      <rect x="258" y="448" width="84" height="60" rx="2" fill="oklch(0.75 0.12 85)" opacity="0.12" />
      <circle cx="345" cy="520" r="5" fill="oklch(0.75 0.12 85)" opacity="0.8" />
      {s && <>
        <ellipse cx="30" cy="430" rx="28" ry="40" fill="oklch(0.30 0.08 145)" opacity="0.9" />
        <rect x="25" y="468" width="10" height="114" fill="oklch(0.24 0.05 120)" opacity="0.9" />
        <ellipse cx="570" cy="420" rx="26" ry="38" fill="oklch(0.32 0.08 145)" opacity="0.9" />
        <rect x="565" y="456" width="10" height="124" fill="oklch(0.24 0.05 120)" opacity="0.9" />
      </>}
      <rect x={s ? 490 : 90} y="390" width="6" height="190" fill="oklch(0.40 0.04 100)" opacity="0.9" />
      <ellipse cx={s ? 493 : 93} cy="388" rx="16" ry="10" fill="oklch(0.75 0.12 85)" opacity="0.5" />
      <rect x="0" y="558" width="600" height="6" fill="oklch(0.75 0.12 85)" opacity="0.2" />
      <rect width="600" height="800" fill={`url(#pw-${variant})`} />
      <rect width="600" height="800" fill={`url(#pv-${variant})`} />
    </svg>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────────── */
export default function HomePage() {
  const [siteData, setSiteData] = useState<{
    content: { heroHeadline: string; heroSubtitle: string; philosophyText: string; taglineCloser: string };
    heroPhotos: { url: string; alt: string }[];
    instagramPhotos: { url: string; alt: string }[];
    propertyCards: Record<string, { url: string; alt: string }[]>;
    properties: { id: string; name: string; slug: string; address: string; coordinates: string; vibe: string; baseRate: number }[];
  } | null>(null);

  useEffect(() => {
    // Scroll reveals
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("active")),
      { threshold: 0.08 }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

    // Load live site data from admin CMS
    fetch("/api/site-data")
      .then((r) => r.json())
      .then(setSiteData)
      .catch(() => {}); // silently fall back to defaults

    return () => io.disconnect();
  }, []);

  // Merge live data with defaults
  const headline = siteData?.content?.heroHeadline || "The Mehmaan Experience";
  const subtitle = siteData?.content?.heroSubtitle || "Two homes in Gurugram. Endless ways to feel at home.";
  const philosophy = siteData?.content?.philosophyText || "Mehmaan — the Hindi word for guest — carries a cultural weight that no translation captures. It's not a transaction. It's a relationship. Two beautifully curated homes. One unforgettable promise. This isn't a hotel. This is your Mehmaan moment.";
  const pullQuote = siteData?.content?.taglineCloser || "Come as a guest, leave as family.";
  const heroPhoto = siteData?.heroPhotos?.[0];
  const igPhotos = siteData?.instagramPhotos || [];
  const liveProperties = siteData?.properties || null;

  return (
    <div className="min-h-screen bg-cream">
      <ScrollProgressBar />
      <Navigation />
      <main id="main-content">

        {/* ═══ HERO ═══════════════════════════════════════════════════════ */}
        <section className="relative h-screen min-h-[700px] flex items-center overflow-hidden">
          <MouseParallax intensity={18} className="absolute inset-0">
            <HeroScene />
          </MouseParallax>

          {/* Left content */}
          <div className="relative z-10 w-full px-8 md:px-16 lg:px-24 xl:px-32">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-8 animate-fade-in">
                <div className="w-8 h-px bg-gold/70" />
                <span className="font-mono text-gold text-xs tracking-[0.25em] uppercase">
                  Gurugram · India
                </span>
              </div>

              <DepthText
                as="h1"
                className="font-display text-cream leading-[0.92] tracking-[-0.02em] mb-8 animate-fade-up"
                style={{ fontSize: "clamp(3.2rem, 7vw, 7rem)" } as React.CSSProperties}
              >
                The<br />
                <em className="not-italic text-gold">Mehmaan</em><br />
                Experience
              </DepthText>

              <p className="text-cream/70 text-lg md:text-xl font-sans font-light leading-relaxed mb-10 max-w-md animate-fade-up"
                style={{ animationDelay: "200ms" }}>
                Two homes in Gurugram. Endless ways to feel at home.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: "350ms" }}>
                <Link href="/contact"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gold text-ink font-medium text-base hover:bg-gold/90 transition-colors duration-300 group">
                  Reserve Your Stay
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/homes"
                  className="inline-flex items-center justify-center px-8 py-4 border border-cream/30 text-cream font-medium text-base hover:border-cream/70 hover:bg-cream/5 transition-all duration-300">
                  Explore Our Homes
                </Link>
              </div>
            </div>
          </div>

          {/* Scroll cue */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 animate-fade-in"
            style={{ animationDelay: "800ms" }} aria-hidden="true">
            <span className="font-mono text-cream/30 text-[10px] tracking-[0.3em] uppercase">Scroll</span>
            <div className="w-px h-12 bg-gradient-to-b from-cream/30 to-transparent" />
          </div>
        </section>

        {/* ═══ MANIFESTO ══════════════════════════════════════════════════ */}
        <section className="bg-forest-deep py-28 px-6 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-16 border-2 border-gold/20 rounded-t-full" />
          <div className="container mx-auto max-w-3xl text-center relative">
            <p className="font-mono text-gold/70 text-xs tracking-[0.3em] uppercase mb-10 reveal">Our Philosophy</p>
            <p className="font-display text-cream leading-[1.3] reveal"
              style={{ fontSize: "clamp(1.6rem, 3.2vw, 2.4rem)" }}>
              <em className="text-gold not-italic">Mehmaan</em> — the Hindi word for guest — carries a
              cultural weight that no translation captures. It's not a transaction. It's a
              relationship. Two beautifully curated homes. One unforgettable promise.
              This isn't a hotel. This is your <em className="text-gold not-italic">Mehmaan</em> moment.
            </p>
            <div className="mt-12 flex items-center justify-center gap-6 reveal">
              <div className="h-px w-16 bg-gold/30" />
              <div className="w-4 h-4 border border-gold/40 rotate-45" />
              <div className="h-px w-16 bg-gold/30" />
            </div>
          </div>
        </section>

        {/* ═══ THREE PILLARS ══════════════════════════════════════════════ */}
        <section className="py-28 px-6 bg-cream">
          <div className="container mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              <div className="lg:col-span-4 flex flex-col justify-center pb-12 lg:pb-0 lg:pr-16 lg:border-r border-forest/10">
                <p className="font-mono text-gold text-xs tracking-[0.3em] uppercase mb-4 reveal">The Pillars</p>
                <h2 className="font-display text-forest leading-none reveal"
                  style={{ fontSize: "clamp(2.5rem, 4.5vw, 4rem)" }}>
                  Your Stay,<br />Your Way.
                </h2>
              </div>
              <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-forest/10">
              {[
                  { num: "01", title: "Your Vibe", body: "Work, unwind, celebrate — the space reads you and adapts. No mood is wrong here." },
                  { num: "02", title: "Your Space", body: "Rooms that feel lived-in with intention. Styled but never sterile. Yours for the night." },
                  { num: "03", title: "Your Time", body: "No rigid check-in theatre. Arrive when you do. Breathe. The home waits for you." },
                ].map(({ num, title, body }, i) => (
                  <Reveal3D key={num} delay={i * 0.12} direction="up">
                    <div className="flex flex-col justify-between p-8 md:px-10 group">
                      <div className="font-mono text-gold/50 text-xs mb-6">{num}</div>
                      <div>
                        <h3 className="font-display text-forest mb-4 group-hover:text-gold transition-colors duration-500"
                          style={{ fontSize: "clamp(1.5rem, 2.2vw, 2rem)" }}>
                          {title}
                        </h3>
                        <p className="text-ink/65 text-sm leading-relaxed">{body}</p>
                      </div>
                    </div>
                  </Reveal3D>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══ TWO HOMES ══════════════════════════════════════════════════ */}
        <section className="bg-ink py-6 px-6">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <p className="font-mono text-gold/70 text-xs tracking-[0.3em] uppercase mb-4 reveal">Our Properties</p>
              <h2 className="font-display text-cream reveal" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>
                Two Homes. One Promise.
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {[
                { variant: "sushant" as const, num: "HOME 01", name: "Sushant Lok",
                  loc: "Sector 57, Phase 2 · Gurugram", coords: "28.4212° N  77.0761° E",
                  vibe: "Peaceful surroundings, great connectivity — perfect for work or to unwind.",
                  rate: "from ₹4,500/night", href: "/homes/sushant-lok" },
                { variant: "jharsa" as const, num: "HOME 02", name: "Jharsa Village",
                  loc: "Sector 39 · Gurugram", coords: "28.4594° N  77.0266° E",
                  vibe: "Cozy neighborhood, close to everything — your happy place in the city.",
                  rate: "from ₹4,000/night", href: "/homes/jharsa-village" },
              ].map((p, i) => (
                <TiltCard key={p.num} intensity={8} className="reveal" style={{ animationDelay: `${i * 150}ms` }}>
                  <Link href={p.href} className="group relative block overflow-hidden">
                    <div className="relative h-[520px] lg:h-[640px]">
                      <PropertyScene variant={p.variant} />
                      <div className="absolute inset-0 bg-forest-deep/0 group-hover:bg-forest-deep/20 transition-colors duration-700" />
                      <div className="absolute inset-0 flex flex-col justify-between p-8">
                        <div className="flex items-start justify-between">
                          <span className="font-mono text-gold text-xs tracking-[0.25em] bg-ink/40 px-3 py-1.5 backdrop-blur-sm">{p.num}</span>
                          <span className="font-mono text-cream/50 text-xs">{p.coords}</span>
                        </div>
                        <div>
                          <p className="font-mono text-cream/50 text-xs mb-2 tracking-widest">{p.loc}</p>
                          <h3 className="font-display text-cream leading-none mb-3 group-hover:text-gold transition-colors duration-500"
                            style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)" }}>{p.name}</h3>
                          <p className="text-cream/70 text-sm leading-relaxed mb-6 max-w-sm">{p.vibe}</p>
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-gold text-sm">{p.rate}</span>
                            <span className="flex items-center gap-2 text-cream/70 text-sm group-hover:text-gold group-hover:gap-3 transition-all duration-300">
                              Explore <ArrowRight size={16} />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </TiltCard>
              ))}
            </div>
            <div className="text-center mt-8 reveal">
              <Link href="/homes"
                className="inline-flex items-center gap-3 text-cream/60 hover:text-gold transition-colors font-mono text-sm tracking-wider">
                View both homes in detail <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* ═══ AMENITIES ══════════════════════════════════════════════════ */}
        <section className="py-28 px-6 bg-cream">
          <div className="container mx-auto max-w-7xl">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16 gap-6">
              <div>
                <p className="font-mono text-gold text-xs tracking-[0.3em] uppercase mb-4 reveal">What's Included</p>
                <h2 className="font-display text-forest reveal" style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)" }}>
                  Everything you need.<br />Nothing you don't.
                </h2>
              </div>
              <Link href="/experience"
                className="reveal inline-flex items-center gap-2 font-mono text-sm text-forest/60 hover:text-gold transition-colors tracking-wider self-start lg:self-auto">
                Full experience <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-l border-t border-forest/10">
              {[
                { num: "01", title: "High-Speed Wi-Fi", sub: "For the meetings that can't wait.", icon: "▦" },
                { num: "02", title: "Smart TV & Chill", sub: "Your streaming queue, our big screen.", icon: "▣" },
                { num: "03", title: "Spotless & Styled", sub: "Cleaned, arranged, ready for you.", icon: "◈" },
                { num: "04", title: "Prime Locations", sub: "Gurugram at your doorstep.", icon: "◎" },
              ].map(({ num, title, sub, icon }, i) => (
                <TiltCard key={num} intensity={10} className="reveal border-r border-b border-forest/10" style={{ animationDelay: `${i * 80}ms` }}>
                  <div className="p-8 group hover:bg-forest hover:text-cream transition-all duration-500 h-full">
                    <div className="flex items-start justify-between mb-8">
                      <span className="font-mono text-gold text-xs group-hover:text-gold/70">{num}</span>
                      <span className="text-2xl text-forest/20 group-hover:text-cream/20 transition-colors">{icon}</span>
                    </div>
                    <h3 className="font-display text-xl text-forest group-hover:text-cream mb-3 transition-colors duration-500">{title}</h3>
                    <p className="text-ink/60 group-hover:text-cream/70 text-sm leading-relaxed transition-colors duration-500">{sub}</p>
                  </div>
                </TiltCard>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ PULL QUOTE ═════════════════════════════════════════════════ */}
        <section className="relative py-36 px-6 bg-forest overflow-hidden">
          <ParallaxLayer speed={0.3} className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 border-2 border-gold/10 rounded-t-full" aria-hidden="true" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 border border-gold/5 rounded-t-full" aria-hidden="true" />
          </ParallaxLayer>
          <div className="container mx-auto max-w-4xl text-center relative z-10">
            <p className="font-mono text-gold/50 text-xs tracking-[0.3em] uppercase mb-10 reveal">A Promise</p>
            <Reveal3D direction="up">
              <DepthText
                as="h2"
                className="font-display text-cream"
                style={{ fontSize: "clamp(2.2rem, 5vw, 4.5rem)", lineHeight: "1.15" } as React.CSSProperties}
                color="oklch(0.75 0.12 85)"
              >
                "Come as a guest,<br />
                <span className="text-gold italic">leave as family."</span>
              </DepthText>
            </Reveal3D>
            <p className="mt-8 font-mono text-cream/30 text-xs tracking-[0.2em] reveal">— The Mehmaan Manor Promise</p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gold/20" />
        </section>

        {/* ═══ INSTAGRAM ══════════════════════════════════════════════════ */}
        <section className="py-24 px-6 bg-cream border-t border-forest/8">
          <div className="container mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4">
              <div className="reveal">
                <p className="font-mono text-gold text-xs tracking-[0.3em] uppercase mb-2">Follow the story</p>
                <h2 className="font-display text-forest" style={{ fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)" }}>
                  @themehmaanmanor
                </h2>
              </div>
              <a href="https://www.instagram.com/themehmaanmanor" target="_blank" rel="noopener noreferrer"
                className="reveal inline-flex items-center gap-2 font-mono text-sm text-forest/60 hover:text-gold transition-colors tracking-wider self-start">
                <Instagram size={14} /> Open Instagram
              </a>
            </div>
            <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 reveal">
              {["Living room, golden hour","Detail · brass fixture","Morning coffee ritual",
                "Bedroom · clean lines","Textured throw, ceramic","Plant corner, diffused light"
              ].map((cap, i) => (
                <div key={i} className="aspect-square relative overflow-hidden group cursor-pointer bg-forest/10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full"
                    preserveAspectRatio="xMidYMid slice" viewBox="0 0 200 200" aria-hidden="true">
                    <defs>
                      <linearGradient id={`ig-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={i % 2 === 0 ? "oklch(0.22 0.04 155)" : "oklch(0.18 0.04 155)"} />
                        <stop offset="100%" stopColor={i % 2 === 0 ? "oklch(0.28 0.04 155)" : "oklch(0.24 0.04 155)"} />
                      </linearGradient>
                    </defs>
                    <rect width="200" height="200" fill={`url(#ig-${i})`} />
                    <rect x="0" y="130" width="200" height="70" fill="oklch(0.18 0.03 80)" opacity="0.5" />
                    <rect x={110 + (i % 3) * 10} y="20" width="70" height="95" rx="1" fill="oklch(0.75 0.12 85)" opacity="0.12" />
                    <ellipse cx="30" cy="115" rx="20" ry="16" fill="oklch(0.30 0.08 145)" opacity="0.7" />
                    <rect x="27" y="130" width="6" height="30" fill="oklch(0.22 0.04 155)" />
                    <rect width="200" height="200" fill="oklch(0.10 0.02 155)" opacity="0.35" />
                    <polyline points="8,8 8,20 20,8" fill="none" stroke="oklch(0.75 0.12 85)" strokeWidth="1.5" opacity="0.5" />
                  </svg>
                  <div className="absolute inset-0 bg-forest-deep/0 group-hover:bg-forest-deep/40 transition-all duration-500 flex items-center justify-center">
                    <p className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-mono text-cream/80 text-[9px] text-center px-3 uppercase tracking-wider leading-relaxed">{cap}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ FINAL CTA ══════════════════════════════════════════════════ */}
        <section className="py-28 px-6 bg-gold relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-ink/10" />
          <div className="container mx-auto max-w-4xl relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="reveal">
                <p className="font-mono text-ink/50 text-xs tracking-[0.3em] uppercase mb-4">Ready?</p>
                <h2 className="font-display text-ink leading-none" style={{ fontSize: "clamp(2.2rem, 4vw, 3.5rem)" }}>
                  Reserve Your<br />Mehmaan Experience
                </h2>
              </div>
              <div className="reveal space-y-5" style={{ animationDelay: "150ms" }}>
                <p className="text-ink/70 leading-relaxed">
                  Speak directly with Simran or Jyoti — real hosts, real warmth. No booking bots. No hidden fees.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/contact"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-forest text-cream font-medium text-base hover:bg-forest-deep transition-colors duration-300 group">
                    Book Your Stay
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <a href="https://wa.me/918828352311" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-8 py-4 border-2 border-ink/20 text-ink font-medium text-base hover:border-ink/50 transition-colors duration-300">
                    WhatsApp Us
                  </a>
                </div>
                <p className="font-mono text-ink/40 text-xs tracking-wider">Simran · +91 88283 52311</p>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
