"use client";

/**
 * ManorExperience — "Enter the Manor Experience"
 *
 * Full phase flow (website disappears completely on start):
 *
 *   idle
 *     └─ click button
 *   blackout   (0.5s full-screen fade to black)
 *     └─ auto
 *   intro      ("The Mehmaan Manor" + "Feel like Mehmaan" on dark bg)
 *     └─ auto ~6 s
 *   exterior   (first-person outdoor view of the Manor building)
 *     └─ click building / door
 *   entering   (camera walk-in animation through the door — 1.8 s)
 *     └─ auto
 *   interior   (true first-person 3D room: left wall, back wall, right wall,
 *               floor, ceiling — perspective transform. Property photo frames
 *               on walls. Reception desk centre-back. Info boards near desk.)
 *     └─ exit button → idle
 */

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";

/* ─── types ──────────────────────────────────────────────── */
type Phase =
  | "idle"
  | "blackout"
  | "intro"
  | "exterior"
  | "entering"
  | "interior";

export interface ManorProperty {
  id: string;
  name: string;
  slug: string;
  baseRate: number;
  address: string;
}

/* ─── tiny helpers ───────────────────────────────────────── */
function cn(...c: (string | boolean | undefined | null)[]) {
  return c.filter(Boolean).join(" ");
}

/* ══════════════════════════════════════════════════════════
   EXIT BUTTON  — always visible during experience
══════════════════════════════════════════════════════════ */
function ExitBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Exit experience and return to website"
      className="fixed top-4 right-4 z-[10000] inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono tracking-wide transition-all select-none focus:outline-none focus:ring-2 focus:ring-white/50"
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
      Exit Experience
    </button>
  );
}

