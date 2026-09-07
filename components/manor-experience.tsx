"use client";

/**
 * ManorExperience — "Enter the Manor Experience"
 *
 * Phase flow:
 *   idle → blackout → intro → exterior → entering-office → reception
 *     reception: 3 arched gates on a back wall
 *       Left gate  → entering-left  → room-left  (Sector 57)
 *       Center gate → entering-mid  → room-center (About)
 *       Right gate  → entering-right → room-right (Sector 39)
 *     Any room → back → reception
 */

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";

/* ─── types ──────────────────────────────────────────────────── */
type MainPhase =
  | "idle" | "blackout" | "intro" | "exterior"
  | "entering-office" | "reception"
  | "entering-left" | "entering-mid" | "entering-right"
  | "room-left" | "room-center" | "room-right";

export interface ManorProperty {
  id: string;
  name: string;
  slug: string;
  baseRate: number;
  address: string;
  vibe?: string;
}

/* ─── utility ─────────────────────────────────────────────────── */
function cn(...c: (string | boolean | undefined | null)[]) {
  return c.filter(Boolean).join(" ");
}

/* ═══════════════════════════════════════════════════════════════
   EXIT BUTTON
═══════════════════════════════════════════════════════════════ */
function ExitBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Exit experience"
      className="fixed top-4 right-4 z-[10000] inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono tracking-wide transition-all select-none focus:outline-none focus:ring-2 focus:ring-white/40"
      style={{
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.12)",
        color: "rgba(255,255,255,0.8)",
      }}
    >
      <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true">
        <path d="M1 1l7 7M8 1L1 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      Exit
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════
   BACK BUTTON (inside rooms)
═══════════════════════════════════════════════════════════════ */
function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Back to reception"
      className="fixed top-4 left-4 z-[10000] inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono tracking-wide transition-all select-none focus:outline-none focus:ring-2 focus:ring-[#1a3328]/40"
      style={{
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(26,51,40,0.15)",
        color: "#1a3328",
        boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
      }}
    >
      ‹ Reception
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════
   BLACKOUT
