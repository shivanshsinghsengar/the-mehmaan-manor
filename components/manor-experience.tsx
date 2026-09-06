"use client";

/**
 * ManorExperience — "Enter the Manor Experience"
 *
 * Phase 0: Hidden (not started)
 * Phase 1: Intro text — "The Mehmaan Manor" + "Feel like Mehmaan" fade in/out
 * Phase 2: Exterior — first-person view of the building, click to enter
 * Phase 3: Interior — reception area with two property walls, desk, info boards
 */

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

/* ─── Types ──────────────────────────────────────────────────────── */
type Phase = "idle" | "intro" | "exterior" | "entering" | "interior";

interface Property {
  id: string;
  name: string;
  slug: string;
  baseRate: number;
  address: string;
}

/* ─── Small helpers ──────────────────────────────────────────────── */
function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

/* ─── Close button (reused throughout) ──────────────────────────── */
function CloseBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Exit experience"
      className="fixed top-4 right-4 z-[9999] flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm text-white/80 hover:text-white hover:bg-black/60 text-xs font-mono transition-all select-none"
    >
      <span className="text-base leading-none">×</span>
      Exit
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   PHASE 1 — INTRO TEXT
═══════════════════════════════════════════════════════════════════ */
function IntroScreen({ onDone }: { onDone: () => void }) {
  const [stage, setStage] = useState<"in" | "hold" | "out">("in");
  const [line, setLine] = useState(0); // 0 = first line, 1 = second line

  useEffect(() => {
    // Sequence: line 0 fades in → hold → fades out → line 1 fades in → hold → fades out → done
    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(setTimeout(() => setStage("hold"), 900));
    timers.push(setTimeout(() => setStage("out"), 2200));
    timers.push(setTimeout(() => { setLine(1); setStage("in"); }, 3000));
    timers.push(setTimeout(() => setStage("hold"), 3900));
    timers.push(setTimeout(() => setStage("out"), 5200));
    timers.push(setTimeout(() => onDone(), 6000));

    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  const lineTexts = ["The Mehmaan Manor", "Feel like Mehmaan"];
  const subtexts = ["Gurugram · Haryana · India", "A home away from home."];

  return (
    <div
      className="fixed inset-0 z-[9990] flex flex-col items-center justify-center"
      style={{ background: "linear-gradient(135deg, #0d1f1a 0%, #1a3328 50%, #0a1510 100%)" }}
    >
      <div
        key={line}
        className={cn(
          "text-center px-6 manor-intro-text",
          stage === "in" && "manor-intro-fadein",
          stage === "hold" && "manor-intro-hold",
          stage === "out" && "manor-intro-fadeout",
        )}
      >
        {/* Gold ornament */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#c9a84c]" />
          <span className="text-[#c9a84c] text-lg">◆</span>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#c9a84c]" />
        </div>

        <h2
          className="font-display text-white font-light tracking-wide"
          style={{ fontSize: "clamp(2rem, 8vw, 4.5rem)", letterSpacing: "0.05em" }}
        >
          {lineTexts[line]}
        </h2>
        <p className="text-[#c9a84c]/80 font-mono text-sm tracking-[0.3em] uppercase mt-4">
          {subtexts[line]}
        </p>
      </div>

      {/* Subtle particle dots */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-[#c9a84c]/20"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              left: `${10 + i * 7}%`,
              top: `${20 + (i % 3) * 25}%`,
              animation: `manorFloat ${3 + (i % 3)}s ease-in-out ${i * 0.4}s infinite alternate`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   PHASE 2 — EXTERIOR (first-person building view)
═══════════════════════════════════════════════════════════════════ */
function ExteriorScreen({ onEnter, onClose }: { onEnter: () => void; onClose: () => void }) {
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[9990] overflow-hidden transition-opacity duration-700",
        visible ? "opacity-100" : "opacity-0",
      )}
      style={{ perspective: "900px" }}
    >
      {/* Sky background */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #b8d4e8 0%, #d4e8f2 35%, #e8f2e4 60%, #6b8f5e 100%)",
        }}
      />

      {/* Ground */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: "28%",
          background: "linear-gradient(180deg, #6b8f5e 0%, #4a6741 100%)",
        }}
      />
      {/* Path / driveway */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2"
        style={{
          width: "clamp(80px, 12vw, 140px)",
          height: "32%",
          background: "linear-gradient(180deg, #c4b89a 0%, #a8997c 100%)",
          clipPath: "polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)",
        }}
      />

      {/* Trees left & right */}
      <TreeGroup side="left" />
      <TreeGroup side="right" />

      {/* Building */}
      <button
        onClick={onEnter}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        aria-label="Enter the Manor"
        className="absolute left-1/2 -translate-x-1/2 bottom-[22%] focus:outline-none group"
        style={{
          width: "clamp(240px, 42vw, 520px)",
          transform: `translateX(-50%) scale(${hovered ? 1.02 : 1})`,
          transition: "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <BuildingSVG hovered={hovered} />

        {/* "Click to Enter" prompt */}
        <div
          className={cn(
            "absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap flex items-center gap-2 transition-all duration-400",
            hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
          )}
        >
          <span className="text-white/90 text-xs font-mono tracking-widest bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
            Click to Enter ↵
          </span>
        </div>

        {/* Always-visible subtle hint */}
        <div
          className={cn(
            "absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap transition-all duration-400",
            hovered ? "opacity-0" : "opacity-100",
          )}
        >
          <span className="text-[#1a3328]/70 text-[10px] font-mono tracking-widest">
            ↑ Step inside the Manor
          </span>
        </div>
      </button>

      {/* First-person ground line (horizon feel) */}
      <div
        className="absolute bottom-[28%] left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(74,103,65,0.6), transparent)" }}
      />

      {/* HUD: location tag */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full">
        <span className="text-white/60 text-[10px] font-mono tracking-widest uppercase">📍 Gurugram, Haryana</span>
      </div>

      <CloseBtn onClick={onClose} />
    </div>
  );
}

/* ── A simple SVG building illustration ─────────────────────────── */
function BuildingSVG({ hovered }: { hovered: boolean }) {
  return (
    <svg
      viewBox="0 0 520 380"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full drop-shadow-2xl"
      aria-hidden="true"
    >
      {/* Sky backdrop behind building */}
      <rect x="40" y="30" width="440" height="330" rx="4" fill="rgba(255,255,255,0.06)" />

      {/* Main building body */}
      <rect x="60" y="60" width="400" height="310" rx="3" fill="#e8e0d0" />
      <rect x="60" y="60" width="400" height="310" rx="3" stroke="#c4b89a" strokeWidth="1.5" />

      {/* Facade texture — horizontal lines */}
      {[110, 160, 210, 260, 310, 360].map((y) => (
        <line key={y} x1="60" y1={y} x2="460" y2={y} stroke="#c4b89a" strokeWidth="0.8" strokeDasharray="0" />
      ))}

      {/* Roof parapet */}
      <rect x="50" y="45" width="420" height="22" rx="3" fill="#d4c8a8" stroke="#b8a882" strokeWidth="1.5" />
      {/* Parapet ornament slots */}
      {[80, 130, 180, 230, 280, 330, 380, 430].map((x) => (
        <rect key={x} x={x} y="47" width="14" height="10" rx="1" fill="#b8a882" />
      ))}

      {/* Central arch entrance */}
      <rect x="215" y="270" width="90" height="100" rx="2" fill="#1a3328" />
      <ellipse cx="260" cy="270" rx="45" ry="22" fill="#1a3328" />
      {/* Door frame gold */}
      <rect x="213" y="268" width="94" height="102" rx="3" fill="none" stroke="#c9a84c" strokeWidth="2" />
      <ellipse cx="260" cy="270" rx="47" ry="24" fill="none" stroke="#c9a84c" strokeWidth="2" />
      {/* Door panels */}
      <rect x="220" y="278" width="36" height="60" rx="1" fill="#0d1f1a" stroke="#c9a84c" strokeWidth="1" />
      <rect x="264" y="278" width="36" height="60" rx="1" fill="#0d1f1a" stroke="#c9a84c" strokeWidth="1" />
      {/* Door knobs */}
      <circle cx="254" cy="310" r="3" fill="#c9a84c" />
      <circle cx="266" cy="310" r="3" fill="#c9a84c" />

      {/* Signboard above door */}
      <rect x="195" y="243" width="130" height="22" rx="3" fill="#1a3328" stroke="#c9a84c" strokeWidth="1.5" />
      <text x="260" y="258" textAnchor="middle" fill="#c9a84c" fontSize="8" fontFamily="serif" letterSpacing="2">
        THE MEHMAAN MANOR
      </text>

      {/* Windows — Row 1 */}
      {[85, 170, 310, 395].map((x) => (
        <g key={x}>
          <rect x={x} y="80" width="55" height="65" rx="2" fill={hovered ? "#f5e8c8" : "#d4c4a0"} stroke="#b8a882" strokeWidth="1.5" />
          <rect x={x} y="80" width="55" height="65" rx="2" fill="none" stroke="#c9a84c" strokeWidth="0.8" />
          {/* Window panes */}
          <line x1={x + 27} y1="80" x2={x + 27} y2={145} stroke="#b8a882" strokeWidth="0.8" />
          <line x1={x} y1="112" x2={x + 55} y2="112" stroke="#b8a882" strokeWidth="0.8" />
          {hovered && <rect x={x} y="80" width="55" height="65" rx="2" fill="rgba(255,240,180,0.3)" />}
        </g>
      ))}

      {/* Windows — Row 2 */}
      {[85, 170, 310, 395].map((x) => (
        <g key={`r2-${x}`}>
          <rect x={x} y="165" width="55" height="65" rx="2" fill={hovered ? "#f5e8c8" : "#d4c4a0"} stroke="#b8a882" strokeWidth="1.5" />
          <line x1={x + 27} y1="165" x2={x + 27} y2={230} stroke="#b8a882" strokeWidth="0.8" />
          <line x1={x} y1="197" x2={x + 55} y2="197" stroke="#b8a882" strokeWidth="0.8" />
          {hovered && <rect x={x} y="165" width="55" height="65" rx="2" fill="rgba(255,240,180,0.3)" />}
        </g>
      ))}

      {/* Side windows — Row 3 */}
      {[85, 170, 310, 395].map((x) => (
        <g key={`r3-${x}`}>
          <rect x={x} y="250" width="55" height="50" rx="2" fill={hovered ? "#e8d090" : "#c4b890"} stroke="#b8a882" strokeWidth="1.5" />
          <line x1={x + 27} y1="250" x2={x + 27} y2={300} stroke="#b8a882" strokeWidth="0.8" />
          {hovered && <rect x={x} y="250" width="55" height="50" rx="2" fill="rgba(255,240,180,0.25)" />}
        </g>
      ))}

      {/* Steps */}
      <rect x="200" y="368" width="120" height="8" rx="1" fill="#c4b89a" />
      <rect x="210" y="360" width="100" height="8" rx="1" fill="#d4c8a8" />

      {/* Hover glow */}
      {hovered && (
        <rect x="60" y="60" width="400" height="310" rx="3" fill="rgba(201,168,76,0.06)" />
      )}
    </svg>
  );
}

/* ── Decorative trees ────────────────────────────────────────────── */
function TreeGroup({ side }: { side: "left" | "right" }) {
  const isLeft = side === "left";
  const trees = [
    { x: isLeft ? "8%" : "88%", size: 1.0 },
    { x: isLeft ? "15%" : "80%", size: 1.3 },
    { x: isLeft ? "4%" : "93%", size: 0.85 },
  ];

  return (
    <>
      {trees.map((t, i) => (
        <div
          key={i}
          className="absolute bottom-[22%]"
          style={{
            left: t.x,
            transform: "translateX(-50%)",
            width: `clamp(${Math.round(t.size * 28)}px, ${t.size * 5}vw, ${Math.round(t.size * 60)}px)`,
          }}
        >
          {/* Trunk */}
          <div
            className="mx-auto"
            style={{
              width: "18%",
              height: `clamp(${Math.round(t.size * 20)}px, ${t.size * 3}vw, ${Math.round(t.size * 40)}px)`,
              background: "#5c4033",
              borderRadius: "2px",
            }}
          />
          {/* Foliage — layered circles */}
          {[1.0, 0.75, 0.55].map((scale, j) => (
            <div
              key={j}
              className="rounded-full mx-auto"
              style={{
                width: `${scale * 100}%`,
                height: `clamp(${Math.round(t.size * scale * 30)}px, ${t.size * scale * 4.5}vw, ${Math.round(t.size * scale * 65)}px)`,
                marginTop: j === 0 ? 0 : `-${Math.round(scale * 30)}%`,
                background: j === 0 ? "#3d6b35" : j === 1 ? "#4a7d40" : "#55914a",
              }}
            />
          ))}
        </div>
      ))}
    </>
  );
}

/* ─── Enter transition ───────────────────────────────────────────── */
function EnterTransition({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1400);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-[9991] manor-enter-zoom">
      <div className="absolute inset-0 bg-[#1a3328]" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-[#c9a84c]/60 text-xs font-mono tracking-widest animate-pulse">
          Entering…
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   PHASE 3 — INTERIOR (Reception)
═══════════════════════════════════════════════════════════════════ */

/* ── Property Detail Modal ─────────────────────────────────────── */
function PropertyModal({
  property,
  onClose,
}: {
  property: Property;
  onClose: () => void;
}) {
  const bookUrl = `/homes/${property.slug}`;
  const isP1 = property.id === "1";

  const highlights = isP1
    ? ["Sector 57, Gurugram", "Max 3 guests", "Wi-Fi + Netflix", "Balcony", "24h Power Backup"]
    : ["Sector 39, Gurugram", "Max 5 guests", "Studio & 2BHK", "Near Medanta", "Metro Nearby"];

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="relative bg-[#faf8f4] rounded-2xl max-w-md w-full p-6 shadow-2xl manor-pop-in overflow-y-auto"
        style={{ maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gold header strip */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#c9a84c] via-[#e8d080] to-[#c9a84c] rounded-t-2xl" />

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-ink/40 hover:text-ink text-lg leading-none w-7 h-7 flex items-center justify-center rounded-full hover:bg-ink/10 transition-colors"
          aria-label="Close"
        >×</button>

        <div className="mb-4">
          <span className="text-[10px] font-mono tracking-widest text-[#c9a84c] uppercase">Our Property</span>
          <h3 className="font-display text-xl text-[#1a3328] mt-1 leading-tight">{property.name}</h3>
          <p className="text-ink/55 text-xs mt-1">{property.address}</p>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1 mb-5 pb-4 border-b border-ink/8">
          <span className="font-display text-3xl text-[#1a3328] font-semibold">
            ₹{property.baseRate.toLocaleString("en-IN")}
          </span>
          <span className="text-ink/50 text-sm">/night</span>
        </div>

        {/* Highlights */}
        <div className="grid grid-cols-2 gap-2 mb-5">
          {highlights.map((h) => (
            <div
              key={h}
              className="flex items-center gap-1.5 text-xs text-ink/70 bg-[#eee9df] rounded-lg px-2.5 py-2"
            >
              <span className="text-[#c9a84c]">✓</span> {h}
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-2">
          <Link
            href={bookUrl}
            className="w-full py-3.5 bg-[#1a3328] text-[#f5f0e8] font-semibold text-sm rounded-xl text-center hover:bg-[#0d1f1a] transition-colors"
          >
            View Full Details & Book
          </Link>
          <a
            href="https://wa.me/918828352311"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 border-2 border-[#4caf6e] text-[#2d7a4a] font-semibold text-sm rounded-xl text-center hover:bg-[#edf7f1] transition-colors"
          >
            💬 Reserve via WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

/* ── Interior scene ─────────────────────────────────────────────── */
function InteriorScreen({
  properties,
  onClose,
}: {
  properties: Property[];
  onClose: () => void;
}) {
  const [visible, setVisible] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [activePanel, setActivePanel] = useState<"none" | "left" | "right" | "desk">("none");

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const prop1 = properties.find((p) => p.id === "1") ?? properties[0];
  const prop2 = properties.find((p) => p.id === "2") ?? properties[1];

  const howItWorks = [
    { step: "01", title: "Browse", desc: "Explore our two Gurugram homes and pick your favourite." },
    { step: "02", title: "Book", desc: "Reserve directly — no hidden fees, no booking platforms." },
    { step: "03", title: "Arrive", desc: "Check in, feel at home. Simran & Jyoti will take care of everything." },
  ];

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-[9990] overflow-y-auto overflow-x-hidden transition-opacity duration-600",
          visible ? "opacity-100" : "opacity-0",
        )}
        style={{ background: "linear-gradient(180deg, #1e1208 0%, #2a1c0e 100%)" }}
      >
        {/* ── Ceiling ── */}
        <div
          className="sticky top-0 w-full z-10 pointer-events-none"
          style={{
            height: "clamp(32px, 5vw, 64px)",
            background: "linear-gradient(180deg, #0d0a06 0%, #1e1208 100%)",
          }}
        />

        {/* ── Room container ── */}
        <div className="relative w-full" style={{ minHeight: "calc(100vh - 64px)" }}>

          {/* Floor */}
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: "18%",
              background: "repeating-linear-gradient(90deg, #3d2b1a 0px, #3d2b1a 60px, #4a3522 60px, #4a3522 120px)",
              opacity: 0.9,
            }}
          />
          {/* Floor shine */}
          <div
            className="absolute bottom-0 left-0 right-0 pointer-events-none"
            style={{ height: "18%", background: "linear-gradient(0deg, rgba(201,168,76,0.08), transparent)" }}
          />

          {/* ── Back wall ── */}
          <div
            className="absolute top-0 left-0 right-0"
            style={{
              bottom: "18%",
              background: "linear-gradient(180deg, #2a1c0e 0%, #3d2b1a 100%)",
            }}
          />

          {/* ── Wall panels (decorative) ── */}
          {/* Left wall panel border */}
          <div
            className="absolute top-[5%] left-0 border-r border-[#c9a84c]/15"
            style={{ width: "32%", bottom: "18%", background: "rgba(201,168,76,0.03)" }}
          />
          {/* Right wall panel border */}
          <div
            className="absolute top-[5%] right-0 border-l border-[#c9a84c]/15"
            style={{ width: "32%", bottom: "18%", background: "rgba(201,168,76,0.03)" }}
          />

          {/* ── Chandelier ── */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
            <div className="w-px bg-[#c9a84c]/40" style={{ height: "clamp(20px, 4vw, 40px)" }} />
            <div className="w-16 h-1 bg-[#c9a84c]/30 rounded-full" />
            <div className="mt-1 w-8 h-6 rounded-full bg-[#c9a84c]/20 border border-[#c9a84c]/30 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-[#ffe8a0]/70" style={{ boxShadow: "0 0 12px 6px rgba(255,240,160,0.4)" }} />
            </div>
          </div>

          {/* ════ LEFT WALL — Property 1 ════ */}
          <PropertyWall
            side="left"
            property={prop1}
            isActive={activePanel === "left"}
            onClick={() => {
              setActivePanel("left");
              setSelectedProperty(prop1);
            }}
          />

          {/* ════ RIGHT WALL — Property 2 ════ */}
          <PropertyWall
            side="right"
            property={prop2}
            isActive={activePanel === "right"}
            onClick={() => {
              setActivePanel("right");
              setSelectedProperty(prop2);
            }}
          />

          {/* ════ CENTER — Reception desk + info boards ════ */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-[16%] w-[36%] min-w-[200px] max-w-[360px]">

            {/* Reception desk */}
            <button
              onClick={() => setActivePanel(activePanel === "desk" ? "none" : "desk")}
              className={cn(
                "w-full text-left rounded-xl border transition-all duration-300 overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#c9a84c]",
                activePanel === "desk"
                  ? "border-[#c9a84c]/70 bg-[#3d2b1a] shadow-[0_0_30px_rgba(201,168,76,0.25)]"
                  : "border-[#c9a84c]/20 bg-[#2a1c0e] hover:border-[#c9a84c]/50",
              )}
              aria-expanded={activePanel === "desk"}
              aria-label="Reception desk — Book now"
            >
              {/* Desk top */}
              <div className="px-4 py-3 border-b border-[#c9a84c]/15 flex items-center justify-between">
                <div>
                  <p className="text-[#c9a84c] text-[9px] font-mono tracking-widest uppercase">Reception</p>
                  <p className="text-[#f5f0e8]/90 text-sm font-display mt-0.5">The Mehmaan Manor</p>
                </div>
                <span className="text-[#c9a84c] text-lg">⌂</span>
              </div>
              <div className="px-4 py-2.5">
                <span className="text-[#c9a84c] text-xs font-mono">
                  {activePanel === "desk" ? "▲ Close" : "▼ Book Now / Inquire"}
                </span>
              </div>
            </button>

            {/* Expanded desk panel */}
            {activePanel === "desk" && (
              <div className="mt-2 bg-[#2a1c0e] border border-[#c9a84c]/25 rounded-xl p-4 manor-pop-in">
                <p className="text-[#f5f0e8]/70 text-xs mb-3 leading-relaxed">
                  Ready to stay? Browse our homes or reach us directly.
                </p>
                <div className="flex flex-col gap-2">
                  <Link
                    href="/homes"
                    className="w-full py-2.5 bg-[#c9a84c] text-[#1a0a00] font-bold text-xs rounded-lg text-center hover:bg-[#e8d080] transition-colors"
                  >
                    🏠 Browse Our Homes
                  </Link>
                  <Link
                    href="/book"
                    className="w-full py-2.5 bg-[#1a3328] text-[#f5f0e8] font-semibold text-xs rounded-lg text-center hover:bg-[#0d1f1a] transition-colors border border-[#c9a84c]/20"
                  >
                    📅 Book Directly
                  </Link>
                  <a
                    href="https://wa.me/918828352311"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-[#25d366]/10 border border-[#25d366]/30 text-[#4caf6e] font-semibold text-xs rounded-lg text-center hover:bg-[#25d366]/20 transition-colors"
                  >
                    💬 WhatsApp Simran
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* ════ INFO BOARDS ROW ════ */}
          <div className="absolute bottom-[52%] left-1/2 -translate-x-1/2 w-full px-[34%] min-w-[280px]">
            <div className="flex gap-2 justify-center">

              {/* How it Works board */}
              <HowItWorksBoard steps={howItWorks} />

              {/* Hosts board */}
              <HostsBoard />
            </div>
          </div>

        </div>

        {/* ── Footer strip ── */}
        <div
          className="sticky bottom-0 w-full flex items-center justify-center gap-4 py-3 px-4"
          style={{ background: "linear-gradient(0deg, rgba(13,10,6,0.98) 0%, rgba(13,10,6,0.6) 100%)" }}
        >
          <p className="text-[#c9a84c]/50 text-[10px] font-mono tracking-widest">
            Click either property wall to explore · Click reception to book
          </p>
        </div>

        <CloseBtn onClick={onClose} />
      </div>

      {/* Property modal */}
      {selectedProperty && (
        <PropertyModal
          property={selectedProperty}
          onClose={() => { setSelectedProperty(null); setActivePanel("none"); }}
        />
      )}
    </>
  );
}

/* ── Property wall card ─────────────────────────────────────────── */
function PropertyWall({
  side,
  property,
  isActive,
  onClick,
}: {
  side: "left" | "right";
  property: Property;
  isActive: boolean;
  onClick: () => void;
}) {
  const isLeft = side === "left";
  const isP1 = property.id === "1";

  const photos = isP1
    ? [
        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=75&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=75&auto=format&fit=crop",
      ]
    : [
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&q=75&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=75&auto=format&fit=crop",
      ];

  const tag = isP1 ? "Sector 57" : "Sector 39";
  const perks = isP1
    ? ["Up to 3 guests", "Balcony", "Wi-Fi + Netflix"]
    : ["Up to 5 guests", "Studio & 2BHK", "Near Medanta"];

  return (
    <button
      onClick={onClick}
      className={cn(
        "absolute top-[8%] focus:outline-none focus:ring-2 focus:ring-[#c9a84c] transition-all duration-400",
        isLeft ? "left-[1%]" : "right-[1%]",
        isActive && "scale-[1.01]",
      )}
      style={{
        width: "30%",
        bottom: "19%",
        background: isActive
          ? "rgba(201,168,76,0.07)"
          : "rgba(201,168,76,0.02)",
        border: `1px solid ${isActive ? "rgba(201,168,76,0.5)" : "rgba(201,168,76,0.12)"}`,
        borderRadius: "8px",
        boxShadow: isActive ? "0 0 40px rgba(201,168,76,0.2) inset" : "none",
        transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
      aria-label={`Explore ${property.name}`}
      aria-pressed={isActive}
    >
      {/* Inner content */}
      <div className="absolute inset-0 flex flex-col p-3 overflow-hidden">

        {/* Label */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-[#c9a84c] text-[9px] font-mono tracking-widest uppercase">{tag}</span>
          {isActive && <span className="text-[#c9a84c] text-[9px] font-mono">← Click for details</span>}
        </div>

        {/* Photo frame */}
        <div className="flex-1 relative rounded-lg overflow-hidden border border-[#c9a84c]/15 min-h-0">
          {photos.map((src, i) => (
            <img
              key={src}
              src={src}
              alt={`${property.name} photo ${i + 1}`}
              loading="lazy"
              className={cn(
                "absolute inset-0 w-full h-full object-cover transition-opacity duration-800",
                i === 0 ? "opacity-100" : "opacity-0",
                isActive && i === 0 && "manor-wall-photo-fade",
              )}
            />
          ))}
          {/* Frame overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ border: "6px solid rgba(201,168,76,0.15)", borderRadius: "8px" }}
          />

          {/* Name & price overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-2">
            <p className="text-white/95 text-[10px] md:text-xs font-display leading-tight truncate">
              {property.name.replace("The Mehmaan Manor — ", "")}
            </p>
            <p className="text-[#c9a84c] text-[10px] font-mono mt-0.5">
              From ₹{property.baseRate.toLocaleString("en-IN")}/night
            </p>
          </div>
        </div>

        {/* Perks */}
        <div className="flex flex-col gap-1 mt-2">
          {perks.map((p) => (
            <span
              key={p}
              className="text-[#f5f0e8]/55 text-[9px] flex items-center gap-1"
            >
              <span className="text-[#c9a84c]/60 text-[8px]">◆</span>
              {p}
            </span>
          ))}
        </div>

        {/* "Tap to explore" hint */}
        <div
          className={cn(
            "mt-2 pt-2 border-t border-[#c9a84c]/10 text-center transition-opacity duration-300",
            isActive ? "opacity-0 h-0 overflow-hidden" : "opacity-70",
          )}
        >
          <span className="text-[#c9a84c]/60 text-[9px] font-mono">Tap to explore →</span>
        </div>
      </div>
    </button>
  );
}

/* ── How it Works small board ──────────────────────────────────── */
function HowItWorksBoard({
  steps,
}: {
  steps: { step: string; title: string; desc: string }[];
}) {
  return (
    <div
      className="bg-[#1a1008] border border-[#c9a84c]/20 rounded-xl p-3 flex-1 min-w-0"
      style={{ boxShadow: "inset 0 1px 0 rgba(201,168,76,0.1)" }}
    >
      <p className="text-[#c9a84c] text-[8px] font-mono tracking-widest uppercase mb-2 text-center">
        How It Works
      </p>
      <div className="space-y-2">
        {steps.map((s) => (
          <div key={s.step} className="flex items-start gap-2">
            <span className="text-[#c9a84c]/60 text-[10px] font-mono leading-tight flex-shrink-0 mt-0.5">
              {s.step}
            </span>
            <div>
              <p className="text-[#f5f0e8]/80 text-[10px] font-semibold leading-tight">{s.title}</p>
              <p className="text-[#f5f0e8]/40 text-[9px] leading-tight mt-0.5">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Hosts board ─────────────────────────────────────────────────── */
function HostsBoard() {
  return (
    <div
      className="bg-[#1a1008] border border-[#c9a84c]/20 rounded-xl p-3 flex-1 min-w-0"
      style={{ boxShadow: "inset 0 1px 0 rgba(201,168,76,0.1)" }}
    >
      <p className="text-[#c9a84c] text-[8px] font-mono tracking-widest uppercase mb-2 text-center">
        Your Hosts
      </p>
      <div className="space-y-2">
        {[
          { name: "Simran", role: "Host & Manager", emoji: "👩‍💼" },
          { name: "Jyoti", role: "Host & Support", emoji: "👩‍🍳" },
        ].map((h) => (
          <div key={h.name} className="flex items-center gap-2">
            <span className="text-base leading-none">{h.emoji}</span>
            <div>
              <p className="text-[#f5f0e8]/85 text-[10px] font-semibold">{h.name}</p>
              <p className="text-[#f5f0e8]/40 text-[9px]">{h.role}</p>
            </div>
          </div>
        ))}
        <div className="pt-1.5 border-t border-[#c9a84c]/10">
          <p className="text-[#c9a84c]/50 text-[9px] font-mono text-center">
            Responds in &lt;5 min
          </p>
          <div className="flex items-center justify-center gap-1 mt-1">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-[#c9a84c] text-[8px]">★</span>
            ))}
            <span className="text-[#f5f0e8]/40 text-[8px] ml-1">4.9</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   ROOT COMPONENT
═══════════════════════════════════════════════════════════════════ */
export function ManorExperience({ properties }: { properties: Property[] }) {
  const [phase, setPhase] = useState<Phase>("idle");

  const start = useCallback(() => {
    setPhase("intro");
    // Lock scroll
    document.body.style.overflow = "hidden";
  }, []);

  const exitExperience = useCallback(() => {
    setPhase("idle");
    document.body.style.overflow = "";
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <>
      {/* ── Trigger button (rendered in hero via portal-like injection, placed by parent) ── */}
      {phase === "idle" && (
        <button
          onClick={start}
          className="manor-experience-btn group inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 select-none focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:ring-offset-2"
          aria-label="Start the interactive Manor Experience"
        >
          <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c9a84c] opacity-60" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#c9a84c]" />
          </span>
          Enter the Manor Experience
          <span className="group-hover:translate-x-0.5 transition-transform duration-200">→</span>
        </button>
      )}

      {/* ── Phase 1: Intro text ── */}
      {phase === "intro" && (
        <IntroScreen onDone={() => setPhase("exterior")} />
      )}

      {/* ── Phase 2: Exterior ── */}
      {phase === "exterior" && (
        <ExteriorScreen
          onEnter={() => setPhase("entering")}
          onClose={exitExperience}
        />
      )}

      {/* ── Enter transition ── */}
      {phase === "entering" && (
        <EnterTransition onDone={() => setPhase("interior")} />
      )}

      {/* ── Phase 3: Interior ── */}
      {phase === "interior" && (
        <InteriorScreen
          properties={properties}
          onClose={exitExperience}
        />
      )}
    </>
  );
}
