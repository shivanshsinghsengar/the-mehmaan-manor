"use client";

/**
 * ManorExperience — "Enter the Manor Experience"
 *
 * Phase flow:
 *   idle → intro (text animation) → exterior (building view) → entering (zoom) → interior (scrollable reception)
 *
 * Interior layout (scrollable, works on mobile & desktop):
 *   - Top: scene header bar  
 *   - Section A: Property walls (left = Sector 57, right = Sector 39) — side by side cards
 *   - Section B: Reception desk — Book Now / WhatsApp / Browse
 *   - Section C: Three info boards in a row — How it Works · Guest Reviews · Meet Your Hosts
 *   - Footer hint bar
 */

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

/* ─── Types ─────────────────────────────────────────────────── */
type Phase = "idle" | "intro" | "exterior" | "entering" | "interior";

export interface ManorProperty {
  id: string;
  name: string;
  slug: string;
  baseRate: number;
  address: string;
}

/* ─── Utility ────────────────────────────────────────────────── */
function cn(...c: (string | boolean | undefined | null)[]) {
  return c.filter(Boolean).join(" ");
}

/* ─────────────────────────────────────────────────────────────
   SHARED — Close / Exit button
───────────────────────────────────────────────────────────── */
function ExitBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Exit experience and return to website"
      className="fixed top-4 right-4 z-[9999] inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white/80 hover:text-white hover:bg-black/70 text-xs font-mono tracking-wide transition-all select-none focus:outline-none focus:ring-2 focus:ring-white/40"
    >
      <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
        <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      Exit
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────
   PHASE 1 — INTRO TEXT
   "The Mehmaan Manor"  →  "Feel like Mehmaan"