═══════════════════════════════════════════════════════════════ */
function BlackoutScreen({ onDone }: { onDone: () => void }) {
  const [opacity, setOpacity] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setOpacity(1), 30);
    const t2 = setTimeout(onDone, 550);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);
  return (
    <div
      className="fixed inset-0 z-[9990] bg-black pointer-events-none"
      style={{ opacity, transition: "opacity 0.45s ease-in" }}
      aria-hidden="true"
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   INTRO TEXT
═══════════════════════════════════════════════════════════════ */
function IntroScreen({ onDone }: { onDone: () => void }) {
  const [idx, setIdx] = useState(0);
  const [vis, setVis] = useState<"in" | "hold" | "out">("in");

  const lines = [
    { h: "The Mehmaan Manor", s: "Gurugram · Haryana · India" },
    { h: "Feel like Mehmaan",  s: "A home away from home." },
  ];

  useEffect(() => {
    const ids = [
      setTimeout(() => setVis("hold"), 800),
      setTimeout(() => setVis("out"),  2100),
      setTimeout(() => { setIdx(1); setVis("in"); }, 2800),
      setTimeout(() => setVis("hold"), 3600),
      setTimeout(() => setVis("out"),  4900),
      setTimeout(() => onDone(),        5600),
    ];
    return () => ids.forEach(clearTimeout);
  }, [onDone]);

  const line = lines[idx];

  return (
    <div
      className="fixed inset-0 z-[9991] flex items-center justify-center"
      style={{ background: "#050c09" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 40% at 50% 55%, rgba(201,168,76,0.12) 0%, transparent 70%)" }}
      />
      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {Array.from({ length: 18 }).map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              width: 2 + (i % 3), height: 2 + (i % 3),
              background: "#c9a84c",
              opacity: 0.08 + (i % 4) * 0.05,
              left: `${4 + i * 5.2}%`,
              top: `${10 + (i % 6) * 13}%`,
              animation: `manorFloat ${2.5 + (i % 4) * 0.8}s ease-in-out ${i * 0.3}s infinite alternate`,
            }}
          />
        ))}
      </div>

      <div
        key={idx}
        className={cn(
          "relative text-center px-6 max-w-2xl manor-intro-text",
          vis === "in"   && "manor-intro-fadein",
          vis === "hold" && "manor-intro-hold",
          vis === "out"  && "manor-intro-fadeout",
        )}
      >
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#c9a84c]/50" />
          <span className="text-[#c9a84c] text-xs select-none">◆</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#c9a84c]/50" />
        </div>
        <h2
          className="font-display text-white font-light tracking-wide"
          style={{ fontSize: "clamp(2.4rem, 8vw, 5.5rem)", lineHeight: 1.05 }}
        >
          {line.h}
        </h2>
        <p className="mt-5 font-mono text-sm tracking-[0.3em] uppercase text-[#c9a84c]/70">
          {line.s}
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   EXTERIOR
═══════════════════════════════════════════════════════════════ */
function ExteriorScreen({
  onEnter,
  onClose,
}: {
  onEnter: () => void;
  onClose: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Fade in
  useEffect(() => { const t = setTimeout(() => setVisible(true), 60); return () => clearTimeout(t); }, []);

  // Mouse parallax tracking
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  }, []);

  // Parallax offset — subtle 18px max
  const px = (mousePos.x - 0.5) * -18;
  const py = (mousePos.y - 0.5) * -10;

  // Golden particles data (memoised)
  const particles = React.useMemo(() => Array.from({ length: 22 }, (_, i) => ({
    id: i,
    left: `${5 + (i * 4.2) % 90}%`,
    size: 1.5 + (i % 3) * 0.8,
    duration: 3.5 + (i % 5) * 0.9,
    delay: (i * 0.38) % 4,
    opacity: 0.18 + (i % 4) * 0.10,
  })), []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9991] overflow-hidden"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 1.2s ease" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setMousePos({ x: 0.5, y: 0.5 }); }}
      role="dialog"
      aria-modal="true"
    >
      {/* ══ 1. BACKGROUND IMAGE — Ken Burns slow zoom + parallax ══ */}
      <div
        className="absolute inset-0"
        style={{
          transform: `scale(${hovered ? 1.06 : 1.04}) translate(${px}px, ${py}px)`,
          transition: hovered
            ? "transform 0.8s cubic-bezier(0.22,1,0.36,1)"
            : "transform 6s ease-out",
          willChange: "transform",
        }}
      >
        <img
          src="/images/s57/manor-exterior.jpg"
          alt="The Mehmaan Manor exterior"
          className="w-full h-full object-cover"
          draggable={false}
          style={{
            animation: "manorKenBurns 18s ease-in-out infinite alternate",
          }}
        />
      </div>

      {/* ══ 2. VIGNETTE — dark edges, cinematic depth ══ */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%)",
          transition: "opacity 0.5s ease",
          opacity: hovered ? 0.7 : 1,
        }}
      />

      {/* ══ 3. BOTTOM GRADIENT — makes pill readable ══ */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{ height: "30%", background: "linear-gradient(to top, rgba(0,0,0,0.60) 0%, transparent 100%)" }}
      />

      {/* ══ 4. TOP GRADIENT — softens top edge ══ */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{ height: "18%", background: "linear-gradient(to bottom, rgba(0,0,0,0.38) 0%, transparent 100%)" }}
      />

      {/* ══ 5. HOVER GOLDEN SHIMMER ══ */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 55% at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(201,168,76,0.10) 0%, transparent 70%)`,
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
      />

      {/* ══ 6. FLOATING GOLDEN PARTICLES ══ */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {particles.map(p => (
          <span
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: p.left,
              bottom: "-4px",
              width: p.size,
              height: p.size,
              background: "#c9a84c",
              opacity: visible ? p.opacity : 0,
              animation: `manorParticleRise ${p.duration}s ease-in ${p.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* ══ 7. CLICKABLE FULL-SCREEN OVERLAY ══ */}
      <button
        onClick={onEnter}
        aria-label="Click to enter the Manor"
        className="absolute inset-0 w-full h-full focus:outline-none cursor-pointer"
        style={{ background: "transparent" }}
      />

      {/* ══ 8. "STEP INSIDE" PILL — animated glow pulse ══ */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{ opacity: visible ? 1 : 0, transition: "opacity 1.4s ease 1s", zIndex: 10 }}
      >
        <span
          className="inline-flex items-center gap-2.5 px-7 py-3 rounded-full select-none"
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "clamp(12px, 1.1vw, 14px)",
            letterSpacing: "0.18em",
            color: hovered ? "#fff" : "rgba(255,255,255,0.88)",
            background: hovered
              ? "rgba(201,168,76,0.22)"
              : "rgba(255,255,255,0.10)",
            border: `1px solid ${hovered ? "rgba(201,168,76,0.65)" : "rgba(255,255,255,0.28)"}`,
            backdropFilter: "blur(14px)",
            boxShadow: hovered
              ? "0 0 32px 8px rgba(201,168,76,0.20), inset 0 1px 0 rgba(255,255,255,0.15)"
              : "0 4px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.10)",
            transition: "all 0.35s ease",
            animation: "manorPillPulse 3s ease-in-out infinite",
          }}
        >
          <span style={{ opacity: 0.7 }}>↑</span>
          Step inside the Manor
        </span>
      </div>

      {/* ══ 9. LOCATION PILL — top center ══ */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2" style={{ zIndex: 10 }}>
        <span
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[11px] font-mono tracking-widest pointer-events-none"
          style={{
            background: "rgba(0,0,0,0.32)",
            backdropFilter: "blur(12px)",
            color: "rgba(255,255,255,0.78)",
            border: "1px solid rgba(255,255,255,0.15)",
          }}
        >
          ✦ Gurugram · Haryana · India
        </span>
      </div>

      {/* ══ 10. EXIT BUTTON ══ */}
      <ExitBtn onClick={onClose} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   GATE WALK-IN TRANSITION (zooms into a gate)
═══════════════════════════════════════════════════════════════ */
function GateTransition({ onDone }: { onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 1200); return () => clearTimeout(t); }, [onDone]);
  return (
    <div className="fixed inset-0 z-[9995] overflow-hidden flex items-center justify-center"
      style={{ background: "#0a0702" }} aria-hidden="true">
      <div className="manor-gate-enter" style={{
        width: "clamp(80px,12vw,160px)",
        height: "clamp(110px,17vw,220px)",
        borderRadius: "50% 50% 0 0 / 60% 60% 0 0",
        background: "radial-gradient(ellipse at 50% 30%, rgba(201,168,76,0.35), rgba(201,168,76,0.05))",
        border: "2px solid rgba(201,168,76,0.6)",
        boxShadow: "0 0 60px 20px rgba(201,168,76,0.15)",
      }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   RECEPTION HALL  — 3 arched gates on back wall
═══════════════════════════════════════════════════════════════ */
function ReceptionHall({
  onGate,
  onClose,
}: {
  onGate: (gate: "left" | "mid" | "right") => void;
  onClose: () => void;
}) {
  const [visible, setVisible] = useState(false);
  const [hoveredGate, setHoveredGate] = useState<"left" | "mid" | "right" | null>(null);

  useEffect(() => { const t = setTimeout(() => setVisible(true), 80); return () => clearTimeout(t); }, []);

  const gates: { id: "left" | "mid" | "right"; label: string; sub: string; icon: string; color: string }[] = [
    { id: "left",  label: "Sector 57",       sub: "The Mehmaan Manor",   icon: "🏠", color: "#c9a84c" },
    { id: "mid",   label: "About Us",         sub: "Our Story & Hosts",   icon: "◆",  color: "#c9a84c" },
    { id: "right", label: "Sector 39",       sub: "The Mehmaan Manor",   icon: "🏠", color: "#c9a84c" },
  ];

  return (
    <div
      className="fixed inset-0 z-[9992] overflow-hidden"
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 0.8s ease",
        perspective: "900px",
        perspectiveOrigin: "50% 45%",
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Mehmaan Manor reception hall"
    >
      {/* ── Floor ── */}
      <div className="absolute left-0 right-0 bottom-0"
        style={{ height: "45%",
          background: "repeating-linear-gradient(90deg,#2a1a08 0,#2a1a08 60px,#321e0a 60px,#321e0a 120px)",
          transform: "rotateX(55deg)", transformOrigin: "bottom center" }} />
      {/* Floor sheen */}
      <div className="absolute left-0 right-0 bottom-0 pointer-events-none"
        style={{ height: "45%", transformOrigin: "bottom center", transform: "rotateX(55deg)",
          background: "linear-gradient(180deg,rgba(201,168,76,0.12) 0%,transparent 55%)" }} />

      {/* ── Ceiling ── */}
      <div className="absolute left-0 right-0 top-0"
        style={{ height: "45%", transformOrigin: "top center", transform: "rotateX(-55deg)",
          background: "linear-gradient(180deg,#080502 0%,#140e06 100%)" }} />
      {/* Ceiling centre glow */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 w-1/3 pointer-events-none"
        style={{ height: "45%", transformOrigin: "top center", transform: "rotateX(-55deg)",
          background: "radial-gradient(ellipse at 50% 0%,rgba(255,240,140,0.25) 0%,transparent 65%)" }} />

      {/* ── Back wall ── */}
      <div
        className="absolute left-0 right-0"
        style={{
          top: "12%", bottom: "14%",
          transform: "translateZ(-380px)",
          background: "linear-gradient(180deg,#1e1508 0%,#2e1e0c 55%,#1e1508 100%)",
          borderTop: "2px solid rgba(201,168,76,0.18)",
          borderBottom: "2px solid rgba(201,168,76,0.18)",
        }}
      >
        {/* Wall texture horizontal lines */}
        {[20, 40, 60, 80].map(pct => (
          <div key={pct} className="absolute left-0 right-0 h-px pointer-events-none"
            style={{ top: `${pct}%`, background: "rgba(201,168,76,0.06)" }} />
        ))}
        {/* Wainscoting */}
        <div className="absolute bottom-0 left-0 right-0 h-[28%]"
          style={{ borderTop: "1.5px solid rgba(201,168,76,0.18)", background: "rgba(0,0,0,0.22)" }} />
        {/* Top cornice */}
        <div className="absolute top-0 left-0 right-0 h-[5%]"
          style={{ background: "rgba(201,168,76,0.07)", borderBottom: "1px solid rgba(201,168,76,0.15)" }} />

        {/* Chandelier */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div className="w-px bg-[#c9a84c]/35" style={{ height: 28 }} />
          <div className="w-14 h-0.5 bg-[#c9a84c]/22 rounded-full" />
          <div className="w-7 h-6 rounded-full border border-[#c9a84c]/35 flex items-center justify-center mt-0.5"
            style={{ background: "rgba(201,168,76,0.08)" }}>
            <div className="w-2.5 h-2.5 rounded-full"
              style={{ background: "#fff8c0", boxShadow: "0 0 20px 12px rgba(255,240,140,0.60)" }} />
          </div>
        </div>

        {/* Manor name plaque */}
        <div className="absolute top-[8%] left-1/2 -translate-x-1/2 text-center pointer-events-none">
          <div className="flex items-center gap-3">
            <div className="h-px w-12 bg-[#c9a84c]/35" />
            <span className="text-[#c9a84c] text-[9px] font-mono tracking-[0.28em] uppercase">The Mehmaan Manor</span>
            <div className="h-px w-12 bg-[#c9a84c]/35" />
          </div>
          <p className="text-[#f5f0e8]/30 text-[8px] font-mono mt-1">Reception Hall · Gurugram</p>
        </div>
      </div>

      {/* ── Side walls ── */}
      <div className="absolute top-0 bottom-0 left-0 w-1/2"
        style={{ transformOrigin: "left center", transform: "rotateY(54deg)",
          background: "linear-gradient(90deg,#0a0602 0%,#1e1408 100%)" }}>
        <div className="absolute inset-y-0 right-0 w-px bg-[#c9a84c]/10" />
        {/* Left wall sconces */}
        <div className="absolute top-1/3 right-6 flex flex-col items-center gap-0.5">
          <div className="w-px h-4 bg-[#c9a84c]/20" />
          <div className="w-3 h-3 rounded-full" style={{ background: "rgba(255,220,80,0.12)", boxShadow: "0 0 8px 4px rgba(255,220,80,0.10)" }} />
        </div>
      </div>
      <div className="absolute top-0 bottom-0 right-0 w-1/2"
        style={{ transformOrigin: "right center", transform: "rotateY(-54deg)",
          background: "linear-gradient(270deg,#0a0602 0%,#1e1408 100%)" }}>
        <div className="absolute inset-y-0 left-0 w-px bg-[#c9a84c]/10" />
        <div className="absolute top-1/3 left-6 flex flex-col items-center gap-0.5">
          <div className="w-px h-4 bg-[#c9a84c]/20" />
          <div className="w-3 h-3 rounded-full" style={{ background: "rgba(255,220,80,0.12)", boxShadow: "0 0 8px 4px rgba(255,220,80,0.10)" }} />
        </div>
      </div>

      {/* ══════ 3 GATES ══════ */}
      <div
        className="absolute left-0 right-0 flex items-end justify-center gap-[3%] md:gap-[4%] px-[8%]"
        style={{ bottom: "14%", transform: "translateZ(-200px)" }}
      >
        {gates.map((gate) => (
          <GateButton
            key={gate.id}
            gate={gate}
            hovered={hoveredGate === gate.id}
            isCenter={gate.id === "mid"}
            onHover={() => setHoveredGate(gate.id)}
            onLeave={() => setHoveredGate(null)}
            onClick={() => onGate(gate.id)}
          />
        ))}
      </div>

      {/* ── Host welcome note ── */}
      <div
        className="absolute left-1/2 -translate-x-1/2 text-center pointer-events-none manor-pop-in"
        style={{ top: "8%", zIndex: 20 }}
      >
        <div className="flex items-center gap-3 px-5 py-2.5 rounded-full"
          style={{ background: "rgba(0,0,0,0.40)", backdropFilter: "blur(10px)", border: "1px solid rgba(201,168,76,0.18)" }}>
          <span className="text-base select-none">👩‍💼</span>
          <p className="text-[#f5f0e8]/70 text-xs">
            Namaste! Choose a gate to explore — <span className="text-[#c9a84c]">our properties or about us.</span>
          </p>
          <span className="text-base select-none">👩‍🍳</span>
        </div>
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none z-10"
        style={{ background: "radial-gradient(ellipse 85% 70% at 50% 45%, transparent 0%, rgba(0,0,0,0.50) 100%)" }} />
      {/* Floor fade */}
      <div className="absolute bottom-0 left-0 right-0 h-1/5 pointer-events-none z-10"
        style={{ background: "linear-gradient(0deg,rgba(0,0,0,0.70) 0%,transparent 100%)" }} />

      <ExitBtn onClick={onClose} />
    </div>
  );
}

/* ── Single gate button ─────────────────────────────────────── */
function GateButton({
  gate, hovered, isCenter, onHover, onLeave, onClick,
}: {
  gate: { id: string; label: string; sub: string; icon: string };
  hovered: boolean;
  isCenter: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
}) {
  const h = isCenter ? "clamp(140px,22vh,260px)" : "clamp(120px,19vh,220px)";
  const w = isCenter ? "clamp(90px,9vw,140px)"  : "clamp(76px,7.5vw,118px)";

  return (
    <button
      onMouseEnter={onHover} onMouseLeave={onLeave}
      onFocus={onHover} onBlur={onLeave}
      onClick={onClick}
      aria-label={`Enter ${gate.label}`}
      className="relative flex flex-col items-center focus:outline-none group"
      style={{ width: w }}
    >
      {/* Arch gate shape */}
      <div
        style={{
          width: "100%",
          height: h,
          borderRadius: "50% 50% 0 0 / 30% 30% 0 0",
          position: "relative",
          transition: "all 0.35s cubic-bezier(0.22,1,0.36,1)",
          background: hovered
            ? "linear-gradient(180deg,rgba(201,168,76,0.18) 0%,rgba(201,168,76,0.06) 100%)"
            : "linear-gradient(180deg,rgba(201,168,76,0.06) 0%,rgba(0,0,0,0.30) 100%)",
          border: `2px solid ${hovered ? "rgba(201,168,76,0.75)" : "rgba(201,168,76,0.30)"}`,
          boxShadow: hovered
            ? "0 0 40px rgba(201,168,76,0.30), inset 0 0 30px rgba(201,168,76,0.08)"
            : "0 4px 20px rgba(0,0,0,0.50)",
          transform: hovered ? "translateY(-6px) scaleY(1.02)" : "translateY(0) scaleY(1)",
        }}
      >
        {/* Inner arch frame */}
        <div style={{
          position: "absolute",
          inset: "6px 6px 0 6px",
          borderRadius: "50% 50% 0 0 / 30% 30% 0 0",
          border: `1px solid ${hovered ? "rgba(201,168,76,0.35)" : "rgba(201,168,76,0.12)"}`,
          pointerEvents: "none",
        }} />

        {/* Warm light glow from inside */}
        <div style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50% 50% 0 0 / 30% 30% 0 0",
          background: hovered
            ? "radial-gradient(ellipse at 50% 80%, rgba(255,220,120,0.20) 0%, transparent 70%)"
            : "radial-gradient(ellipse at 50% 80%, rgba(255,220,120,0.06) 0%, transparent 70%)",
          transition: "all 0.35s ease",
          pointerEvents: "none",
        }} />

        {/* Gate icon */}
        <div className="absolute inset-x-0 top-[30%] flex flex-col items-center gap-2">
          <span className="text-2xl md:text-3xl select-none"
            style={{ filter: hovered ? "drop-shadow(0 0 8px rgba(201,168,76,0.6))" : "none",
              transition: "filter 0.35s ease" }}>
            {gate.icon}
          </span>
        </div>

        {/* Door knob */}
        <div className="absolute bottom-[12%] left-1/2 -translate-x-1/2">
          <div className="w-2 h-2 rounded-full"
            style={{ background: hovered ? "#c9a84c" : "rgba(201,168,76,0.40)",
              boxShadow: hovered ? "0 0 8px rgba(201,168,76,0.70)" : "none",
              transition: "all 0.35s ease" }} />
        </div>

        {/* Threshold / sill */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5"
          style={{ background: hovered ? "rgba(201,168,76,0.50)" : "rgba(201,168,76,0.20)",
            transition: "background 0.35s ease", borderRadius: "0 0 2px 2px" }} />
      </div>

      {/* Gate label below */}
      <div className="mt-2 text-center">
        <p className={cn("font-mono text-[10px] md:text-xs tracking-widest uppercase transition-colors",
          hovered ? "text-[#c9a84c]" : "text-[#f5f0e8]/55")}>
          {gate.label}
        </p>
        <p className="text-[#f5f0e8]/25 text-[8px] font-mono mt-0.5">{gate.sub}</p>
        {hovered && (
          <p className="text-[#c9a84c]/70 text-[8px] font-mono mt-0.5 manor-pop-in">
            ↑ Enter
          </p>
        )}
      </div>
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PROPERTY ROOM  — full detail room for one property
═══════════════════════════════════════════════════════════════ */
function PropertyRoom({
  property,
  onBack,
  onClose,
}: {
  property: ManorProperty;
  onBack: () => void;
  onClose: () => void;
}) {
  const isP1 = property.id === "1";
  const [activePhoto, setActivePhoto] = useState(0);

  const photos = isP1
    ? [
        { src: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=90&auto=format&fit=crop", lbl: "Bedroom" },
        { src: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200&q=90&auto=format&fit=crop",  lbl: "Living Area" },
        { src: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=1200&q=90&auto=format&fit=crop", lbl: "Balcony" },
        { src: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=1200&q=90&auto=format&fit=crop", lbl: "Bedroom 2" },
      ]
    : [
        { src: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=90&auto=format&fit=crop", lbl: "Studio" },
        { src: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=90&auto=format&fit=crop",  lbl: "Living Room" },
        { src: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=90&auto=format&fit=crop",  lbl: "Kitchen" },
        { src: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=90&auto=format&fit=crop", lbl: "Apartment" },
      ];

  const amenities = isP1
    ? ["Wi-Fi & Netflix", "Balcony", "AC", "24h Hot Water", "CCTV", "Power Backup", "Max 3 guests", "Street Parking"]
    : ["Wi-Fi & Netflix", "Basic Kitchen", "AC", "24h Hot Water", "Near Medanta", "Metro Nearby", "Max 5 guests", "Studio & 2BHK"];

  const waText = encodeURIComponent(`Hi! I'm interested in ${property.name}. Can you share availability?`);

  return (
    <div
      className="fixed inset-0 z-[9993] overflow-y-auto"
      style={{ background: "#faf8f4" }}
      role="dialog"
      aria-modal="true"
    >
      {/* ── HERO PHOTO SECTION ── */}
      <div className="relative w-full overflow-hidden" style={{ height: "clamp(260px,52vh,520px)" }}>

        {/* Photos — full colour, no heavy overlay */}
        {photos.map((p, i) => (
          <img
            key={p.src}
            src={p.src}
            alt={p.lbl}
            loading={i === 0 ? "eager" : "lazy"}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity: i === activePhoto ? 1 : 0, transition: "opacity 0.7s ease" }}
          />
        ))}

        {/* Light gradient — just enough for text readability, not a dark curtain */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.10) 45%, rgba(0,0,0,0.55) 100%)" }}
        />

        {/* Gold accent line top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent" />

        {/* Location + title — bottom left */}
        <div className="absolute bottom-0 left-0 right-0 px-5 md:px-8 pb-5 md:pb-7">
          <span className="inline-block text-[#c9a84c] text-[9px] font-mono tracking-[0.28em] uppercase mb-1.5">
            {isP1 ? "Sector 57" : "Sector 39"} · The Mehmaan Manor
          </span>
          <h2 className="font-display text-white text-3xl md:text-4xl leading-tight drop-shadow-sm">
            {property.name.replace("The Mehmaan Manor — ", "")}
          </h2>
          <p className="text-white/60 text-xs mt-1 drop-shadow-sm">{property.address}</p>
        </div>

        {/* Thumbnail strip — bottom right */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-1.5">
          {photos.map((p, i) => (
            <button
              key={i}
              onClick={() => setActivePhoto(i)}
              aria-label={`View ${p.lbl}`}
              className="overflow-hidden rounded-lg focus:outline-none transition-all"
              style={{
                width: 48, height: 36,
                border: `2px solid ${i === activePhoto ? "#c9a84c" : "rgba(255,255,255,0.35)"}`,
                opacity: i === activePhoto ? 1 : 0.70,
                boxShadow: i === activePhoto ? "0 0 0 1px rgba(201,168,76,0.4)" : "none",
              }}
            >
              <img src={p.src} alt={p.lbl} loading="lazy" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>

        {/* Photo label pill */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2">
          <span className="px-3 py-1 rounded-full text-[10px] font-mono bg-black/30 backdrop-blur-sm text-white/80 border border-white/15">
            {photos[activePhoto].lbl}
          </span>
        </div>
      </div>

      {/* ── CONTENT ── light background */}
      <div className="max-w-3xl mx-auto px-5 md:px-8 py-7">

        {/* Price + badge row */}
        <div className="flex items-center gap-3 mb-1">
          <span className="font-display text-4xl text-[#1a3328] font-semibold">
            ₹{property.baseRate.toLocaleString("en-IN")}
          </span>
          <span className="text-ink/45 text-base">/night</span>
          <span className="ml-auto px-3 py-1 text-[10px] font-mono rounded-full bg-[#c9a84c]/12 text-[#c9a84c] border border-[#c9a84c]/25">
            No booking fee
          </span>
        </div>
        <p className="text-ink/40 text-xs font-mono mb-5 pb-5 border-b border-forest/8">
          Free cancellation up to 48 hours before check-in
        </p>

        {/* Description */}
        {property.vibe && (
          <p className="text-ink/65 text-sm leading-relaxed mb-6">{property.vibe}</p>
        )}

        {/* Photo grid — 4 thumbnails in a horizontal scroll strip */}
        <div className="mb-6">
          <p className="text-[10px] font-mono tracking-widest uppercase text-ink/35 mb-2.5">Photo Gallery</p>
          <div className="grid grid-cols-4 gap-2">
            {photos.map((p, i) => (
              <button
                key={i}
                onClick={() => { setActivePhoto(i); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                aria-label={`View ${p.lbl}`}
                className="relative rounded-xl overflow-hidden focus:outline-none group"
                style={{ aspectRatio: "4/3" }}
              >
                <img src={p.src} alt={p.lbl} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className={cn(
                  "absolute inset-0 transition-all duration-300",
                  i === activePhoto ? "ring-2 ring-[#c9a84c] ring-inset" : "bg-black/0 group-hover:bg-black/10"
                )} />
                <span className="absolute bottom-1 left-0 right-0 text-center text-[9px] text-white font-mono opacity-0 group-hover:opacity-100 transition-opacity">{p.lbl}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Amenities */}
        <div className="mb-6">
          <p className="text-[10px] font-mono tracking-widest uppercase text-ink/35 mb-3">What&apos;s Included</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {amenities.map(a => (
              <div
                key={a}
                className="flex items-center gap-2 text-xs text-ink/70 bg-white rounded-xl px-3 py-2.5 border border-forest/8"
              >
                <span className="text-[#c9a84c] font-bold">✓</span>
                {a}
              </div>
            ))}
          </div>
        </div>

        {/* Hosts card */}
        <div className="flex items-center gap-4 p-4 rounded-2xl mb-6 bg-white border border-forest/8">
          <div className="flex -space-x-2">
            {["👩‍💼", "👩‍🍳"].map((e, i) => (
              <div key={i}
                className="w-11 h-11 rounded-full flex items-center justify-center text-xl border-2 border-white bg-[#eee9df]">
                {e}
              </div>
            ))}
          </div>
          <div>
            <p className="text-ink text-sm font-semibold">Simran &amp; Jyoti</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4caf6e] opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#4caf6e]" />
              </span>
              <span className="text-[#4caf6e] text-[10px] font-mono">Online · Responds &lt;5 min</span>
            </div>
          </div>
          <div className="ml-auto text-center">
            <div className="flex gap-0.5 justify-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="text-[#c9a84c] text-xs">★</span>
              ))}
            </div>
            <span className="text-ink/40 text-[9px] font-mono">4.9 / 5</span>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 mb-10">
          <Link
            href={`/homes/${property.slug}`}
            className="flex-1 py-4 rounded-2xl font-bold text-sm text-center transition-all active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
            style={{
              background: "linear-gradient(135deg,#1a3328 0%,#0d1f1a 100%)",
              color: "#f5f0e8",
              boxShadow: "0 4px 20px rgba(26,51,40,0.25)",
            }}
          >
            📋 View Full Details &amp; Book
          </Link>
          <a
            href={`https://wa.me/918828352311?text=${waText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-4 rounded-2xl font-bold text-sm text-center border-2 border-[#4caf6e] text-[#1a7a40] hover:bg-[#4caf6e] hover:text-white transition-all active:scale-[0.98]"
          >
            💬 Reserve on WhatsApp
          </a>
          <a
            href="tel:+918828352311"
            className="sm:w-auto px-5 py-4 rounded-2xl font-semibold text-sm text-center border-2 border-forest/20 text-forest hover:bg-forest hover:text-white transition-all"
          >
            📞 Call
          </a>
        </div>

      </div>

      <BackBtn onClick={onBack} />
      <ExitBtn onClick={onClose} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ABOUT ROOM  — center gate
═══════════════════════════════════════════════════════════════ */
function AboutRoom({ onBack, onClose }: { onBack: () => void; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[9993] overflow-y-auto"
      style={{ background: "linear-gradient(180deg,#0a0702 0%,#160f05 100%)" }}
      role="dialog" aria-modal="true"
    >
      {/* Header */}
      <div className="relative w-full flex flex-col items-center justify-center py-16 px-6"
        style={{ background: "linear-gradient(180deg,#0d0a04 0%,#1e1408 100%)", minHeight: "clamp(180px,30vh,280px)" }}>
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent" />
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-14 bg-[#c9a84c]/35" />
          <span className="text-[#c9a84c] text-xs select-none">◆</span>
          <div className="h-px w-14 bg-[#c9a84c]/35" />
        </div>
        <h2 className="font-display text-white text-3xl md:text-4xl text-center" style={{ letterSpacing: "0.03em" }}>
          The Mehmaan Manor
        </h2>
        <p className="text-[#c9a84c]/65 font-mono text-xs tracking-[0.28em] uppercase mt-3">
          Gurugram · Haryana · India
        </p>
      </div>

      <div className="px-5 md:px-8 py-8 max-w-2xl mx-auto">

        {/* Philosophy */}
        <div className="mb-8 p-5 rounded-2xl"
          style={{ background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.15)" }}>
          <p className="text-[#c9a84c] text-[9px] font-mono tracking-widest uppercase mb-3">Our Philosophy</p>
          <p className="text-[#f5f0e8]/70 text-sm leading-relaxed">
            <em>Mehmaan</em> — the Hindi word for guest — carries a cultural weight that no translation captures.
            It&apos;s not a transaction. It&apos;s a relationship. Two beautifully curated homes.
            One unforgettable promise.
          </p>
          <p className="text-[#f5f0e8]/45 text-sm leading-relaxed mt-3">
            This isn&apos;t a hotel. This is your Mehmaan moment.
          </p>
        </div>

        {/* Two homes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {[
            { name: "Sector 57", sub: "Sushant Lok-2", rate: "₹2,499", guests: "3 guests", emoji: "🏡" },
            { name: "Sector 39", sub: "Jharsa, Near Medanta", rate: "₹1,999", guests: "5 guests", emoji: "🏠" },
          ].map(p => (
            <div key={p.name} className="p-4 rounded-2xl"
              style={{ background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.15)" }}>
              <span className="text-3xl">{p.emoji}</span>
              <p className="text-[#c9a84c] text-xs font-mono tracking-widest uppercase mt-2">{p.name}</p>
              <p className="text-[#f5f0e8]/50 text-[10px] mt-0.5">{p.sub}</p>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="font-display text-xl text-[#f5f0e8]/85">{p.rate}</span>
                <span className="text-[#f5f0e8]/30 text-xs">/night</span>
              </div>
              <p className="text-[#f5f0e8]/35 text-[9px] font-mono mt-1">Up to {p.guests}</p>
            </div>
          ))}
        </div>

        {/* Hosts */}
        <div className="mb-8">
          <p className="text-[#c9a84c]/55 text-[9px] font-mono tracking-widest uppercase mb-4">Meet Your Hosts</p>
          {[
            { name: "Simran", role: "Host & Manager", emoji: "👩‍💼", phone: "+91 88283 52311",
              quote: "We treat every guest like family — because that's what Mehmaan means." },
            { name: "Jyoti",  role: "Host & Support",  emoji: "👩‍🍳", phone: "+91 87965 68002",
              quote: "From check-in to check-out, we're always just a message away." },
          ].map(h => (
            <div key={h.name} className="flex items-start gap-4 p-4 rounded-2xl mb-3"
              style={{ background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.12)" }}>
              <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl border-2 border-[#c9a84c]/30"
                style={{ background: "rgba(201,168,76,0.08)" }}>{h.emoji}</div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-[#f5f0e8]/90 text-sm font-semibold">{h.name}</p>
                  <span className="text-[#c9a84c]/45 text-[9px] font-mono">{h.role}</span>
                </div>
                <p className="text-[#f5f0e8]/45 text-xs leading-relaxed mt-1 italic">&ldquo;{h.quote}&rdquo;</p>
                <a href={`tel:${h.phone.replace(/\s/g, "")}`}
                  className="inline-flex items-center gap-1 mt-1.5 text-[#c9a84c]/60 text-[10px] font-mono hover:text-[#c9a84c] transition-colors">
                  📞 {h.phone}
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="mb-8">
          <p className="text-[#c9a84c]/55 text-[9px] font-mono tracking-widest uppercase mb-4">How It Works</p>
          {[
            { n: "01", t: "Browse", d: "Explore both Gurugram homes and pick the one you love." },
            { n: "02", t: "Book Direct", d: "Reserve directly with us — no middlemen, no hidden fees." },
            { n: "03", t: "Arrive & Enjoy", d: "Check in, feel at home. We handle everything." },
          ].map(s => (
            <div key={s.n} className="flex items-start gap-4 mb-4">
              <span className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-xs font-mono font-bold text-[#c9a84c] border border-[#c9a84c]/25"
                style={{ background: "rgba(201,168,76,0.08)" }}>{s.n}</span>
              <div>
                <p className="text-[#f5f0e8]/85 text-sm font-semibold">{s.t}</p>
                <p className="text-[#f5f0e8]/40 text-xs leading-relaxed mt-0.5">{s.d}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3 mb-10">
          <Link href="/homes"
            className="flex-1 py-4 rounded-2xl font-bold text-sm text-center transition-all active:scale-[0.98]"
            style={{ background: "linear-gradient(135deg,#c9a84c 0%,#e8d070 100%)", color: "#1a0800",
              boxShadow: "0 4px 20px rgba(201,168,76,0.40)" }}>
            🏠 Explore Our Homes
          </Link>
          <a href="https://wa.me/918828352311"
            target="_blank" rel="noopener noreferrer"
            className="flex-1 py-4 rounded-2xl font-bold text-sm text-center border-2 border-[#4caf6e]/55 text-[#4caf6e] hover:bg-[#4caf6e] hover:text-white transition-all">
            💬 Get in Touch
          </a>
        </div>

      </div>

      <BackBtn onClick={onBack} />
      <ExitBtn onClick={onClose} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ROOT EXPORT
═══════════════════════════════════════════════════════════════ */
export function ManorExperience({
  properties,
  onPhaseChange,
}: {
  properties: ManorProperty[];
  onPhaseChange?: (active: boolean) => void;
}) {
  const [phase, setPhase] = useState<MainPhase>("idle");

  const go = useCallback((p: MainPhase) => {
    setPhase(p);
    onPhaseChange?.(p !== "idle");
  }, [onPhaseChange]);

  const start  = useCallback(() => { document.body.style.overflow = "hidden"; go("blackout"); }, [go]);
  const exit   = useCallback(() => { document.body.style.overflow = ""; go("idle"); }, [go]);

  useEffect(() => () => { document.body.style.overflow = ""; }, []);

  const prop1 = properties.find(p => p.id === "1") ?? properties[0];
  const prop2 = properties.find(p => p.id === "2") ?? properties[properties.length - 1];

  return (
    <>
      {/* ── Trigger button ── */}
      {phase === "idle" && (
        <div className="fixed z-[100] bottom-[max(5vh,80px)] left-5 md:left-12 lg:left-20 hero-line-enter"
          style={{ animationDelay: "1.2s" }}>
          <button
            onClick={start}
            aria-label="Start the Enter the Manor Experience"
            className="manor-experience-btn group inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 select-none focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:ring-offset-2 focus:ring-offset-transparent"
          >
            <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c9a84c] opacity-55" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#c9a84c]" />
            </span>
            Enter the Manor Experience
            <span className="group-hover:translate-x-1 transition-transform duration-200" aria-hidden="true">→</span>
          </button>
        </div>
      )}

      {/* ── Phase screens ── */}
      {phase === "blackout"       && <BlackoutScreen  onDone={() => go("intro")} />}
      {phase === "intro"          && <IntroScreen      onDone={() => go("exterior")} />}
      {phase === "exterior"       && <ExteriorScreen   onEnter={() => go("entering-office")} onClose={exit} />}

      {/* Office entry transition */}
      {phase === "entering-office" && <GateTransition onDone={() => go("reception")} />}

      {/* Reception hall — 3 gates */}
      {phase === "reception" && (
        <ReceptionHall
          onGate={(gate) => {
            if (gate === "left")  go("entering-left");
            if (gate === "mid")   go("entering-mid");
            if (gate === "right") go("entering-right");
          }}
          onClose={exit}
        />
      )}

      {/* Gate entry transitions */}
      {phase === "entering-left"  && <GateTransition onDone={() => go("room-left")} />}
      {phase === "entering-mid"   && <GateTransition onDone={() => go("room-center")} />}
      {phase === "entering-right" && <GateTransition onDone={() => go("room-right")} />}

      {/* Property rooms */}
      {phase === "room-left"   && <PropertyRoom property={prop1} onBack={() => go("reception")} onClose={exit} />}
      {phase === "room-right"  && <PropertyRoom property={prop2} onBack={() => go("reception")} onClose={exit} />}
      {phase === "room-center" && <AboutRoom onBack={() => go("reception")} onClose={exit} />}
    </>
  );
}