/* ══════════════════════════════════════════════════════════
   PHASE: BLACKOUT  (screen goes to black on click)
══════════════════════════════════════════════════════════ */
function BlackoutScreen({ onDone }: { onDone: () => void }) {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    // Ramp to full black then proceed
    const t1 = setTimeout(() => setOpacity(1), 30);
    const t2 = setTimeout(() => onDone(), 550);
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

/* ══════════════════════════════════════════════════════════
   PHASE: INTRO TEXT
   "The Mehmaan Manor"  →  "Feel like Mehmaan"
══════════════════════════════════════════════════════════ */
function IntroScreen({ onDone }: { onDone: () => void }) {
  const [lineIdx, setLineIdx] = useState(0);
  const [vis,     setVis]     = useState<"in" | "hold" | "out">("in");

  const lines = [
    { heading: "The Mehmaan Manor", sub: "Gurugram · Haryana · India" },
    { heading: "Feel like Mehmaan", sub: "A home away from home." },
  ];

  useEffect(() => {
    const T = (ms: number, fn: () => void) => setTimeout(fn, ms);
    const ids = [
      T(800,  () => setVis("hold")),
      T(2100, () => setVis("out")),
      T(2800, () => { setLineIdx(1); setVis("in"); }),
      T(3600, () => setVis("hold")),
      T(4900, () => setVis("out")),
      T(5600, () => onDone()),
    ];
    return () => ids.forEach(clearTimeout);
  }, [onDone]);

  const line = lines[lineIdx];

  return (
    <div
      className="fixed inset-0 z-[9991] flex items-center justify-center overflow-hidden"
      style={{ background: "#050c09" }}
    >
      {/* soft gold glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 40% at 50% 55%, rgba(201,168,76,0.12) 0%, transparent 70%)" }}
      />

      {/* floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {Array.from({ length: 20 }).map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              width: 2 + (i % 3),
              height: 2 + (i % 3),
              background: "#c9a84c",
              opacity: 0.08 + (i % 4) * 0.05,
              left: `${4 + i * 4.7}%`,
              top: `${10 + (i % 6) * 13}%`,
              animation: `manorFloat ${2.5 + (i % 4) * 0.8}s ease-in-out ${i * 0.3}s infinite alternate`,
            }}
          />
        ))}
      </div>

      {/* text block */}
      <div
        key={lineIdx}
        className={cn(
          "relative text-center px-6 max-w-2xl",
          "manor-intro-text",
          vis === "in"   && "manor-intro-fadein",
          vis === "hold" && "manor-intro-hold",
          vis === "out"  && "manor-intro-fadeout",
        )}
      >
        {/* top rule */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#c9a84c]/50" />
          <span className="text-[#c9a84c] text-xs select-none">◆</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#c9a84c]/50" />
        </div>

        <h2
          className="font-display text-white font-light tracking-wide"
          style={{ fontSize: "clamp(2.4rem, 8vw, 5.5rem)", lineHeight: 1.05 }}
        >
          {line.heading}
        </h2>
        <p className="mt-5 font-mono text-sm tracking-[0.3em] uppercase text-[#c9a84c]/70">
          {line.sub}
        </p>

        {/* bottom rule */}
        <div className="flex items-center justify-center gap-3 mt-8">
          <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#c9a84c]/25" />
          <div className="h-1 w-1 rounded-full bg-[#c9a84c]/30" />
          <div className="h-px w-10 bg-gradient-to-l from-transparent to-[#c9a84c]/25" />
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   PHASE: EXTERIOR  (first-person outdoor view)
══════════════════════════════════════════════════════════ */
function ExteriorScreen({
  onEnter,
  onClose,
}: {
  onEnter: () => void;
  onClose: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[9991] overflow-hidden"
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 0.7s ease",
        background: "linear-gradient(180deg,#6fa8cf 0%,#aed4ea 22%,#c8e6c0 55%,#7aaa6a 100%)",
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Mehmaan Manor exterior — click to enter"
    >
      {/* Clouds */}
      {[
        { top: "7%",  left: "8%",  w: "28%", op: 0.22 },
        { top: "12%", left: "55%", w: "20%", op: 0.18 },
        { top: "5%",  left: "35%", w: "16%", op: 0.16 },
      ].map((c, i) => (
        <div
          key={i}
          className="absolute rounded-full blur-sm pointer-events-none"
          style={{ top: c.top, left: c.left, width: c.w, height: "3%", background: `rgba(255,255,255,${c.op})` }}
        />
      ))}

      {/* Ground */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{ height: "30%", background: "linear-gradient(180deg,#7aaa6a 0%,#4d7840 100%)" }}
      />

      {/* Stone path */}
      <div
        className="absolute bottom-0 left-1/2"
        style={{
          transform: "translateX(-50%)",
          width: "clamp(60px,10vw,120px)",
          height: "33%",
          background: "linear-gradient(180deg,#c8b890 0%,#9a8c6a 100%)",
          clipPath: "polygon(10% 0%,90% 0%,100% 100%,0% 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Trees */}
      <TreesExt side="left" />
      <TreesExt side="right" />

      {/* ── Building (clickable) ── */}
      <button
        onClick={onEnter}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        aria-label="Click to enter the Manor"
        className="absolute left-1/2 bottom-[26%] focus:outline-none"
        style={{
          width: "clamp(200px,38vw,480px)",
          transform: `translateX(-50%) scale(${hovered ? 1.03 : 1})`,
          transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <BuildingSVG hovered={hovered} />

        {/* Click prompt */}
        <div
          className="mt-3 flex justify-center"
          style={{ opacity: visible ? 1 : 0, transition: "opacity 1.2s ease 0.8s" }}
        >
          <span
            className="px-5 py-2 rounded-full text-xs font-mono tracking-widest"
            style={{
              background: hovered ? "rgba(26,51,40,0.90)" : "rgba(0,0,0,0.38)",
              color: hovered ? "#c9a84c" : "rgba(255,255,255,0.75)",
              border: `1px solid ${hovered ? "rgba(201,168,76,0.45)" : "rgba(255,255,255,0.18)"}`,
              backdropFilter: "blur(8px)",
              transition: "all 0.3s ease",
            }}
          >
            {hovered ? "✦  Click to Enter the Manor  ✦" : "↑  Step inside the Manor"}
          </span>
        </div>
      </button>

      {/* Horizon line */}
      <div
        className="absolute left-0 right-0 h-px pointer-events-none"
        style={{ bottom: "30%", background: "linear-gradient(90deg,transparent,rgba(50,80,40,0.4),transparent)" }}
      />

      {/* Location pill */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none">
        <span
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-mono tracking-widest"
          style={{ background: "rgba(0,0,0,0.28)", backdropFilter: "blur(8px)", color: "rgba(255,255,255,0.65)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          📍 Gurugram · Haryana · India
        </span>
      </div>

      <ExitBtn onClick={onClose} />
    </div>
  );
}

/* ── Building SVG ──────────────────────────────────────── */
function BuildingSVG({ hovered }: { hovered: boolean }) {
  const wf = hovered ? "#f5e8b8" : "#d8c090";
  const wg = hovered ? "rgba(255,230,130,0.30)" : "transparent";

  return (
    <svg viewBox="0 0 520 360" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full drop-shadow-2xl" aria-hidden="true">
      {/* Body */}
      <rect x="50" y="52" width="420" height="300" rx="3" fill="#ede2c8" stroke="#c8b07a" strokeWidth="1.5" />
      {/* Courses */}
      {[100,148,196,244,292,340].map(y=>(
        <line key={y} x1="50" y1={y} x2="470" y2={y} stroke="#c8b07a" strokeWidth="0.7"/>
      ))}
      {/* Parapet */}
      <rect x="36" y="36" width="448" height="22" rx="2" fill="#d8c490" stroke="#b8a068" strokeWidth="1.5"/>
      {[66,106,146,186,226,266,306,346,386,426].map(x=>(
        <rect key={x} x={x} y="38" width="12" height="10" rx="1" fill="#b8a068"/>
      ))}
      {/* Win row 1 */}
      {[75,162,308,395].map(x=>(
        <g key={`a${x}`}>
          <rect x={x} y="72" width="58" height="60" rx="2" fill={wf} stroke="#b8a068" strokeWidth="1.2"/>
          {hovered&&<rect x={x} y="72" width="58" height="60" rx="2" fill={wg}/>}
          <line x1={x+29} y1="72" x2={x+29} y2={132} stroke="#b8a068" strokeWidth="0.7"/>
          <line x1={x}    y1={102} x2={x+58} y2={102} stroke="#b8a068" strokeWidth="0.7"/>
        </g>
      ))}
      {/* Win row 2 */}
      {[75,162,308,395].map(x=>(
        <g key={`b${x}`}>
          <rect x={x} y="158" width="58" height="60" rx="2" fill={wf} stroke="#b8a068" strokeWidth="1.2"/>
          {hovered&&<rect x={x} y="158" width="58" height="60" rx="2" fill={wg}/>}
          <line x1={x+29} y1="158" x2={x+29} y2={218} stroke="#b8a068" strokeWidth="0.7"/>
          <line x1={x}    y1={188} x2={x+58} y2={188} stroke="#b8a068" strokeWidth="0.7"/>
        </g>
      ))}
      {/* Win row 3 */}
      {[75,162,308,395].map(x=>(
        <g key={`c${x}`}>
          <rect x={x} y="248" width="58" height="46" rx="2" fill={hovered?"#e8d080":"#c8a860"} stroke="#b8a068" strokeWidth="1.2"/>
          {hovered&&<rect x={x} y="248" width="58" height="46" rx="2" fill={wg}/>}
          <line x1={x+29} y1="248" x2={x+29} y2={294} stroke="#b8a068" strokeWidth="0.7"/>
        </g>
      ))}
      {/* Door arch */}
      <rect x="210" y="260" width="100" height="92" rx="2" fill="#18302a"/>
      <ellipse cx="260" cy="260" rx="50" ry="26" fill="#18302a"/>
      <rect x="208" y="258" width="104" height="94" rx="3" fill="none" stroke="#c9a84c" strokeWidth="2.2"/>
      <ellipse cx="260" cy="260" rx="52" ry="28" fill="none" stroke="#c9a84c" strokeWidth="2.2"/>
      {/* Door panels */}
      <rect x="215" y="270" width="38" height="60" rx="1" fill="#0d1f1a" stroke="#c9a84c" strokeWidth="1"/>
      <rect x="267" y="270" width="38" height="60" rx="1" fill="#0d1f1a" stroke="#c9a84c" strokeWidth="1"/>
      <circle cx="252" cy="302" r="3.5" fill="#c9a84c"/>
      <circle cx="268" cy="302" r="3.5" fill="#c9a84c"/>
      {/* Sign */}
      <rect x="186" y="232" width="148" height="24" rx="3" fill="#18302a" stroke="#c9a84c" strokeWidth="1.5"/>
      <text x="260" y="248" textAnchor="middle" fill="#c9a84c" fontSize="7.5" fontFamily="Georgia,serif" letterSpacing="2.5">THE MEHMAAN MANOR</text>
      {/* Steps */}
      <rect x="192" y="350" width="136" height="7" rx="1" fill="#c8b08a"/>
      <rect x="201" y="343" width="118" height="7" rx="1" fill="#d8c098"/>
      <rect x="210" y="336" width="100" height="7" rx="1" fill="#e0c8a0"/>
      {/* Hover glow */}
      {hovered&&<rect x="50" y="52" width="420" height="300" rx="3" fill="rgba(201,168,76,0.05)"/>}
    </svg>
  );
}

/* ── Exterior trees ────────────────────────────────────── */
function TreesExt({ side }: { side: "left" | "right" }) {
  const isL = side === "left";
  const specs = [
    { p: isL ? "6%"  : "90%", s: 1.1 },
    { p: isL ? "14%" : "81%", s: 1.45 },
    { p: isL ? "2%"  : "96%", s: 0.8 },
  ];
  return (
    <>
      {specs.map((t, i) => {
        const B = Math.round(t.s * 32);
        return (
          <div key={i} className="absolute bottom-[24%] pointer-events-none"
            style={{ left: t.p, transform: "translateX(-50%)", width: B * 2 }}>
            {[1, 0.76, 0.56].map((sc, j) => (
              <div key={j} className="rounded-full mx-auto"
                style={{
                  width: B * 2 * sc, height: B * 1.9 * sc,
                  marginTop: j === 0 ? 0 : -Math.round(B * 1.9 * sc * 0.36),
                  background: ["#386128","#477534","#549040"][j],
                }}/>
            ))}
            <div className="mx-auto rounded-sm"
              style={{ width: Math.round(B * 0.32), height: Math.round(t.s * 24), background: "#5c3820" }}/>
          </div>
        );
      })}
    </>
  );
}

/* ══════════════════════════════════════════════════════════
   PHASE: ENTERING  (camera walk-in animation)
══════════════════════════════════════════════════════════ */
function EnterTransition({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1900);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      className="fixed inset-0 z-[9992] overflow-hidden"
      style={{ background: "#050c09" }}
      aria-hidden="true"
    >
      {/* Expanding door-arch shape that fills the screen */}
      <div className="manor-walkin absolute inset-0 flex items-center justify-center">
        <div
          className="manor-walkin-arch"
          style={{
            width: "clamp(100px,16vw,200px)",
            height: "clamp(120px,20vw,240px)",
            borderRadius: "50% 50% 0 0 / 60% 60% 0 0",
            background: "radial-gradient(ellipse at 50% 30%, #1a4030, #0a1810)",
            border: "2px solid rgba(201,168,76,0.5)",
          }}
        />
      </div>
      {/* Warm light burst */}
      <div
        className="manor-walkin-glow absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 40% 30% at 50% 50%, rgba(201,168,76,0.25) 0%, transparent 70%)" }}
      />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   PROPERTY DETAIL MODAL
══════════════════════════════════════════════════════════ */
function PropertyModal({
  prop,
  onClose,
}: {
  prop: ManorProperty;
  onClose: () => void;
}) {
  const isP1    = prop.id === "1";
  const bookUrl = `/homes/${prop.slug}`;
  const waTxt   = encodeURIComponent(`Hi! I'm interested in ${prop.name}. Can you share availability?`);

  const hi = isP1
    ? ["Max 3 guests","Balcony","Wi-Fi & Netflix","24 h Hot Water","CCTV Security","Power Backup"]
    : ["Max 5 guests","Studio & 2BHK","Near Medanta","Metro Nearby","Wi-Fi & Netflix","Basic Kitchen"];

  const photos = isP1
    ? [
        { src: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80&auto=format&fit=crop", lbl: "Bedroom" },
        { src: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=600&q=80&auto=format&fit=crop",  lbl: "Living Area" },
        { src: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=600&q=80&auto=format&fit=crop", lbl: "Balcony" },
      ]
    : [
        { src: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&q=80&auto=format&fit=crop", lbl: "Studio" },
        { src: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80&auto=format&fit=crop",  lbl: "Living Room" },
        { src: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80&auto=format&fit=crop",  lbl: "Kitchen" },
      ];

  return (
    <div
      className="fixed inset-0 z-[10001] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.82)", backdropFilter: "blur(10px)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Details for ${prop.name}`}
    >
      <div
        className="bg-[#faf8f4] rounded-2xl w-full max-w-md shadow-2xl manor-pop-in overflow-y-auto"
        style={{ maxHeight: "92vh" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Gold strip */}
        <div className="h-1 bg-gradient-to-r from-[#c9a84c] via-[#f0dc90] to-[#c9a84c] rounded-t-2xl" />

        <div className="p-6 pb-5 relative">
          {/* Close */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-[#1a3328]/8 hover:bg-[#1a3328]/15 text-[#1a3328]/50 hover:text-[#1a3328] text-lg transition-colors"
          >×</button>

          <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#c9a84c]">Our Property</span>
          <h3 className="font-display text-2xl text-[#1a3328] mt-1 leading-tight pr-8">{prop.name}</h3>
          <p className="text-[#1a3328]/45 text-xs mt-1">{prop.address}</p>

          {/* Price */}
          <div className="flex items-baseline gap-1.5 mt-4 pb-4 border-b border-[#1a3328]/8">
            <span className="font-display text-4xl text-[#1a3328] font-semibold">
              ₹{prop.baseRate.toLocaleString("en-IN")}
            </span>
            <span className="text-[#1a3328]/40 text-sm">/night</span>
            <span className="ml-auto text-[10px] font-mono text-[#c9a84c] bg-[#c9a84c]/10 px-2 py-0.5 rounded-full">No fees</span>
          </div>

          {/* Virtual tour strip */}
          <div className="mt-4 mb-4">
            <p className="text-[10px] font-mono tracking-widest uppercase text-[#1a3328]/35 mb-2.5">Virtual Tour</p>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {photos.map((p, i) => (
                <div key={i} className="flex-shrink-0 relative rounded-xl overflow-hidden" style={{ width: 128, height: 86 }}>
                  <img src={p.src} alt={p.lbl} loading="lazy" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                  <span className="absolute bottom-1.5 left-2 text-white/85 text-[10px] font-mono">{p.lbl}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Highlights */}
          <div className="grid grid-cols-2 gap-2 mb-5">
            {hi.map(h => (
              <div key={h} className="flex items-center gap-2 text-xs text-[#1a3328]/65 bg-[#eee9df] rounded-lg px-3 py-2.5">
                <span className="text-[#c9a84c] font-bold">✓</span>{h}
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-2.5">
            <Link
              href={bookUrl}
              className="block w-full py-4 bg-[#1a3328] text-[#f5f0e8] font-bold text-sm rounded-xl text-center hover:bg-[#0d1f1a] active:scale-[0.98] transition-all"
            >
              View Full Details &amp; Book
            </Link>
            <a
              href={`https://wa.me/918828352311?text=${waTxt}`}
              target="_blank" rel="noopener noreferrer"
              className="block w-full py-3.5 border-2 border-[#4caf6e] text-[#1a7a40] font-semibold text-sm rounded-xl text-center hover:bg-[#4caf6e] hover:text-white active:scale-[0.98] transition-all"
            >
              💬 Reserve via WhatsApp
            </a>
            <button
              onClick={onClose}
              className="w-full py-2 text-[#1a3328]/40 text-xs font-mono hover:text-[#1a3328]/65 transition-colors"
            >
              ← Back to the Manor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   PHASE: INTERIOR — true first-person 3D room

   Layout uses CSS perspective transform to create a room
   that feels like you are standing inside it.

   Structure (all elements in a perspective container):
     - Floor plane
     - Ceiling plane
     - Left wall  → Property 1 (Sector 57) photos + info
     - Right wall → Property 2 (Sector 39) photos + info
     - Back wall  → Reception desk + host panel
     - Info boards hang on back wall below desk level

   Clicking any wall opens the PropertyModal.
══════════════════════════════════════════════════════════ */
function InteriorScreen({
  properties,
  onClose,
}: {
  properties: ManorProperty[];
  onClose: () => void;
}) {
  const [entered,       setEntered]       = useState(false);
  const [selectedProp,  setSelectedProp]  = useState<ManorProperty | null>(null);
  const [activeWall,    setActiveWall]    = useState<"none" | "left" | "right" | "desk">("none");

  // Slight delay so the room fades in after the black transition
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 120);
    return () => clearTimeout(t);
  }, []);

  const prop1 = properties.find(p => p.id === "1") ?? properties[0];
  const prop2 = properties.find(p => p.id === "2") ?? properties[properties.length - 1];

  /* ── photos for wall frames ── */
  const p1Photos = [
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&q=75&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=500&q=75&auto=format&fit=crop",
  ];
  const p2Photos = [
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=500&q=75&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=75&auto=format&fit=crop",
  ];

  const [p1Img, setP1Img] = useState(0);
  const [p2Img, setP2Img] = useState(0);

  // Cycle wall photos
  useEffect(() => {
    const id = setInterval(() => {
      setP1Img(i => (i + 1) % p1Photos.length);
      setP2Img(i => (i + 1) % p2Photos.length);
    }, 3500);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {/* ═══ FULL-SCREEN 3D ROOM ═══ */}
      <div
        className="fixed inset-0 z-[9992] overflow-hidden"
        style={{
          opacity: entered ? 1 : 0,
          transition: "opacity 0.9s ease",
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Inside the Mehmaan Manor reception"
      >
        {/* ── Perspective container ──
            Everything inside here is positioned in 3D.
            The user's eye is at the front of this box.        */}
        <div
          className="absolute inset-0"
          style={{
            perspective: "900px",
            perspectiveOrigin: "50% 42%",
          }}
        >
          {/* ████ FLOOR ████ */}
          <div
            className="absolute left-0 right-0"
            style={{
              bottom: 0,
              height: "100%",
              transformOrigin: "bottom center",
              transform: "rotateX(62deg)",
              background: "repeating-linear-gradient(90deg,#2e1e0e 0,#2e1e0e 80px,#381e0a 80px,#381e0a 160px)",
            }}
          />
          {/* Floor sheen */}
          <div
            className="absolute left-0 right-0 bottom-0 pointer-events-none"
            style={{
              height: "50%",
              background: "linear-gradient(0deg,rgba(201,168,76,0.06) 0%,transparent 100%)",
              transformOrigin: "bottom center",
              transform: "rotateX(62deg)",
            }}
          />

          {/* ████ CEILING ████ */}
          <div
            className="absolute left-0 right-0 top-0"
            style={{
              height: "100%",
              transformOrigin: "top center",
              transform: "rotateX(-62deg)",
              background: "#130c06",
            }}
          />
          {/* Ceiling light strip */}
          <div
            className="absolute left-1/2 top-0 -translate-x-1/2"
            style={{
              width: "30%",
              height: "100%",
              transformOrigin: "top center",
              transform: "rotateX(-62deg)",
              background: "linear-gradient(180deg,rgba(255,240,160,0.18) 0%,transparent 60%)",
              pointerEvents: "none",
            }}
          />

          {/* ████ BACK WALL ████ */}
          <div
            className="absolute left-0 right-0"
            style={{
              top: "12%",
              bottom: "12%",
              transform: "translateZ(-420px)",
              background: "linear-gradient(180deg,#1a1208 0%,#2a1a0a 100%)",
              borderTop: "2px solid rgba(201,168,76,0.1)",
              borderBottom: "2px solid rgba(201,168,76,0.1)",
            }}
          >
            {/* Wainscoting panels */}
            <div className="absolute inset-x-4 bottom-0 h-1/3" style={{ borderTop: "1.5px solid rgba(201,168,76,0.12)", background: "rgba(0,0,0,0.2)" }} />
            {/* Chandelier drop from ceiling */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
              <div className="w-px bg-[#c9a84c]/30" style={{ height: 30 }} />
              <div className="w-12 h-0.5 bg-[#c9a84c]/20 rounded-full" />
              <div className="w-6 h-5 rounded-full border border-[#c9a84c]/30 flex items-center justify-center"
                style={{ background: "rgba(201,168,76,0.08)", marginTop: 2 }}>
                <div className="w-2 h-2 rounded-full" style={{ background: "#fff8c0", boxShadow: "0 0 14px 7px rgba(255,240,140,0.55)" }} />
              </div>
            </div>
          </div>

          {/* ████ LEFT WALL ████ */}
          <div
            className="absolute top-0 bottom-0"
            style={{
              left: 0,
              width: "50%",
              transformOrigin: "left center",
              transform: "rotateY(58deg)",
              background: "linear-gradient(90deg,#0e0802 0%,#1a1208 100%)",
              borderRight: "1.5px solid rgba(201,168,76,0.08)",
            }}
          >
            {/* Wall trim */}
            <div className="absolute inset-y-0 right-0 w-px bg-[#c9a84c]/15" />
          </div>

          {/* ████ RIGHT WALL ████ */}
          <div
            className="absolute top-0 bottom-0"
            style={{
              right: 0,
              width: "50%",
              transformOrigin: "right center",
              transform: "rotateY(-58deg)",
              background: "linear-gradient(270deg,#0e0802 0%,#1a1208 100%)",
              borderLeft: "1.5px solid rgba(201,168,76,0.08)",
            }}
          >
            <div className="absolute inset-y-0 left-0 w-px bg-[#c9a84c]/15" />
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════
            ROOM CONTENT — flat layer on top of the 3D shell.
            Uses perspective-aware positioning to feel "in" the room.
            All interactive elements live here.
        ═══════════════════════════════════════════════════════ */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ perspective: "900px", perspectiveOrigin: "50% 42%" }}
        >

          {/* ──────────────── LEFT WALL FRAME ──────────────── */}
          <button
            onClick={() => { setActiveWall("left"); setSelectedProp(prop1); }}
            aria-label={`Explore ${prop1.name}`}
            aria-pressed={activeWall === "left"}
            className="absolute focus:outline-none group"
            style={{
              /* Position on the left wall surface */
              left: "2%",
              top: "15%",
              width: "21%",
              height: "55%",
              transformOrigin: "left center",
              transform: `rotateY(58deg) ${activeWall === "left" ? "scale(1.03)" : "scale(1)"}`,
              transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            <WallFrame
              photos={p1Photos}
              currentPhoto={p1Img}
              property={prop1}
              label="Sector 57"
              active={activeWall === "left"}
            />
          </button>

          {/* ──────────────── RIGHT WALL FRAME ──────────────── */}
          <button
            onClick={() => { setActiveWall("right"); setSelectedProp(prop2); }}
            aria-label={`Explore ${prop2.name}`}
            aria-pressed={activeWall === "right"}
            className="absolute focus:outline-none group"
            style={{
              right: "2%",
              top: "15%",
              width: "21%",
              height: "55%",
              transformOrigin: "right center",
              transform: `rotateY(-58deg) ${activeWall === "right" ? "scale(1.03)" : "scale(1)"}`,
              transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            <WallFrame
              photos={p2Photos}
              currentPhoto={p2Img}
              property={prop2}
              label="Sector 39"
              active={activeWall === "right"}
            />
          </button>

          {/* ──────────────── BACK WALL CONTENT ──────────────── */}
          {/* Reception desk */}
          <div
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              bottom: "14%",
              width: "clamp(220px,34%,420px)",
              transform: "translateX(-50%) translateZ(-240px) scale(0.88)",
            }}
          >
            <ReceptionDesk
              active={activeWall === "desk"}
              onOpen={() => setActiveWall(activeWall === "desk" ? "none" : "desk")}
            />
          </div>

          {/* Info boards — row above desk */}
          <div
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              bottom: "48%",
              width: "clamp(280px,44%,540px)",
              transform: "translateX(-50%) translateZ(-240px) scale(0.88)",
            }}
          >
            <div className="flex gap-2">
              <HowItWorksBoard />
              <GuestReviewsBoard />
              <HostsBoard />
            </div>
          </div>

          {/* Heading HUD — top center */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 pointer-events-none">
            <div className="flex items-center gap-2">
              <div className="h-px w-6 bg-[#c9a84c]/30" />
              <span className="text-[#c9a84c]/50 text-[9px] font-mono tracking-[0.3em] uppercase">Reception</span>
              <div className="h-px w-6 bg-[#c9a84c]/30" />
            </div>
            <p className="font-display text-white/75 text-sm md:text-base" style={{ letterSpacing: "0.04em" }}>
              The Mehmaan Manor
            </p>
          </div>

          {/* Wall hint labels */}
          {activeWall === "none" && (
            <>
              <div
                className="absolute pointer-events-none manor-pop-in"
                style={{ left: "3%", top: "72%", transform: "rotateY(58deg)", transformOrigin: "left center" }}
              >
                <span className="text-[#c9a84c]/55 text-[9px] font-mono tracking-widest whitespace-nowrap">← Tap wall to explore</span>
              </div>
              <div
                className="absolute pointer-events-none manor-pop-in"
                style={{ right: "3%", top: "72%", transform: "rotateY(-58deg)", transformOrigin: "right center" }}
              >
                <span className="text-[#c9a84c]/55 text-[9px] font-mono tracking-widest whitespace-nowrap">Tap wall to explore →</span>
              </div>
            </>
          )}
        </div>

        {/* ── Vignette overlay — darkens edges for room feel ── */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{ background: "radial-gradient(ellipse 75% 65% at 50% 45%, transparent 0%, rgba(0,0,0,0.55) 100%)" }}
        />

        {/* ── Warm floor light ── */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none z-10"
          style={{ width: "50%", height: "25%", background: "radial-gradient(ellipse at 50% 100%, rgba(201,168,76,0.08) 0%, transparent 70%)" }}
        />

        {/* ── Hint footer ── */}
        <div
          className="absolute bottom-0 left-0 right-0 z-20 py-2.5 px-4 text-center pointer-events-none"
          style={{ background: "linear-gradient(0deg,rgba(5,4,2,0.90) 0%,transparent 100%)" }}
        >
          <p className="text-[#c9a84c]/35 text-[10px] font-mono tracking-widest">
            Left wall: Sector 57 · Right wall: Sector 39 · Center: Book now
          </p>
        </div>

        <ExitBtn onClick={onClose} />
      </div>

      {/* Property modal (above everything) */}
      {selectedProp && (
        <PropertyModal
          prop={selectedProp}
          onClose={() => { setSelectedProp(null); setActiveWall("none"); }}
        />
      )}
    </>
  );
}

/* ── Wall photo frame ──────────────────────────────────── */
function WallFrame({
  photos,
  currentPhoto,
  property,
  label,
  active,
}: {
  photos: string[];
  currentPhoto: number;
  property: ManorProperty;
  label: string;
  active: boolean;
}) {
  return (
    <div
      className="w-full h-full flex flex-col rounded-xl overflow-hidden"
      style={{
        border: `2px solid ${active ? "rgba(201,168,76,0.65)" : "rgba(201,168,76,0.18)"}`,
        background: "#1a1208",
        boxShadow: active ? "0 0 30px rgba(201,168,76,0.2)" : "none",
        transition: "all 0.4s ease",
      }}
    >
      {/* Label tab */}
      <div className="px-3 py-2 flex items-center justify-between border-b border-[#c9a84c]/12">
        <span className="text-[#c9a84c] text-[9px] font-mono tracking-widest uppercase">{label}</span>
        {active
          ? <span className="text-[#c9a84c]/70 text-[8px] font-mono">Tap for details</span>
          : <span className="text-[#c9a84c]/30 text-[8px] font-mono">Tap →</span>
        }
      </div>

      {/* Photo area */}
      <div className="relative flex-1 overflow-hidden min-h-0">
        {photos.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={`${property.name} — ${i + 1}`}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              opacity: i === currentPhoto ? 1 : 0,
              transition: "opacity 1s ease",
            }}
          />
        ))}
        {/* Photo overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1208] via-transparent to-transparent" />
        {/* Gold frame inset */}
        <div className="absolute inset-0 pointer-events-none" style={{ border: "6px solid rgba(201,168,76,0.10)", borderRadius: 10 }} />
      </div>

      {/* Property info */}
      <div className="px-3 py-2.5">
        <p className="text-[#f5f0e8]/85 text-[11px] font-semibold leading-tight">
          {property.name.replace("The Mehmaan Manor — ", "")}
        </p>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-[#c9a84c] font-mono text-sm font-bold">
            ₹{property.baseRate.toLocaleString("en-IN")}
          </span>
          <span className="text-[#f5f0e8]/30 text-[9px]">/night</span>
        </div>
        <p className={cn("mt-1.5 text-center text-[9px] font-mono py-1 rounded-md transition-colors",
          active
            ? "bg-[#c9a84c]/20 text-[#c9a84c]"
            : "text-[#c9a84c]/40 hover:text-[#c9a84c]/60",
        )}>
          {active ? "✦ Click for full details" : "View Details / Take Tour"}
        </p>
      </div>
    </div>
  );
}

/* ── Reception desk ────────────────────────────────────── */
function ReceptionDesk({ active, onOpen }: { active: boolean; onOpen: () => void }) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{
      border: `1px solid ${active ? "rgba(201,168,76,0.5)" : "rgba(201,168,76,0.18)"}`,
      background: "linear-gradient(135deg,#1a1208 0%,#251808 100%)",
      boxShadow: active ? "0 0 28px rgba(201,168,76,0.18)" : "0 4px 20px rgba(0,0,0,0.6)",
      transition: "all 0.4s ease",
    }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#c9a84c]/12">
        <div>
          <p className="text-[#c9a84c] text-[8px] font-mono tracking-[0.3em] uppercase">Reception</p>
          <p className="font-display text-[#f5f0e8]/90 text-base mt-0.5">The Mehmaan Manor</p>
        </div>
        <div className="text-xl text-[#c9a84c]/60 select-none">⌂</div>
      </div>

      {/* Action grid — always visible */}
      <div className="p-3 grid grid-cols-3 gap-2">
        <Link
          href="/book"
          className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl text-center transition-all hover:bg-[#c9a84c]/10 border border-[#c9a84c]/15 hover:border-[#c9a84c]/45 focus:outline-none focus:ring-1 focus:ring-[#c9a84c]"
        >
          <span className="text-lg select-none">📅</span>
          <span className="text-[#c9a84c] text-[10px] font-bold leading-tight">Book Now</span>
          <span className="text-[#f5f0e8]/30 text-[8px]">Direct</span>
        </Link>
        <a
          href="https://wa.me/918828352311?text=Hi!%20I'd%20like%20to%20book%20at%20The%20Mehmaan%20Manor."
          target="_blank" rel="noopener noreferrer"
          className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl text-center transition-all hover:bg-[#25d366]/10 border border-[#25d366]/15 hover:border-[#25d366]/45 focus:outline-none focus:ring-1 focus:ring-[#25d366]"
        >
          <span className="text-lg select-none">💬</span>
          <span className="text-[#4caf6e] text-[10px] font-bold leading-tight">WhatsApp</span>
          <span className="text-[#f5f0e8]/30 text-[8px]">Simran</span>
        </a>
        <Link
          href="/homes"
          className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl text-center transition-all hover:bg-[#f5f0e8]/6 border border-[#f5f0e8]/10 hover:border-[#f5f0e8]/25 focus:outline-none focus:ring-1 focus:ring-white/30"
        >
          <span className="text-lg select-none">🏠</span>
          <span className="text-[#f5f0e8]/70 text-[10px] font-bold leading-tight">Browse</span>
          <span className="text-[#f5f0e8]/30 text-[8px]">All homes</span>
        </Link>
      </div>

      {/* Simran & Jyoti name row */}
      <div className="px-4 pb-3 flex items-center justify-center gap-3 border-t border-[#c9a84c]/8 pt-2.5">
        <span className="text-[#f5f0e8]/40 text-[9px] font-mono">Hosts:</span>
        <span className="text-[#f5f0e8]/70 text-[10px] font-semibold">Simran</span>
        <span className="text-[#c9a84c]/30 text-[8px]">•</span>
        <span className="text-[#f5f0e8]/70 text-[10px] font-semibold">Jyoti</span>
        <span className="relative flex h-1.5 w-1.5 ml-1">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4caf6e] opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#4caf6e]" />
        </span>
        <span className="text-[#4caf6e]/60 text-[8px] font-mono">Online</span>
      </div>
    </div>
  );
}

/* ── How It Works board ────────────────────────────────── */
function HowItWorksBoard() {
  return (
    <div className="flex-1 min-w-0 rounded-xl p-3 flex flex-col gap-2.5"
      style={{ background: "#130e06", border: "1px solid rgba(201,168,76,0.14)", boxShadow: "inset 0 1px 0 rgba(201,168,76,0.07)" }}>
      <p className="text-[#c9a84c] text-[7.5px] font-mono tracking-[0.28em] uppercase text-center">How It Works</p>
      {[
        { n: "01", t: "Browse", d: "Pick a home you love." },
        { n: "02", t: "Book",   d: "Direct — no fees." },
        { n: "03", t: "Stay",   d: "Hosts welcome you." },
      ].map(s => (
        <div key={s.n} className="flex items-start gap-2">
          <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-mono font-bold text-[#c9a84c]"
            style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)" }}>
            {s.n}
          </span>
          <div>
            <p className="text-[#f5f0e8]/80 text-[10px] font-semibold leading-tight">{s.t}</p>
            <p className="text-[#f5f0e8]/35 text-[8.5px] leading-tight mt-0.5">{s.d}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Guest Reviews board ───────────────────────────────── */
function GuestReviewsBoard() {
  const reviews = [
    { name: "Priya M.", loc: "Delhi",     text: "Felt like home! Simran is an amazing host." },
    { name: "Rahul S.", loc: "Mumbai",    text: "Fast Wi-Fi, spotless rooms, zero hassle." },
    { name: "Anita K.", loc: "Bengaluru", text: "Sector 39 is perfect for our family trips!" },
  ];
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI(x => (x + 1) % reviews.length), 3800);
    return () => clearInterval(t);
  }, [reviews.length]);

  const r = reviews[i];

  return (
    <div className="flex-1 min-w-0 rounded-xl p-3 flex flex-col gap-2"
      style={{ background: "#130e06", border: "1px solid rgba(201,168,76,0.14)", boxShadow: "inset 0 1px 0 rgba(201,168,76,0.07)" }}>
      <p className="text-[#c9a84c] text-[7.5px] font-mono tracking-[0.28em] uppercase text-center">Guest Reviews</p>
      <div className="flex justify-center gap-0.5">
        {Array.from({ length: 5 }).map((_, j) => (
          <span key={j} className="text-[#c9a84c] text-[9px]">★</span>
        ))}
      </div>
      <div key={i} className="flex-1 flex flex-col justify-between manor-pop-in">
        <p className="text-[#f5f0e8]/65 text-[9px] leading-relaxed italic">&ldquo;{r.text}&rdquo;</p>
        <div className="flex items-center justify-between mt-2">
          <div>
            <p className="text-[#f5f0e8]/75 text-[9px] font-semibold">{r.name}</p>
            <p className="text-[#c9a84c]/45 text-[8px] font-mono">{r.loc}</p>
          </div>
          <div className="flex gap-1">
            {reviews.map((_, j) => (
              <button key={j} onClick={() => setI(j)} aria-label={`Review ${j + 1}`}
                className={cn("rounded-full transition-all", j === i ? "w-3 h-1.5 bg-[#c9a84c]" : "w-1.5 h-1.5 bg-[#c9a84c]/25")} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Hosts board ───────────────────────────────────────── */
function HostsBoard() {
  return (
    <div className="flex-1 min-w-0 rounded-xl p-3 flex flex-col gap-2.5"
      style={{ background: "#130e06", border: "1px solid rgba(201,168,76,0.14)", boxShadow: "inset 0 1px 0 rgba(201,168,76,0.07)" }}>
      <p className="text-[#c9a84c] text-[7.5px] font-mono tracking-[0.28em] uppercase text-center">Your Hosts</p>
      {[
        { name: "Simran", role: "Host & Manager", e: "👩‍💼", ph: "+91 88283 52311" },
        { name: "Jyoti",  role: "Host & Support",  e: "👩‍🍳", ph: "+91 87965 68002" },
      ].map(h => (
        <div key={h.name} className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0"
            style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)" }}>
            {h.e}
          </div>
          <div className="min-w-0">
            <p className="text-[#f5f0e8]/85 text-[10px] font-semibold">{h.name}</p>
            <p className="text-[#f5f0e8]/35 text-[8px]">{h.role}</p>
          </div>
        </div>
      ))}
      <div className="pt-2 border-t border-[#c9a84c]/10 flex items-center justify-center gap-1.5">
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4caf6e] opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#4caf6e]" />
        </span>
        <p className="text-[#f5f0e8]/35 text-[8px] font-mono">Responds in &lt;5 min</p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   ROOT EXPORT
══════════════════════════════════════════════════════════ */
export function ManorExperience({
  properties,
  onPhaseChange,
}: {
  properties: ManorProperty[];
  onPhaseChange?: (active: boolean) => void;
}) {
  const [phase, setPhase] = useState<Phase>("idle");

  const go = useCallback((p: Phase) => {
    setPhase(p);
    onPhaseChange?.(p !== "idle");
  }, [onPhaseChange]);

  const start = useCallback(() => {
    document.body.style.overflow = "hidden";
    go("blackout");
  }, [go]);

  const exit = useCallback(() => {
    document.body.style.overflow = "";
    go("idle");
  }, [go]);

  useEffect(() => () => { document.body.style.overflow = ""; }, []);

  return (
    <>
      {/* ── Trigger button ── shown only when idle */}
      {phase === "idle" && (
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
      )}

      {phase === "blackout"  && <BlackoutScreen   onDone={() => go("intro")}    />}
      {phase === "intro"     && <IntroScreen       onDone={() => go("exterior")} />}
      {phase === "exterior"  && <ExteriorScreen    onEnter={() => go("entering")} onClose={exit} />}
      {phase === "entering"  && <EnterTransition   onDone={() => go("interior")} />}
      {phase === "interior"  && <InteriorScreen    properties={properties} onClose={exit} />}
    </>
  );
}