───────────────────────────────────────────────────────────── */
function IntroScreen({ onDone }: { onDone: () => void }) {
  const [lineIdx, setLineIdx] = useState(0);
  const [stage, setStage] = useState<"in" | "hold" | "out">("in");

  const lines = [
    { heading: "The Mehmaan Manor", sub: "Gurugram · Haryana · India" },
    { heading: "Feel like Mehmaan", sub: "A home away from home." },
  ];

  useEffect(() => {
    const seq: [number, () => void][] = [
      [850,  () => setStage("hold")],
      [2200, () => setStage("out")],
      [2950, () => { setLineIdx(1); setStage("in"); }],
      [3800, () => setStage("hold")],
      [5100, () => setStage("out")],
      [5900, () => onDone()],
    ];
    const ids = seq.map(([ms, fn]) => setTimeout(fn, ms));
    return () => ids.forEach(clearTimeout);
  }, [onDone]);

  const current = lines[lineIdx];

  return (
    <div
      className="fixed inset-0 z-[9990] flex items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(135deg,#0a1a14 0%,#1a3328 55%,#0d1f1a 100%)" }}
      role="dialog"
      aria-modal="true"
      aria-label="Manor experience intro"
    >
      {/* Ambient radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 50% at 50% 60%, rgba(201,168,76,0.10) 0%, transparent 70%)" }}
      />

      {/* Floating dust particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {Array.from({ length: 18 }).map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-[#c9a84c]"
            style={{
              width: 2 + (i % 3),
              height: 2 + (i % 3),
              opacity: 0.12 + (i % 4) * 0.06,
              left: `${5 + i * 5.2}%`,
              top: `${15 + (i % 5) * 14}%`,
              animation: `manorFloat ${2.8 + (i % 4) * 0.7}s ease-in-out ${i * 0.35}s infinite alternate`,
            }}
          />
        ))}
      </div>

      {/* Text block */}
      <div
        key={lineIdx}
        className={cn(
          "relative text-center px-6 max-w-2xl w-full manor-intro-text",
          stage === "in"   && "manor-intro-fadein",
          stage === "hold" && "manor-intro-hold",
          stage === "out"  && "manor-intro-fadeout",
        )}
      >
        {/* Gold rule */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-[#c9a84c]/60" />
          <span className="text-[#c9a84c] text-sm select-none">◆</span>
          <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-transparent to-[#c9a84c]/60" />
        </div>

        <h2
          className="font-display text-white font-light"
          style={{ fontSize: "clamp(2.2rem, 7vw, 5rem)", letterSpacing: "0.04em", lineHeight: 1.1 }}
        >
          {current.heading}
        </h2>

        <p className="mt-5 text-[#c9a84c]/75 font-mono text-sm tracking-[0.28em] uppercase">
          {current.sub}
        </p>

        {/* Bottom rule */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <div className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-transparent to-[#c9a84c]/30" />
          <div className="h-1 w-1 rounded-full bg-[#c9a84c]/40" />
          <div className="h-px flex-1 max-w-[60px] bg-gradient-to-l from-transparent to-[#c9a84c]/30" />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   PHASE 2 — EXTERIOR  (first-person building view)
───────────────────────────────────────────────────────────── */
function ExteriorScreen({ onEnter, onClose }: { onEnter: () => void; onClose: () => void }) {
  const [hovered, setHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t); }, []);

  return (
    <div
      className={cn("fixed inset-0 z-[9990] overflow-hidden transition-opacity duration-700", mounted ? "opacity-100" : "opacity-0")}
      role="dialog"
      aria-modal="true"
      aria-label="The Mehmaan Manor exterior"
    >
      {/* Sky */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,#7ab0d4 0%,#b8d9ef 28%,#d6ecd3 58%,#7ca86c 100%)" }} />

      {/* Subtle cloud streaks */}
      <div className="absolute top-[8%] left-[5%] w-[30%] h-[3%] rounded-full bg-white/25 blur-sm pointer-events-none" />
      <div className="absolute top-[14%] right-[8%] w-[22%] h-[2.5%] rounded-full bg-white/20 blur-sm pointer-events-none" />
      <div className="absolute top-[6%] left-[45%] w-[18%] h-[2%] rounded-full bg-white/18 blur-sm pointer-events-none" />

      {/* Ground */}
      <div className="absolute bottom-0 left-0 right-0" style={{ height: "30%", background: "linear-gradient(180deg,#7ca86c 0%,#4a6e3a 100%)" }} />

      {/* Stone path */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2"
        style={{
          width: "clamp(70px,11vw,130px)",
          height: "34%",
          background: "linear-gradient(180deg,#c8b990 0%,#a09070 100%)",
          clipPath: "polygon(12% 0%,88% 0%,100% 100%,0% 100%)",
        }}
      />
      {/* Path stones */}
      {[30, 55, 78].map((pct) => (
        <div
          key={pct}
          className="absolute left-1/2 -translate-x-1/2 h-px pointer-events-none"
          style={{
            bottom: `${pct * 0.32}%`,
            width: `clamp(40px,7vw,90px)`,
            background: "rgba(80,60,30,0.25)",
          }}
        />
      ))}

      {/* Trees */}
      <Trees side="left" />
      <Trees side="right" />

      {/* Building — clickable */}
      <button
        onClick={onEnter}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        aria-label="Click to enter the Manor"
        className="absolute left-1/2 bottom-[25%] focus:outline-none"
        style={{
          width: "clamp(220px,40vw,500px)",
          transform: `translateX(-50%) scale(${hovered ? 1.025 : 1})`,
          transition: "transform 0.55s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <ManorBuildingSVG hovered={hovered} />

        {/* Enter prompt */}
        <div
          className="mt-3 flex items-center justify-center gap-2"
          style={{
            opacity: hovered ? 1 : 0.55,
            transform: `translateY(${hovered ? 0 : 4}px)`,
            transition: "opacity 0.35s ease, transform 0.35s ease",
          }}
        >
          <span
            className="text-xs font-mono tracking-widest px-4 py-2 rounded-full"
            style={{
              background: hovered ? "rgba(26,51,40,0.85)" : "rgba(0,0,0,0.35)",
              color: hovered ? "#c9a84c" : "rgba(255,255,255,0.7)",
              backdropFilter: "blur(8px)",
              border: hovered ? "1px solid rgba(201,168,76,0.4)" : "1px solid rgba(255,255,255,0.15)",
              transition: "all 0.35s ease",
            }}
          >
            {hovered ? "✦  Click to Enter  ✦" : "↑  Step inside the Manor"}
          </span>
        </div>
      </button>

      {/* Horizon line */}
      <div
        className="absolute left-0 right-0 h-px pointer-events-none"
        style={{ bottom: "30%", background: "linear-gradient(90deg,transparent,rgba(60,90,50,0.5),transparent)" }}
      />

      {/* Location HUD */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/30 backdrop-blur-sm border border-white/10 text-white/65 text-[11px] font-mono tracking-widest">
          <span className="text-sm">📍</span> Gurugram · Haryana · India
        </span>
      </div>

      <ExitBtn onClick={onClose} />
    </div>
  );
}

/* ── Building SVG illustration ──────────────────────────────── */
function ManorBuildingSVG({ hovered }: { hovered: boolean }) {
  const winFill  = hovered ? "#f8eecc" : "#dac89a";
  const winGlow  = hovered ? "rgba(255,236,150,0.35)" : "transparent";

  return (
    <svg viewBox="0 0 520 370" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full drop-shadow-2xl" aria-hidden="true">
      {/* Main facade */}
      <rect x="55" y="55" width="410" height="305" rx="3" fill="#ede4cf" stroke="#c8b88a" strokeWidth="1.5" />

      {/* Facade courses */}
      {[105,155,205,255,305,355].map(y => (
        <line key={y} x1="55" y1={y} x2="465" y2={y} stroke="#c8b88a" strokeWidth="0.7" />
      ))}

      {/* Parapet */}
      <rect x="42" y="40" width="436" height="20" rx="2" fill="#d8c99e" stroke="#b8a87c" strokeWidth="1.5" />
      {[72,112,152,192,232,272,312,352,392,432].map(x => (
        <rect key={x} x={x} y="42" width="12" height="9" rx="1" fill="#b8a87c" />
      ))}

      {/* Windows row 1 */}
      {[80,165,310,395].map(x => (
        <g key={`w1-${x}`}>
          <rect x={x} y="75" width="58" height="62" rx="2" fill={winFill} stroke="#b8a87c" strokeWidth="1.2" />
          {hovered && <rect x={x} y="75" width="58" height="62" rx="2" fill={winGlow} />}
          <line x1={x+29} y1="75" x2={x+29} y2={137} stroke="#b8a87c" strokeWidth="0.7" />
          <line x1={x}    y1={106} x2={x+58} y2={106} stroke="#b8a87c" strokeWidth="0.7" />
        </g>
      ))}

      {/* Windows row 2 */}
      {[80,165,310,395].map(x => (
        <g key={`w2-${x}`}>
          <rect x={x} y="160" width="58" height="62" rx="2" fill={winFill} stroke="#b8a87c" strokeWidth="1.2" />
          {hovered && <rect x={x} y="160" width="58" height="62" rx="2" fill={winGlow} />}
          <line x1={x+29} y1="160" x2={x+29} y2={222} stroke="#b8a87c" strokeWidth="0.7" />
          <line x1={x}    y1={191} x2={x+58} y2={191} stroke="#b8a87c" strokeWidth="0.7" />
        </g>
      ))}

      {/* Windows row 3 (flanking door) */}
      {[80,165,310,395].map(x => (
        <g key={`w3-${x}`}>
          <rect x={x} y="248" width="58" height="48" rx="2" fill={hovered ? "#e8d080" : "#cdb878"} stroke="#b8a87c" strokeWidth="1.2" />
          {hovered && <rect x={x} y="248" width="58" height="48" rx="2" fill="rgba(255,236,120,0.25)" />}
          <line x1={x+29} y1="248" x2={x+29} y2={296} stroke="#b8a87c" strokeWidth="0.7" />
        </g>
      ))}

      {/* Grand entrance arch */}
      <rect x="210" y="265" width="100" height="95" rx="2" fill="#1a3328" />
      <ellipse cx="260" cy="265" rx="50" ry="25" fill="#1a3328" />
      {/* Gold frame */}
      <rect   x="208" y="263" width="104" height="97"  rx="3" fill="none" stroke="#c9a84c" strokeWidth="2" />
      <ellipse cx="260" cy="265" rx="52" ry="27" fill="none" stroke="#c9a84c" strokeWidth="2" />
      {/* Door panels */}
      <rect x="215" y="275" width="38" height="63" rx="1" fill="#0d1f1a" stroke="#c9a84c" strokeWidth="1" />
      <rect x="267" y="275" width="38" height="63" rx="1" fill="#0d1f1a" stroke="#c9a84c" strokeWidth="1" />
      {/* Knobs */}
      <circle cx="252" cy="309" r="3.5" fill="#c9a84c" />
      <circle cx="268" cy="309" r="3.5" fill="#c9a84c" />

      {/* Signboard */}
      <rect x="190" y="238" width="140" height="22" rx="3" fill="#1a3328" stroke="#c9a84c" strokeWidth="1.5" />
      <text x="260" y="253" textAnchor="middle" fill="#c9a84c" fontSize="7.5" fontFamily="Georgia,serif" letterSpacing="2.5">
        THE MEHMAAN MANOR
      </text>

      {/* Entrance steps */}
      <rect x="196" y="358" width="128" height="7"  rx="1" fill="#c8b88a" />
      <rect x="204" y="351" width="112" height="7"  rx="1" fill="#d8c89e" />
      <rect x="212" y="344" width="96"  height="7"  rx="1" fill="#e0d0a8" />

      {/* Hover overlay glow */}
      {hovered && <rect x="55" y="55" width="410" height="305" rx="3" fill="rgba(201,168,76,0.05)" />}
    </svg>
  );
}

/* ── Decorative trees ────────────────────────────────────────── */
function Trees({ side }: { side: "left" | "right" }) {
  const isLeft = side === "left";
  const specs = [
    { pos: isLeft ? "6%"  : "89%", size: 1.1 },
    { pos: isLeft ? "13%" : "82%", size: 1.4 },
    { pos: isLeft ? "2%"  : "95%", size: 0.8 },
  ];

  return (
    <>
      {specs.map((t, i) => {
        const base   = Math.round(t.size * 30);
        const trunk  = Math.round(t.size * 22);
        const widths = [base * 2, base * 1.5, base * 1.1];
        const heights= [base * 1.8, base * 1.4, base * 1.0];

        return (
          <div
            key={i}
            className="absolute bottom-[24%] pointer-events-none"
            style={{ left: t.pos, transform: "translateX(-50%)", width: widths[0] }}
          >
            {/* Layered foliage (bottom → top) */}
            {[0, 1, 2].map(j => (
              <div
                key={j}
                className="rounded-full mx-auto"
                style={{
                  width: widths[j],
                  height: heights[j],
                  marginTop: j === 0 ? 0 : -Math.round(heights[j] * 0.35),
                  background: ["#3a6830","#487d3a","#55914a"][j],
                }}
              />
            ))}
            {/* Trunk */}
            <div
              className="mx-auto rounded-sm"
              style={{ width: Math.round(widths[0] * 0.16), height: trunk, background: "#5c3d28" }}
            />
          </div>
        );
      })}
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   ENTER TRANSITION  (zoom through door)
───────────────────────────────────────────────────────────── */
function EnterTransition({ onDone }: { onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 1500); return () => clearTimeout(t); }, [onDone]);

  return (
    <div className="fixed inset-0 z-[9991] flex items-center justify-center overflow-hidden manor-enter-zoom">
      <div className="absolute inset-0 bg-[#1a3328]" />
      <div className="flex flex-col items-center gap-3 relative z-10">
        <div className="w-6 h-6 border-2 border-[#c9a84c]/50 border-t-[#c9a84c] rounded-full animate-spin" />
        <p className="text-[#c9a84c]/60 text-[11px] font-mono tracking-[0.3em] uppercase">Entering…</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   PROPERTY DETAIL MODAL
───────────────────────────────────────────────────────────── */
function PropertyModal({ prop, onClose }: { prop: ManorProperty; onClose: () => void }) {
  const isP1       = prop.id === "1";
  const bookUrl    = `/homes/${prop.slug}`;
  const waText     = encodeURIComponent(`Hi! I'm interested in ${prop.name}. Could you share availability?`);

  const highlights = isP1
    ? ["Up to 3 guests","Balcony","Wi-Fi & Netflix","24h Hot Water","CCTV Security","Power Backup"]
    : ["Up to 5 guests","Studio & 2BHK","Near Medanta","Metro Nearby","Wi-Fi & Netflix","Basic Kitchen"];

  const tourPhotos = isP1
    ? [
        { src: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80&auto=format&fit=crop", label: "Bedroom" },
        { src: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=600&q=80&auto=format&fit=crop",  label: "Living Area" },
        { src: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=600&q=80&auto=format&fit=crop", label: "Balcony" },
      ]
    : [
        { src: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&q=80&auto=format&fit=crop", label: "Studio" },
        { src: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80&auto=format&fit=crop",  label: "Living Room" },
        { src: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80&auto=format&fit=crop",  label: "Kitchen" },
      ];

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.80)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="prop-modal-title"
    >
      <div
        className="relative bg-[#faf8f4] rounded-2xl w-full max-w-lg shadow-2xl manor-pop-in overflow-y-auto"
        style={{ maxHeight: "92vh" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Gold strip */}
        <div className="h-1 w-full bg-gradient-to-r from-[#c9a84c] via-[#f0dc90] to-[#c9a84c] rounded-t-2xl" />

        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close property details"
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-[#1a3328]/8 hover:bg-[#1a3328]/15 text-[#1a3328]/60 hover:text-[#1a3328] text-lg leading-none transition-colors focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
        >
          ×
        </button>

        <div className="p-6 pb-5">
          {/* Header */}
          <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#c9a84c]">Our Property</span>
          <h3 id="prop-modal-title" className="font-display text-2xl text-[#1a3328] mt-1 leading-tight pr-8">
            {prop.name}
          </h3>
          <p className="text-[#1a3328]/50 text-xs mt-1 leading-relaxed">{prop.address}</p>

          {/* Price row */}
          <div className="flex items-baseline gap-1.5 mt-4 pb-4 border-b border-[#1a3328]/8">
            <span className="font-display text-4xl text-[#1a3328] font-semibold tracking-tight">
              ₹{prop.baseRate.toLocaleString("en-IN")}
            </span>
            <span className="text-[#1a3328]/45 text-sm">/night</span>
            <span className="ml-2 text-[10px] font-mono text-[#c9a84c] bg-[#c9a84c]/10 px-2 py-0.5 rounded-full">
              No booking fee
            </span>
          </div>

          {/* Virtual tour strip */}
          <div className="mt-4 mb-4">
            <p className="text-[10px] font-mono tracking-widest uppercase text-[#1a3328]/40 mb-2">Virtual Tour</p>
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
              {tourPhotos.map((p, i) => (
                <div key={i} className="flex-shrink-0 relative rounded-xl overflow-hidden group cursor-default" style={{ width: 130, height: 88 }}>
                  <img src={p.src} alt={p.label} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <span className="absolute bottom-1.5 left-2 text-white/90 text-[10px] font-mono">{p.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Highlights grid */}
          <div className="grid grid-cols-2 gap-2 mb-5">
            {highlights.map(h => (
              <div key={h} className="flex items-center gap-2 text-xs text-[#1a3328]/70 bg-[#eee9df] rounded-lg px-3 py-2.5">
                <span className="text-[#c9a84c] font-bold text-sm leading-none">✓</span>
                {h}
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-2.5">
            <Link
              href={bookUrl}
              className="w-full py-4 bg-[#1a3328] text-[#f5f0e8] font-bold text-sm rounded-xl text-center hover:bg-[#0d1f1a] active:scale-[0.98] transition-all focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
            >
              View Full Details &amp; Book
            </Link>
            <a
              href={`https://wa.me/918828352311?text=${waText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 border-2 border-[#4caf6e] text-[#1a7a40] font-semibold text-sm rounded-xl text-center hover:bg-[#4caf6e] hover:text-white active:scale-[0.98] transition-all focus:outline-none focus:ring-2 focus:ring-[#4caf6e]"
            >
              💬 Reserve via WhatsApp
            </a>
            <button
              onClick={onClose}
              className="w-full py-2.5 text-[#1a3328]/45 text-xs font-mono hover:text-[#1a3328]/70 transition-colors"
            >
              ← Back to reception
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   PHASE 3 — INTERIOR  (fully scrollable reception)
───────────────────────────────────────────────────────────── */
function InteriorScreen({ properties, onClose }: { properties: ManorProperty[]; onClose: () => void }) {
  const [mounted, setMounted]             = useState(false);
  const [selectedProp, setSelectedProp]   = useState<ManorProperty | null>(null);

  useEffect(() => { const t = setTimeout(() => setMounted(true), 80); return () => clearTimeout(t); }, []);

  const prop1 = properties.find(p => p.id === "1") ?? properties[0];
  const prop2 = properties.find(p => p.id === "2") ?? properties[properties.length - 1];

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-[9990] overflow-y-auto transition-opacity duration-700",
          mounted ? "opacity-100" : "opacity-0",
        )}
        style={{ background: "linear-gradient(180deg,#130d05 0%,#1e1409 60%,#2a1c0e 100%)" }}
        role="dialog"
        aria-modal="true"
        aria-label="The Mehmaan Manor reception"
      >
        {/* ── Ceiling light ── */}
        <div
          className="sticky top-0 z-20 w-full flex items-end justify-center pb-2 pointer-events-none"
          style={{ height: "clamp(36px,5vh,60px)", background: "linear-gradient(180deg,#0a0602 0%,#1e1409 100%)" }}
        >
          {/* Chandelier drop */}
          <div className="flex flex-col items-center">
            <div className="w-px bg-[#c9a84c]/30" style={{ height: "clamp(8px,2vw,18px)" }} />
            <div className="w-12 h-0.5 bg-[#c9a84c]/25 rounded-full" />
            <div className="mt-0.5 w-5 h-4 rounded-full bg-[#c9a84c]/15 border border-[#c9a84c]/25 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-[#fff8d0]/60" style={{ boxShadow: "0 0 10px 5px rgba(255,240,150,0.5)" }} />
            </div>
          </div>
        </div>

        {/* ── Scene heading ── */}
        <div className="text-center pt-6 pb-2 px-4">
          <p className="text-[#c9a84c]/50 text-[10px] font-mono tracking-[0.3em] uppercase">Reception</p>
          <h2 className="font-display text-white/90 text-xl md:text-2xl mt-1" style={{ letterSpacing: "0.03em" }}>
            The Mehmaan Manor
          </h2>
          <p className="text-[#c9a84c]/40 text-xs font-mono mt-1">
            Explore our homes below · click any room to open details
          </p>
        </div>

        {/* ══════════════════════════════════════════
            SECTION A — PROPERTY WALLS
        ══════════════════════════════════════════ */}
        <section className="px-4 md:px-8 pt-6 pb-2 max-w-4xl mx-auto w-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-[#c9a84c]/15" />
            <span className="text-[#c9a84c]/50 text-[9px] font-mono tracking-widest uppercase">Our Properties</span>
            <div className="h-px flex-1 bg-[#c9a84c]/15" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <PropertyCard prop={prop1} onSelect={() => setSelectedProp(prop1)} />
            <PropertyCard prop={prop2} onSelect={() => setSelectedProp(prop2)} />
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SECTION B — RECEPTION DESK
        ══════════════════════════════════════════ */}
        <section className="px-4 md:px-8 pt-6 pb-2 max-w-2xl mx-auto w-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-[#c9a84c]/15" />
            <span className="text-[#c9a84c]/50 text-[9px] font-mono tracking-widest uppercase">Reception Desk</span>
            <div className="h-px flex-1 bg-[#c9a84c]/15" />
          </div>

          <ReceptionDesk />
        </section>

        {/* ══════════════════════════════════════════
            SECTION C — INFO BOARDS
        ══════════════════════════════════════════ */}
        <section className="px-4 md:px-8 pt-6 pb-10 max-w-4xl mx-auto w-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-[#c9a84c]/15" />
            <span className="text-[#c9a84c]/50 text-[9px] font-mono tracking-widest uppercase">The Notice Board</span>
            <div className="h-px flex-1 bg-[#c9a84c]/15" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <HowItWorksBoard />
            <GuestReviewsBoard />
            <HostsBoard />
          </div>
        </section>

        {/* ── Footer hint ── */}
        <div
          className="sticky bottom-0 w-full py-3 px-4 text-center z-20"
          style={{ background: "linear-gradient(0deg,rgba(10,6,2,0.96) 0%,rgba(10,6,2,0.5) 100%)" }}
        >
          <p className="text-[#c9a84c]/40 text-[10px] font-mono tracking-widest">
            Tap any property card to explore details &amp; book
          </p>
        </div>

        <ExitBtn onClick={onClose} />
      </div>

      {/* Property detail modal */}
      {selectedProp && (
        <PropertyModal prop={selectedProp} onClose={() => setSelectedProp(null)} />
      )}
    </>
  );
}

/* ── Property card (inside reception) ───────────────────────── */
function PropertyCard({ prop, onSelect }: { prop: ManorProperty; onSelect: () => void }) {
  const isP1 = prop.id === "1";

  const heroSrc = isP1
    ? "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80&auto=format&fit=crop"
    : "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80&auto=format&fit=crop";

  const tag   = isP1 ? "Sector 57" : "Sector 39";
  const perks = isP1
    ? ["3 guests max", "Balcony", "Wi-Fi + Netflix", "Power Backup"]
    : ["5 guests max", "Studio & 2BHK", "Near Medanta", "Metro Nearby"];

  return (
    <button
      onClick={onSelect}
      className="group text-left w-full rounded-2xl overflow-hidden border border-[#c9a84c]/15 hover:border-[#c9a84c]/50 focus:outline-none focus:ring-2 focus:ring-[#c9a84c] transition-all duration-400"
      style={{
        background: "linear-gradient(135deg,#1e1409 0%,#2a1c0e 100%)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
      }}
      aria-label={`Explore ${prop.name} — from ₹${prop.baseRate.toLocaleString("en-IN")} per night`}
    >
      {/* Photo */}
      <div className="relative overflow-hidden" style={{ height: "clamp(140px,22vw,200px)" }}>
        <img
          src={heroSrc}
          alt={prop.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1e1409] via-transparent to-transparent" />

        {/* Location badge */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#1a3328]/85 backdrop-blur-sm border border-[#c9a84c]/25">
          <span className="text-[#c9a84c] text-[10px] font-mono tracking-widest uppercase">{tag}</span>
        </div>

        {/* Explore hint on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="px-4 py-2 rounded-full bg-[#c9a84c] text-[#1a0a00] font-bold text-xs">
            Tap to Explore →
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-display text-[#f5f0e8]/95 text-base leading-tight pr-2">
          {prop.name.replace("The Mehmaan Manor — ", "")}
        </h3>
        <p className="text-[#f5f0e8]/40 text-[11px] mt-1 leading-snug line-clamp-1">{prop.address}</p>

        {/* Price */}
        <div className="flex items-baseline gap-1 mt-3 pb-3 border-b border-[#c9a84c]/10">
          <span className="font-display text-2xl text-[#c9a84c] font-semibold">
            ₹{prop.baseRate.toLocaleString("en-IN")}
          </span>
          <span className="text-[#f5f0e8]/35 text-xs">/night</span>
        </div>

        {/* Perks */}
        <div className="grid grid-cols-2 gap-1.5 mt-3">
          {perks.map(p => (
            <span key={p} className="flex items-center gap-1.5 text-[#f5f0e8]/55 text-[11px]">
              <span className="text-[#c9a84c] text-[9px] flex-shrink-0">◆</span>
              {p}
            </span>
          ))}
        </div>

        {/* CTA row */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-[#c9a84c] text-xs font-mono group-hover:underline">
            View details &amp; book →
          </span>
          <span className="text-[#c9a84c]/30 text-[10px] font-mono">Click to open</span>
        </div>
      </div>
    </button>
  );
}

/* ── Reception desk ─────────────────────────────────────────── */
function ReceptionDesk() {
  return (
    <div
      className="rounded-2xl border border-[#c9a84c]/20 overflow-hidden"
      style={{ background: "linear-gradient(135deg,#1e1409 0%,#2a1c0e 100%)", boxShadow: "0 4px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(201,168,76,0.12)" }}
    >
      {/* Desk surface header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#c9a84c]/12">
        <div>
          <p className="text-[#c9a84c] text-[9px] font-mono tracking-[0.3em] uppercase">Reception</p>
          <p className="font-display text-[#f5f0e8]/90 text-lg mt-0.5">The Mehmaan Manor</p>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-2xl select-none">⌂</span>
          <span className="text-[#c9a84c]/50 text-[9px] font-mono">Gurugram</span>
        </div>
      </div>

      {/* Booking options */}
      <div className="p-5">
        <p className="text-[#f5f0e8]/55 text-xs leading-relaxed mb-5">
          Ready to book your stay? Choose how you'd like to proceed:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Book directly */}
          <Link
            href="/book"
            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-[#c9a84c]/20 bg-[#c9a84c]/5 hover:bg-[#c9a84c]/12 hover:border-[#c9a84c]/50 transition-all group focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
          >
            <span className="text-2xl select-none group-hover:scale-110 transition-transform duration-200">📅</span>
            <span className="text-[#c9a84c] font-bold text-sm">Book Directly</span>
            <span className="text-[#f5f0e8]/40 text-[10px] text-center">Online booking · Instant confirm</span>
          </Link>

          {/* WhatsApp */}
          <a
            href="https://wa.me/918828352311?text=Hi%21%20I'd%20like%20to%20book%20a%20stay%20at%20The%20Mehmaan%20Manor."
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-[#25d366]/20 bg-[#25d366]/5 hover:bg-[#25d366]/12 hover:border-[#25d366]/50 transition-all group focus:outline-none focus:ring-2 focus:ring-[#25d366]"
          >
            <span className="text-2xl select-none group-hover:scale-110 transition-transform duration-200">💬</span>
            <span className="text-[#4caf6e] font-bold text-sm">WhatsApp Simran</span>
            <span className="text-[#f5f0e8]/40 text-[10px] text-center">Responds in &lt;5 min</span>
          </a>

          {/* Browse homes */}
          <Link
            href="/homes"
            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-[#f5f0e8]/10 bg-[#f5f0e8]/3 hover:bg-[#f5f0e8]/8 hover:border-[#f5f0e8]/25 transition-all group focus:outline-none focus:ring-2 focus:ring-white/40"
          >
            <span className="text-2xl select-none group-hover:scale-110 transition-transform duration-200">🏠</span>
            <span className="text-[#f5f0e8]/80 font-bold text-sm">Browse Homes</span>
            <span className="text-[#f5f0e8]/40 text-[10px] text-center">See both properties</span>
          </Link>
        </div>

        {/* Trust strip */}
        <div className="mt-5 pt-4 border-t border-[#c9a84c]/10 flex flex-wrap items-center justify-center gap-4 gap-y-2">
          {[
            { icon: "✓", label: "No booking fees" },
            { icon: "✓", label: "Free cancellation" },
            { icon: "✓", label: "Direct with host" },
          ].map(b => (
            <span key={b.label} className="flex items-center gap-1.5 text-[#f5f0e8]/35 text-[11px]">
              <span className="text-[#c9a84c]/60 font-bold">{b.icon}</span>
              {b.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── How it Works board ─────────────────────────────────────── */
function HowItWorksBoard() {
  const steps = [
    { n: "01", title: "Browse",  desc: "Explore both Gurugram homes and pick your favourite." },
    { n: "02", title: "Book",    desc: "Reserve directly — no fees, no middlemen." },
    { n: "03", title: "Arrive",  desc: "Check in and feel at home. Simran & Jyoti handle the rest." },
  ];

  return (
    <div
      className="rounded-2xl border border-[#c9a84c]/15 p-5 flex flex-col gap-4 h-full"
      style={{ background: "linear-gradient(135deg,#16100a 0%,#211507 100%)", boxShadow: "inset 0 1px 0 rgba(201,168,76,0.08)" }}
    >
      <p className="text-[#c9a84c] text-[9px] font-mono tracking-[0.3em] uppercase text-center">How It Works</p>

      <div className="flex flex-col gap-4">
        {steps.map((s, i) => (
          <div key={s.n} className="flex items-start gap-3">
            <span
              className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-mono font-bold text-[#c9a84c] border border-[#c9a84c]/25"
              style={{ background: "rgba(201,168,76,0.08)" }}
            >
              {s.n}
            </span>
            <div className="pt-0.5">
              <p className="text-[#f5f0e8]/85 text-sm font-semibold leading-tight">{s.title}</p>
              <p className="text-[#f5f0e8]/40 text-[11px] leading-relaxed mt-0.5">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Guest Reviews board ────────────────────────────────────── */
function GuestReviewsBoard() {
  const reviews = [
    { name: "Priya M.", stars: 5, text: "Felt like home from day one. Simran's hospitality is unmatched!", location: "Delhi" },
    { name: "Rahul S.", stars: 5, text: "Perfect for work trips. Fast Wi-Fi, clean rooms, no fuss.", location: "Mumbai" },
    { name: "Anita K.", stars: 5, text: "The Sector 39 apartment is brilliant for families. We'll be back!", location: "Bengaluru" },
  ];

  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % reviews.length), 4000);
    return () => clearInterval(t);
  }, [reviews.length]);

  const r = reviews[idx];

  return (
    <div
      className="rounded-2xl border border-[#c9a84c]/15 p-5 flex flex-col gap-3 h-full"
      style={{ background: "linear-gradient(135deg,#16100a 0%,#211507 100%)", boxShadow: "inset 0 1px 0 rgba(201,168,76,0.08)" }}
    >
      <p className="text-[#c9a84c] text-[9px] font-mono tracking-[0.3em] uppercase text-center">Guest Reviews</p>

      {/* Stars */}
      <div className="flex items-center justify-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className="text-[#c9a84c] text-sm">★</span>
        ))}
        <span className="text-[#f5f0e8]/40 text-xs font-mono ml-2">4.9 / 5</span>
      </div>

      {/* Review card — auto-cycles */}
      <div key={idx} className="flex-1 flex flex-col justify-between manor-pop-in">
        <blockquote className="text-[#f5f0e8]/75 text-xs leading-relaxed italic">
          &ldquo;{r.text}&rdquo;
        </blockquote>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#c9a84c]/10">
          <div>
            <p className="text-[#f5f0e8]/80 text-xs font-semibold">{r.name}</p>
            <p className="text-[#c9a84c]/50 text-[10px] font-mono">{r.location}</p>
          </div>
          <div className="flex gap-1">
            {reviews.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                aria-label={`Review ${i + 1}`}
                className={cn(
                  "rounded-full transition-all",
                  i === idx ? "w-4 h-1.5 bg-[#c9a84c]" : "w-1.5 h-1.5 bg-[#c9a84c]/25",
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Hosts board ────────────────────────────────────────────── */
function HostsBoard() {
  const hosts = [
    { name: "Simran",  role: "Host & Manager", emoji: "👩‍💼", quote: "We treat every guest like family — because that's what Mehmaan means.", phone: "+91 88283 52311" },
    { name: "Jyoti",   role: "Host & Support",  emoji: "👩‍🍳", quote: "From check-in to check-out, we're always just a message away.", phone: "+91 87965 68002" },
  ];

  return (
    <div
      className="rounded-2xl border border-[#c9a84c]/15 p-5 flex flex-col gap-4 h-full"
      style={{ background: "linear-gradient(135deg,#16100a 0%,#211507 100%)", boxShadow: "inset 0 1px 0 rgba(201,168,76,0.08)" }}
    >
      <p className="text-[#c9a84c] text-[9px] font-mono tracking-[0.3em] uppercase text-center">Meet Your Hosts</p>

      <div className="flex flex-col gap-4">
        {hosts.map(h => (
          <div key={h.name} className="flex items-start gap-3">
            <div
              className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-xl border border-[#c9a84c]/20"
              style={{ background: "rgba(201,168,76,0.08)" }}
            >
              {h.emoji}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-[#f5f0e8]/90 text-sm font-semibold">{h.name}</p>
                <span className="text-[#c9a84c]/50 text-[9px] font-mono">{h.role}</span>
              </div>
              <p className="text-[#f5f0e8]/40 text-[11px] leading-relaxed mt-0.5 italic">&ldquo;{h.quote}&rdquo;</p>
              <a
                href={`tel:${h.phone.replace(/\s/g, "")}`}
                className="mt-1 inline-flex items-center gap-1 text-[#c9a84c]/60 text-[10px] font-mono hover:text-[#c9a84c] transition-colors"
              >
                📞 {h.phone}
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Response badge */}
      <div className="flex items-center justify-center gap-2 pt-3 border-t border-[#c9a84c]/10">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4caf6e] opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#4caf6e]" />
        </span>
        <p className="text-[#f5f0e8]/40 text-[10px] font-mono">Responds within 5 minutes</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   ROOT EXPORT
───────────────────────────────────────────────────────────── */
export function ManorExperience({ properties }: { properties: ManorProperty[] }) {
  const [phase, setPhase] = useState<Phase>("idle");

  const start = useCallback(() => {
    document.body.style.overflow = "hidden";
    setPhase("intro");
  }, []);

  const exit = useCallback(() => {
    document.body.style.overflow = "";
    setPhase("idle");
  }, []);

  useEffect(() => () => { document.body.style.overflow = ""; }, []);

  return (
    <>
      {/* ── Trigger button (idle state only) ── */}
      {phase === "idle" && (
        <button
          onClick={start}
          aria-label="Start the interactive Enter the Manor Experience"
          className="manor-experience-btn group inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 select-none focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:ring-offset-2 focus:ring-offset-transparent"
        >
          <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c9a84c] opacity-55" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#c9a84c]" />
          </span>
          Enter the Manor Experience
          <span className="group-hover:translate-x-1 transition-transform duration-200" aria-hidden="true">→</span>
        </button>
      )}

      {phase === "intro"    && <IntroScreen    onDone={() => setPhase("exterior")} />}
      {phase === "exterior" && <ExteriorScreen onEnter={() => setPhase("entering")} onClose={exit} />}
      {phase === "entering" && <EnterTransition onDone={() => setPhase("interior")} />}
      {phase === "interior" && <InteriorScreen  properties={properties} onClose={exit} />}
    </>
  );
}
