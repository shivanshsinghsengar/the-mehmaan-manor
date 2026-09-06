"use client";

/**
 * ManorExperience — "Enter the Manor Experience"
 *
 * Phase flow:
 *   idle → blackout → intro → exterior → entering → interior (360° panoramic)
 *
 * Interior: CSS 3D cubemap with 4 faces.
 * Drag left/right (mouse or touch) to rotate around 360°.
 *   Face 0°   → ENTRY  (welcome + compass)
 *   Face 90°  → Sector 57  (Property 1, right wall)
 *   Face 180° → RECEPTION  (Book Now + hosts + photo frames)
 *   Face 270° → Sector 39  (Property 2, left wall)
 */

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";

/* ─── types ──────────────────────────────────────────────── */
type Phase = "idle" | "blackout" | "intro" | "exterior" | "entering" | "interior";

export interface ManorProperty {
  id: string;
  name: string;
  slug: string;
  baseRate: number;
  address: string;
}

/* ─── utility ────────────────────────────────────────────── */
function cn(...c: (string | boolean | undefined | null)[]) {
  return c.filter(Boolean).join(" ");
}

/* ══════════════════════════════════════════════════════════
   EXIT BUTTON
══════════════════════════════════════════════════════════ */
function ExitBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Exit experience"
      className="fixed top-4 right-4 z-[10000] inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono tracking-wide transition-all select-none focus:outline-none focus:ring-2 focus:ring-white/40"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.8)" }}
    >
      <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true">
        <path d="M1 1l7 7M8 1L1 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      Exit Experience
    </button>
  );
}

/* ══════════════════════════════════════════════════════════
   BLACKOUT
══════════════════════════════════════════════════════════ */
function BlackoutScreen({ onDone }: { onDone: () => void }) {
  const [opacity, setOpacity] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setOpacity(1), 30);
    const t2 = setTimeout(() => onDone(), 550);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);
  return (
    <div className="fixed inset-0 z-[9990] bg-black pointer-events-none"
      style={{ opacity, transition: "opacity 0.45s ease-in" }} aria-hidden="true" />
  );
}

/* ══════════════════════════════════════════════════════════
   INTRO TEXT
══════════════════════════════════════════════════════════ */
function IntroScreen({ onDone }: { onDone: () => void }) {
  const [idx, setIdx] = useState(0);
  const [vis, setVis] = useState<"in" | "hold" | "out">("in");
  const lines = [
    { h: "The Mehmaan Manor", s: "Gurugram · Haryana · India" },
    { h: "Feel like Mehmaan",  s: "A home away from home." },
  ];
  useEffect(() => {
    const T = (ms: number, fn: () => void) => setTimeout(fn, ms);
    const ids = [
      T(800,  () => setVis("hold")),
      T(2100, () => setVis("out")),
      T(2800, () => { setIdx(1); setVis("in"); }),
      T(3600, () => setVis("hold")),
      T(4900, () => setVis("out")),
      T(5600, () => onDone()),
    ];
    return () => ids.forEach(clearTimeout);
  }, [onDone]);
  const line = lines[idx];
  return (
    <div className="fixed inset-0 z-[9991] flex items-center justify-center" style={{ background: "#050c09" }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 40% at 50% 55%, rgba(201,168,76,0.12) 0%, transparent 70%)" }} />
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {Array.from({ length: 20 }).map((_, i) => (
          <span key={i} className="absolute rounded-full" style={{
            width: 2 + (i % 3), height: 2 + (i % 3), background: "#c9a84c",
            opacity: 0.08 + (i % 4) * 0.05,
            left: `${4 + i * 4.7}%`, top: `${10 + (i % 6) * 13}%`,
            animation: `manorFloat ${2.5 + (i % 4) * 0.8}s ease-in-out ${i * 0.3}s infinite alternate`,
          }} />
        ))}
      </div>
      <div key={idx} className={cn("relative text-center px-6 max-w-2xl manor-intro-text",
        vis === "in" && "manor-intro-fadein", vis === "hold" && "manor-intro-hold", vis === "out" && "manor-intro-fadeout")}>
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#c9a84c]/50" />
          <span className="text-[#c9a84c] text-xs select-none">◆</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#c9a84c]/50" />
        </div>
        <h2 className="font-display text-white font-light tracking-wide"
          style={{ fontSize: "clamp(2.4rem, 8vw, 5.5rem)", lineHeight: 1.05 }}>
          {line.h}
        </h2>
        <p className="mt-5 font-mono text-sm tracking-[0.3em] uppercase text-[#c9a84c]/70">{line.s}</p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   EXTERIOR
══════════════════════════════════════════════════════════ */
function ExteriorScreen({ onEnter, onClose }: { onEnter: () => void; onClose: () => void }) {
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 60); return () => clearTimeout(t); }, []);

  return (
    <div className="fixed inset-0 z-[9991] overflow-hidden"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.7s ease",
        background: "linear-gradient(180deg,#6fa8cf 0%,#aed4ea 22%,#c8e6c0 55%,#7aaa6a 100%)" }}
      role="dialog" aria-modal="true">
      {/* Clouds */}
      {[{t:"7%",l:"8%",w:"28%"},{t:"12%",l:"55%",w:"20%"},{t:"5%",l:"35%",w:"16%"}].map((c,i)=>(
        <div key={i} className="absolute rounded-full blur-sm pointer-events-none"
          style={{ top:c.t,left:c.l,width:c.w,height:"3%",background:"rgba(255,255,255,0.20)" }} />
      ))}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{ height:"30%",background:"linear-gradient(180deg,#7aaa6a 0%,#4d7840 100%)" }} />
      <div className="absolute bottom-0 left-1/2 pointer-events-none"
        style={{ transform:"translateX(-50%)",width:"clamp(60px,10vw,120px)",height:"33%",
          background:"linear-gradient(180deg,#c8b890 0%,#9a8c6a 100%)",
          clipPath:"polygon(10% 0%,90% 0%,100% 100%,0% 100%)" }} />
      <Trees side="left" /><Trees side="right" />
      <button
        onClick={onEnter}
        onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)} onBlur={() => setHovered(false)}
        aria-label="Click to enter the Manor"
        className="absolute left-1/2 bottom-[26%] focus:outline-none"
        style={{ width:"clamp(200px,38vw,480px)",
          transform:`translateX(-50%) scale(${hovered ? 1.03 : 1})`,
          transition:"transform 0.5s cubic-bezier(0.22,1,0.36,1)" }}>
        <BuildingSVG hovered={hovered} />
        <div className="mt-3 flex justify-center"
          style={{ opacity: visible ? 1 : 0, transition:"opacity 1.2s ease 0.8s" }}>
          <span className="px-5 py-2 rounded-full text-xs font-mono tracking-widest"
            style={{ background: hovered ? "rgba(26,51,40,0.90)" : "rgba(0,0,0,0.38)",
              color: hovered ? "#c9a84c" : "rgba(255,255,255,0.75)",
              border: `1px solid ${hovered ? "rgba(201,168,76,0.45)" : "rgba(255,255,255,0.18)"}`,
              backdropFilter:"blur(8px)", transition:"all 0.3s ease" }}>
            {hovered ? "✦  Click to Enter the Manor  ✦" : "↑  Step inside the Manor"}
          </span>
        </div>
      </button>
      <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-mono tracking-widest"
          style={{ background:"rgba(0,0,0,0.28)",backdropFilter:"blur(8px)",color:"rgba(255,255,255,0.65)",border:"1px solid rgba(255,255,255,0.1)" }}>
          📍 Gurugram · Haryana · India
        </span>
      </div>
      <ExitBtn onClick={onClose} />
    </div>
  );
}

function BuildingSVG({ hovered }: { hovered: boolean }) {
  const wf = hovered ? "#f5e8b8" : "#d8c090";
  const wg = hovered ? "rgba(255,230,130,0.30)" : "transparent";
  return (
    <svg viewBox="0 0 520 360" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full drop-shadow-2xl" aria-hidden="true">
      <rect x="50" y="52" width="420" height="300" rx="3" fill="#ede2c8" stroke="#c8b07a" strokeWidth="1.5"/>
      {[100,148,196,244,292,340].map(y=><line key={y} x1="50" y1={y} x2="470" y2={y} stroke="#c8b07a" strokeWidth="0.7"/>)}
      <rect x="36" y="36" width="448" height="22" rx="2" fill="#d8c490" stroke="#b8a068" strokeWidth="1.5"/>
      {[66,106,146,186,226,266,306,346,386,426].map(x=><rect key={x} x={x} y="38" width="12" height="10" rx="1" fill="#b8a068"/>)}
      {[75,162,308,395].map(x=>(
        <g key={`a${x}`}>
          <rect x={x} y="72" width="58" height="60" rx="2" fill={wf} stroke="#b8a068" strokeWidth="1.2"/>
          {hovered&&<rect x={x} y="72" width="58" height="60" rx="2" fill={wg}/>}
          <line x1={x+29} y1="72" x2={x+29} y2={132} stroke="#b8a068" strokeWidth="0.7"/>
          <line x1={x} y1={102} x2={x+58} y2={102} stroke="#b8a068" strokeWidth="0.7"/>
        </g>
      ))}
      {[75,162,308,395].map(x=>(
        <g key={`b${x}`}>
          <rect x={x} y="158" width="58" height="60" rx="2" fill={wf} stroke="#b8a068" strokeWidth="1.2"/>
          {hovered&&<rect x={x} y="158" width="58" height="60" rx="2" fill={wg}/>}
          <line x1={x+29} y1="158" x2={x+29} y2={218} stroke="#b8a068" strokeWidth="0.7"/>
          <line x1={x} y1={188} x2={x+58} y2={188} stroke="#b8a068" strokeWidth="0.7"/>
        </g>
      ))}
      {[75,162,308,395].map(x=>(
        <g key={`c${x}`}>
          <rect x={x} y="248" width="58" height="46" rx="2" fill={hovered?"#e8d080":"#c8a860"} stroke="#b8a068" strokeWidth="1.2"/>
          {hovered&&<rect x={x} y="248" width="58" height="46" rx="2" fill={wg}/>}
          <line x1={x+29} y1="248" x2={x+29} y2={294} stroke="#b8a068" strokeWidth="0.7"/>
        </g>
      ))}
      <rect x="210" y="260" width="100" height="92" rx="2" fill="#18302a"/>
      <ellipse cx="260" cy="260" rx="50" ry="26" fill="#18302a"/>
      <rect x="208" y="258" width="104" height="94" rx="3" fill="none" stroke="#c9a84c" strokeWidth="2.2"/>
      <ellipse cx="260" cy="260" rx="52" ry="28" fill="none" stroke="#c9a84c" strokeWidth="2.2"/>
      <rect x="215" y="270" width="38" height="60" rx="1" fill="#0d1f1a" stroke="#c9a84c" strokeWidth="1"/>
      <rect x="267" y="270" width="38" height="60" rx="1" fill="#0d1f1a" stroke="#c9a84c" strokeWidth="1"/>
      <circle cx="252" cy="302" r="3.5" fill="#c9a84c"/>
      <circle cx="268" cy="302" r="3.5" fill="#c9a84c"/>
      <rect x="186" y="232" width="148" height="24" rx="3" fill="#18302a" stroke="#c9a84c" strokeWidth="1.5"/>
      <text x="260" y="248" textAnchor="middle" fill="#c9a84c" fontSize="7.5" fontFamily="Georgia,serif" letterSpacing="2.5">THE MEHMAAN MANOR</text>
      <rect x="192" y="350" width="136" height="7" rx="1" fill="#c8b08a"/>
      <rect x="201" y="343" width="118" height="7" rx="1" fill="#d8c098"/>
      <rect x="210" y="336" width="100" height="7" rx="1" fill="#e0c8a0"/>
      {hovered&&<rect x="50" y="52" width="420" height="300" rx="3" fill="rgba(201,168,76,0.05)"/>}
    </svg>
  );
}

function Trees({ side }: { side: "left" | "right" }) {
  const isL = side === "left";
  const specs = [{ p:isL?"6%":"90%",s:1.1 },{ p:isL?"14%":"81%",s:1.45 },{ p:isL?"2%":"96%",s:0.8 }];
  return (
    <>
      {specs.map((t,i) => {
        const B = Math.round(t.s*32);
        return (
          <div key={i} className="absolute bottom-[24%] pointer-events-none"
            style={{ left:t.p,transform:"translateX(-50%)",width:B*2 }}>
            {[1,0.76,0.56].map((sc,j)=>(
              <div key={j} className="rounded-full mx-auto"
                style={{ width:B*2*sc,height:B*1.9*sc,
                  marginTop:j===0?0:-Math.round(B*1.9*sc*0.36),
                  background:["#386128","#477534","#549040"][j] }} />
            ))}
            <div className="mx-auto rounded-sm"
              style={{ width:Math.round(B*0.32),height:Math.round(t.s*24),background:"#5c3820" }} />
          </div>
        );
      })}
    </>
  );
}

/* ══════════════════════════════════════════════════════════
   ENTER TRANSITION
══════════════════════════════════════════════════════════ */
function EnterTransition({ onDone }: { onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 1900); return () => clearTimeout(t); }, [onDone]);
  return (
    <div className="fixed inset-0 z-[9992] overflow-hidden flex items-center justify-center" style={{ background:"#050c09" }} aria-hidden="true">
      <div className="manor-walkin absolute inset-0 flex items-center justify-center">
        <div className="manor-walkin-arch" style={{ width:"clamp(100px,16vw,200px)",height:"clamp(120px,20vw,240px)",borderRadius:"50% 50% 0 0 / 60% 60% 0 0",background:"radial-gradient(ellipse at 50% 30%, #1a4030, #0a1810)",border:"2px solid rgba(201,168,76,0.5)" }} />
      </div>
      <div className="manor-walkin-glow absolute inset-0 pointer-events-none"
        style={{ background:"radial-gradient(ellipse 40% 30% at 50% 50%, rgba(201,168,76,0.25) 0%, transparent 70%)" }} />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   PROPERTY DETAIL MODAL
══════════════════════════════════════════════════════════ */
function PropertyModal({ prop, onClose }: { prop: ManorProperty; onClose: () => void }) {
  const isP1 = prop.id === "1";
  const bookUrl = `/homes/${prop.slug}`;
  const waTxt = encodeURIComponent(`Hi! I'm interested in ${prop.name}. Can you share availability?`);
  const hi = isP1
    ? ["Max 3 guests","Balcony","Wi-Fi & Netflix","24h Hot Water","CCTV Security","Power Backup"]
    : ["Max 5 guests","Studio & 2BHK","Near Medanta","Metro Nearby","Wi-Fi & Netflix","Basic Kitchen"];
  const photos = isP1
    ? [
        { src:"https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80&auto=format&fit=crop",lbl:"Bedroom" },
        { src:"https://images.unsplash.com/photo-1554995207-c18c203602cb?w=600&q=80&auto=format&fit=crop",lbl:"Living Area" },
        { src:"https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=600&q=80&auto=format&fit=crop",lbl:"Balcony" },
      ]
    : [
        { src:"https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&q=80&auto=format&fit=crop",lbl:"Studio" },
        { src:"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80&auto=format&fit=crop",lbl:"Living Room" },
        { src:"https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80&auto=format&fit=crop",lbl:"Kitchen" },
      ];

  return (
    <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4"
      style={{ background:"rgba(0,0,0,0.82)",backdropFilter:"blur(10px)" }}
      onClick={onClose} role="dialog" aria-modal="true">
      <div className="bg-[#faf8f4] rounded-2xl w-full max-w-md shadow-2xl manor-pop-in overflow-y-auto"
        style={{ maxHeight:"92vh" }} onClick={e=>e.stopPropagation()}>
        <div className="h-1 bg-gradient-to-r from-[#c9a84c] via-[#f0dc90] to-[#c9a84c] rounded-t-2xl" />
        <div className="p-6 pb-5 relative">
          <button onClick={onClose} aria-label="Close"
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-[#1a3328]/8 hover:bg-[#1a3328]/15 text-[#1a3328]/50 hover:text-[#1a3328] text-lg transition-colors">
            ×
          </button>
          <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#c9a84c]">Our Property</span>
          <h3 className="font-display text-2xl text-[#1a3328] mt-1 leading-tight pr-8">{prop.name}</h3>
          <p className="text-[#1a3328]/45 text-xs mt-1">{prop.address}</p>
          <div className="flex items-baseline gap-1.5 mt-4 pb-4 border-b border-[#1a3328]/8">
            <span className="font-display text-4xl text-[#1a3328] font-semibold">₹{prop.baseRate.toLocaleString("en-IN")}</span>
            <span className="text-[#1a3328]/40 text-sm">/night</span>
            <span className="ml-auto text-[10px] font-mono text-[#c9a84c] bg-[#c9a84c]/10 px-2 py-0.5 rounded-full">No fees</span>
          </div>
          <div className="mt-4 mb-4">
            <p className="text-[10px] font-mono tracking-widest uppercase text-[#1a3328]/35 mb-2.5">Virtual Tour</p>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {photos.map((p,i)=>(
                <div key={i} className="flex-shrink-0 relative rounded-xl overflow-hidden" style={{ width:128,height:86 }}>
                  <img src={p.src} alt={p.lbl} loading="lazy" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent"/>
                  <span className="absolute bottom-1.5 left-2 text-white/85 text-[10px] font-mono">{p.lbl}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-5">
            {hi.map(h=>(
              <div key={h} className="flex items-center gap-2 text-xs text-[#1a3328]/65 bg-[#eee9df] rounded-lg px-3 py-2.5">
                <span className="text-[#c9a84c] font-bold">✓</span>{h}
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2.5">
            <Link href={bookUrl} className="block w-full py-4 bg-[#1a3328] text-[#f5f0e8] font-bold text-sm rounded-xl text-center hover:bg-[#0d1f1a] active:scale-[0.98] transition-all">
              View Full Details &amp; Book
            </Link>
            <a href={`https://wa.me/918828352311?text=${waTxt}`} target="_blank" rel="noopener noreferrer"
              className="block w-full py-3.5 border-2 border-[#4caf6e] text-[#1a7a40] font-semibold text-sm rounded-xl text-center hover:bg-[#4caf6e] hover:text-white active:scale-[0.98] transition-all">
              💬 Reserve via WhatsApp
            </a>
            <button onClick={onClose} className="w-full py-2 text-[#1a3328]/40 text-xs font-mono hover:text-[#1a3328]/65 transition-colors">
              ← Back to the Manor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   HOST WELCOME BUBBLE
══════════════════════════════════════════════════════════ */
function HostWelcome({ onDone }: { onDone: () => void }) {
  const [vis, setVis] = useState<"in"|"hold"|"out">("in");
  useEffect(() => {
    const ids = [
      setTimeout(() => setVis("hold"), 600),
      setTimeout(() => setVis("out"),  3200),
      setTimeout(() => onDone(),        4000),
    ];
    return () => ids.forEach(clearTimeout);
  }, [onDone]);
  const dismiss = () => { setVis("out"); setTimeout(onDone, 700); };
  return (
    <div className="fixed inset-0 z-[9999] flex items-end justify-start pb-20 pl-6 md:pl-14 pointer-events-none" aria-live="polite">
      <div className={cn("pointer-events-auto max-w-xs cursor-pointer select-none",
          vis==="in"&&"manor-welcome-in", vis==="hold"&&"manor-welcome-hold", vis==="out"&&"manor-welcome-out")}
        onClick={dismiss}>
        <div className="flex items-end gap-3 p-4 rounded-2xl"
          style={{ background:"linear-gradient(135deg,rgba(26,51,40,0.96) 0%,rgba(13,30,20,0.96) 100%)",
            border:"1px solid rgba(201,168,76,0.35)",boxShadow:"0 8px 40px rgba(0,0,0,0.7)",backdropFilter:"blur(12px)" }}>
          <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl border-2 border-[#c9a84c]/40"
            style={{ background:"rgba(201,168,76,0.12)" }}>👩‍💼</div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[#c9a84c] text-xs font-semibold">Simran</span>
              <span className="text-[#f5f0e8]/30 text-[9px] font-mono">Host · The Mehmaan Manor</span>
            </div>
            <p className="text-[#f5f0e8]/90 text-sm leading-snug">Namaste! 🙏 Welcome to The Mehmaan Manor.</p>
            <p className="text-[#f5f0e8]/55 text-xs mt-1 leading-snug">
              <strong className="text-[#c9a84c]">Drag left or right</strong> to look around the room.
              Tap any wall to explore &amp; book.
            </p>
            <p className="text-[#c9a84c]/50 text-[9px] font-mono mt-2">Tap to dismiss</p>
          </div>
        </div>
        <div className="ml-7 w-3 h-3 -mt-px"
          style={{ background:"rgba(26,51,40,0.96)",clipPath:"polygon(0 0,100% 0,50% 100%)",
            borderLeft:"1px solid rgba(201,168,76,0.35)",borderRight:"1px solid rgba(201,168,76,0.35)" }} />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   INTERIOR — 360° PANORAMIC ROOM
   
   CSS 3D cube with 4 faces. User drags to rotate yaw.
   Each face is one full-screen panel positioned at 90° intervals.
   
     0°   → ENTRY face   (welcome + drag hint)
     90°  right → Sector 57  (drag left to see)
     180° back  → Reception  (drag left twice)
     270° left  → Sector 39  (drag right to see)
══════════════════════════════════════════════════════════ */
function InteriorScreen({ properties, onClose }: { properties: ManorProperty[]; onClose: () => void }) {
  const [entered,      setEntered]      = useState(false);
  const [welcomed,     setWelcomed]     = useState(false);
  const [yaw,          setYaw]          = useState(0);
  const [selectedProp, setSelectedProp] = useState<ManorProperty|null>(null);
  const dragRef = useRef<{ startX: number; startYaw: number }|null>(null);
  const isDragging = useRef(false);

  useEffect(() => { const t = setTimeout(() => setEntered(true), 120); return () => clearTimeout(t); }, []);

  const prop1 = properties.find(p=>p.id==="1") ?? properties[0];
  const prop2 = properties.find(p=>p.id==="2") ?? properties[properties.length-1];

  // Facing label for compass
  const norm = ((yaw % 360) + 360) % 360;
  const facingLabel =
    norm < 45 || norm >= 315 ? "Entry Hall"
    : norm < 135             ? "Sector 57 →"
    : norm < 225             ? "Reception Desk"
    :                          "← Sector 39";

  const onPointerDown = useCallback((clientX: number) => {
    dragRef.current = { startX: clientX, startYaw: yaw };
    isDragging.current = false;
  }, [yaw]);

  const onPointerMove = useCallback((clientX: number) => {
    if (!dragRef.current) return;
    const dx = clientX - dragRef.current.startX;
    if (Math.abs(dx) > 5) isDragging.current = true;
    setYaw(dragRef.current.startYaw - dx * 0.28);
  }, []);

  const onPointerUp = useCallback(() => {
    dragRef.current = null;
  }, []);

  useEffect(() => {
    const mm = (e: MouseEvent)  => onPointerMove(e.clientX);
    const mu = ()               => onPointerUp();
    const tm = (e: TouchEvent)  => { if (e.touches[0]) onPointerMove(e.touches[0].clientX); };
    const tu = ()               => onPointerUp();
    window.addEventListener("mousemove",  mm, { passive: true });
    window.addEventListener("mouseup",    mu);
    window.addEventListener("touchmove",  tm, { passive: true });
    window.addEventListener("touchend",   tu);
    return () => {
      window.removeEventListener("mousemove",  mm);
      window.removeEventListener("mouseup",    mu);
      window.removeEventListener("touchmove",  tm);
      window.removeEventListener("touchend",   tu);
    };
  }, [onPointerMove, onPointerUp]);

  return (
    <>
      <div
        className="fixed inset-0 z-[9992] overflow-hidden select-none"
        style={{ opacity: entered?1:0, transition:"opacity 0.9s ease",
          cursor: dragRef.current ? "grabbing" : "grab", background:"#0a0602" }}
        role="dialog" aria-modal="true"
        aria-label="360° Mehmaan Manor — drag to look around"
        onMouseDown={e => onPointerDown(e.clientX)}
        onTouchStart={e => { if(e.touches[0]) onPointerDown(e.touches[0].clientX); }}
      >
        {/* ── Perspective stage ── */}
        <div className="absolute inset-0 flex items-center justify-center"
          style={{ perspective:"140vw", perspectiveOrigin:"50% 45%" }}>

          {/* ── Rotating scene ── */}
          <div className="relative"
            style={{ width:"100vw", height:"100vh",
              transformStyle:"preserve-3d",
              transform:`rotateY(${yaw}deg)`,
              willChange:"transform",
              transition: dragRef.current ? "none" : "transform 0.08s linear" }}>

            {/* FLOOR */}
            <div className="absolute left-0 right-0"
              style={{ bottom:0,height:"100vh",transformOrigin:"bottom center",transform:"rotateX(90deg)",
                background:"repeating-linear-gradient(90deg,#2a1a08 0,#2a1a08 80px,#341e0a 80px,#341e0a 160px)" }} />
            <div className="absolute left-0 right-0 bottom-0 pointer-events-none"
              style={{ height:"100vh",transformOrigin:"bottom center",transform:"rotateX(90deg)",
                background:"linear-gradient(180deg,rgba(201,168,76,0.10) 0%,transparent 50%)" }} />

            {/* CEILING */}
            <div className="absolute left-0 right-0"
              style={{ top:0,height:"100vh",transformOrigin:"top center",transform:"rotateX(-90deg)",
                background:"radial-gradient(ellipse 60% 60% at 50% 20%,#1a1008 0%,#080402 100%)" }} />
            <div className="absolute left-1/4 right-1/4 top-0 pointer-events-none"
              style={{ height:"100vh",transformOrigin:"top center",transform:"rotateX(-90deg)",
                background:"radial-gradient(ellipse at 50% 0%,rgba(255,240,140,0.20) 0%,transparent 60%)" }} />

            {/* ── FACE 0° — ENTRY ── */}
            <RoomFace angle={0}>
              <EntryFace />
            </RoomFace>

            {/* ── FACE -90° — Sector 57 (appear on right when dragging left) ── */}
            <RoomFace angle={-90}>
              <PropertyFace
                property={prop1} label="Sector 57"
                photos={[
                  "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1400&q=85&auto=format&fit=crop",
                  "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1400&q=85&auto=format&fit=crop",
                  "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=1400&q=85&auto=format&fit=crop",
                ]}
                onBook={() => setSelectedProp(prop1)}
                isDragging={isDragging}
              />
            </RoomFace>

            {/* ── FACE 180° — RECEPTION ── */}
            <RoomFace angle={180}>
              <ReceptionFace prop1={prop1} prop2={prop2} isDragging={isDragging} />
            </RoomFace>

            {/* ── FACE 90° — Sector 39 (appear on left when dragging right) ── */}
            <RoomFace angle={90}>
              <PropertyFace
                property={prop2} label="Sector 39"
                photos={[
                  "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1400&q=85&auto=format&fit=crop",
                  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1400&q=85&auto=format&fit=crop",
                  "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1400&q=85&auto=format&fit=crop",
                ]}
                onBook={() => setSelectedProp(prop2)}
                isDragging={isDragging}
              />
            </RoomFace>
          </div>
        </div>

        {/* Vignettes */}
        <div className="absolute bottom-0 left-0 right-0 h-1/4 pointer-events-none z-10"
          style={{ background:"linear-gradient(0deg,rgba(0,0,0,0.72) 0%,transparent 100%)" }} />
        <div className="absolute top-0 left-0 right-0 h-1/5 pointer-events-none z-10"
          style={{ background:"linear-gradient(180deg,rgba(0,0,0,0.55) 0%,transparent 100%)" }} />

        {/* HUD top */}
        <div className="absolute top-0 left-0 right-0 z-20 pointer-events-none flex items-center justify-center pt-5">
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-[#c9a84c]/30" />
              <span className="text-[#c9a84c]/60 text-[9px] font-mono tracking-[0.3em] uppercase">The Mehmaan Manor</span>
              <div className="h-px w-8 bg-[#c9a84c]/30" />
            </div>
            <span className="text-[#f5f0e8]/45 text-[10px] font-mono">{facingLabel}</span>
          </div>
        </div>

        {/* Drag hint */}
        {entered && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none manor-pop-in">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full"
              style={{ background:"rgba(0,0,0,0.45)",backdropFilter:"blur(8px)",border:"1px solid rgba(201,168,76,0.15)" }}>
              <span className="text-[#c9a84c]/60 text-base">←</span>
              <span className="text-[#f5f0e8]/50 text-[10px] font-mono tracking-wider">Drag to look around · 360°</span>
              <span className="text-[#c9a84c]/60 text-base">→</span>
            </div>
          </div>
        )}

        {/* Arrow buttons */}
        <button className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
          style={{ background:"rgba(0,0,0,0.40)",backdropFilter:"blur(8px)",border:"1px solid rgba(255,255,255,0.10)" }}
          onClick={() => setYaw(y => y + 90)} aria-label="Look left">
          <span className="text-white/70 text-xl leading-none">‹</span>
        </button>
        <button className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
          style={{ background:"rgba(0,0,0,0.40)",backdropFilter:"blur(8px)",border:"1px solid rgba(255,255,255,0.10)" }}
          onClick={() => setYaw(y => y - 90)} aria-label="Look right">
          <span className="text-white/70 text-xl leading-none">›</span>
        </button>

        <ExitBtn onClick={onClose} />
      </div>

      {/* Host welcome */}
      {entered && !welcomed && <HostWelcome onDone={() => setWelcomed(true)} />}

      {/* Property modal */}
      {selectedProp && <PropertyModal prop={selectedProp} onClose={() => setSelectedProp(null)} />}
    </>
  );
}

/* ── Room face wrapper ──────────────────────────────────── */
function RoomFace({ angle, children }: { angle: number; children: React.ReactNode }) {
  return (
    <div className="absolute inset-0"
      style={{ transformStyle:"preserve-3d", transform:`rotateY(${angle}deg) translateZ(65vw)`, backfaceVisibility:"hidden" }}>
      {children}
    </div>
  );
}

/* ── Entry face ─────────────────────────────────────────── */
function EntryFace() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center"
      style={{ background:"linear-gradient(180deg,#0e0a04 0%,#1e1408 50%,#0e0a04 100%)" }}>
      <div className="relative flex flex-col items-center gap-5 px-10 py-10 max-w-sm"
        style={{ border:"1.5px solid rgba(201,168,76,0.22)",borderRadius:16,background:"rgba(201,168,76,0.04)" }}>
        <div className="absolute -top-px left-1/2 -translate-x-1/2 w-24 h-10"
          style={{ borderRadius:"50% 50% 0 0 / 100% 100% 0 0",border:"1.5px solid rgba(201,168,76,0.22)",borderBottom:"none",background:"rgba(201,168,76,0.04)" }} />
        <div className="flex items-center gap-3">
          <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#c9a84c]/50" />
          <span className="text-[#c9a84c] text-sm select-none">◆</span>
          <div className="h-px w-10 bg-gradient-to-l from-transparent to-[#c9a84c]/50" />
        </div>
        <p className="font-display text-white/85 text-2xl md:text-3xl text-center" style={{ letterSpacing:"0.04em" }}>
          The Mehmaan Manor
        </p>
        <p className="text-[#c9a84c]/60 font-mono text-xs tracking-[0.25em] uppercase text-center">
          Gurugram · Haryana · India
        </p>
        <p className="text-[#f5f0e8]/40 text-xs leading-relaxed text-center mt-1">
          You are in the entry hall.
        </p>
        <div className="grid grid-cols-3 gap-2 text-center mt-2 w-full">
          {[{ dir:"← Drag right", label:"Sector 39" },{ dir:"You're here", label:"Entry Hall" },{ dir:"Drag left →", label:"Sector 57" }].map((d,i)=>(
            <div key={i}>
              <p className="text-[#c9a84c]/50 text-[9px] font-mono">{d.dir}</p>
              <p className="text-[#f5f0e8]/30 text-[8px] mt-0.5">{d.label}</p>
            </div>
          ))}
        </div>
        <p className="text-[#f5f0e8]/25 text-[9px] font-mono mt-1">Drag left twice → Reception &amp; Booking</p>
      </div>
    </div>
  );
}

/* ── Property wall face ─────────────────────────────────── */
function PropertyFace({
  property, label, photos, onBook, isDragging,
}: {
  property: ManorProperty; label: string; photos: string[];
  onBook: () => void; isDragging: React.MutableRefObject<boolean>;
}) {
  const [photoIdx, setPhotoIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setPhotoIdx(i=>(i+1)%photos.length), 4000);
    return () => clearInterval(id);
  }, [photos.length]);

  return (
    <div className="w-full h-full relative overflow-hidden" style={{ background:"#0e0a04" }}>
      {/* Background photo — large, atmospheric */}
      {photos.map((src,i)=>(
        <img key={src} src={src} alt={`${property.name} ${i+1}`} loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity:i===photoIdx?0.40:0,transition:"opacity 1.2s ease" }} />
      ))}
      <div className="absolute inset-0"
        style={{ background:"linear-gradient(180deg,rgba(0,0,0,0.45) 0%,rgba(0,0,0,0.20) 40%,rgba(0,0,0,0.72) 100%)" }} />

      {/* Wall label top */}
      <div className="absolute top-8 left-0 right-0 flex items-center justify-center gap-3 pointer-events-none">
        <div className="h-px w-12 bg-[#c9a84c]/35" />
        <span className="text-[#c9a84c] text-[10px] font-mono tracking-[0.28em] uppercase">{label}</span>
        <div className="h-px w-12 bg-[#c9a84c]/35" />
      </div>

      {/* 3 framed photos in a row */}
      <div className="absolute left-0 right-0 top-[16%] flex items-center justify-center gap-3 md:gap-5 px-6 md:px-16">
        {photos.map((src,i)=>(
          <div key={src} className="flex-1 rounded-xl overflow-hidden"
            style={{ aspectRatio:"4/3",
              border:`2px solid ${i===photoIdx?"rgba(201,168,76,0.70)":"rgba(201,168,76,0.22)"}`,
              boxShadow:i===photoIdx?"0 0 28px rgba(201,168,76,0.35)":"0 4px 16px rgba(0,0,0,0.6)",
              transition:"all 0.6s ease" }}>
            <img src={src} alt={`${property.name} view ${i+1}`} loading="lazy"
              className="w-full h-full object-cover"
              style={{ opacity:i===photoIdx?1:0.50,transition:"opacity 0.6s ease" }} />
          </div>
        ))}
      </div>

      {/* Property card at bottom */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-10 px-4 md:px-8">
        <div className="w-full max-w-sm rounded-2xl overflow-hidden"
          style={{ background:"linear-gradient(135deg,rgba(18,12,4,0.96) 0%,rgba(28,18,8,0.96) 100%)",
            border:"1.5px solid rgba(201,168,76,0.38)",
            boxShadow:"0 8px 40px rgba(0,0,0,0.70)",backdropFilter:"blur(12px)" }}>
          <div className="h-0.5 bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent" />
          <div className="p-4 md:p-5">
            <p className="text-[#c9a84c] text-[9px] font-mono tracking-[0.28em] uppercase">{label}</p>
            <h3 className="font-display text-[#f5f0e8]/95 text-xl mt-1 leading-tight">
              {property.name.replace("The Mehmaan Manor — ","")}
            </h3>
            <p className="text-[#f5f0e8]/40 text-xs mt-0.5 line-clamp-1">{property.address}</p>
            <div className="flex items-baseline gap-1.5 mt-3 pb-3 border-b border-[#c9a84c]/12">
              <span className="font-display text-3xl text-[#c9a84c] font-semibold">
                ₹{property.baseRate.toLocaleString("en-IN")}
              </span>
              <span className="text-[#f5f0e8]/30 text-xs">/night</span>
              <span className="ml-auto text-[9px] font-mono text-[#c9a84c]/60 bg-[#c9a84c]/8 px-2 py-0.5 rounded-full">No fees</span>
            </div>
            <div className="flex gap-2.5 mt-3">
              <button
                onClick={e => { e.stopPropagation(); if(!isDragging.current) onBook(); }}
                className="flex-1 py-3 rounded-xl font-bold text-sm text-center transition-all active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
                style={{ background:"linear-gradient(135deg,#c9a84c 0%,#e8d070 100%)",color:"#1a0800",boxShadow:"0 4px 16px rgba(201,168,76,0.40)" }}>
                View &amp; Book
              </button>
              <a href={`https://wa.me/918828352311?text=${encodeURIComponent(`Hi! I'm interested in ${property.name}. Can you share availability?`)}`}
                target="_blank" rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="flex-1 py-3 rounded-xl font-semibold text-sm text-center border-2 border-[#4caf6e]/55 text-[#4caf6e] hover:bg-[#4caf6e] hover:text-white transition-all active:scale-[0.97]">
                💬 WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Photo dot nav */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 pointer-events-none">
        {photos.map((_,i)=>(
          <div key={i} className={cn("rounded-full transition-all",i===photoIdx?"w-4 h-1.5 bg-[#c9a84c]":"w-1.5 h-1.5 bg-[#c9a84c]/30")} />
        ))}
      </div>
    </div>
  );
}

/* ── Reception face ─────────────────────────────────────── */
function ReceptionFace({
  prop1, prop2, isDragging,
}: {
  prop1: ManorProperty; prop2: ManorProperty; isDragging: React.MutableRefObject<boolean>;
}) {
  const thumbs = [
    { src:"https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=70&auto=format&fit=crop",label:"Sector 57 · Bedroom" },
    { src:"https://images.unsplash.com/photo-1554995207-c18c203602cb?w=400&q=70&auto=format&fit=crop", label:"Sector 57 · Living" },
    { src:"https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&q=70&auto=format&fit=crop",label:"Sector 39 · Studio" },
    { src:"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=70&auto=format&fit=crop", label:"Sector 39 · Kitchen" },
  ];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-4 md:px-8"
      style={{ background:"linear-gradient(180deg,#100c05 0%,#1e1408 50%,#100c05 100%)" }}>

      {/* Section label */}
      <div className="flex items-center gap-3 mb-4">
        <div className="h-px w-10 bg-[#c9a84c]/30" />
        <span className="text-[#c9a84c] text-[9px] font-mono tracking-[0.28em] uppercase">Reception · Book Direct</span>
        <div className="h-px w-10 bg-[#c9a84c]/30" />
      </div>

      {/* Grid: 2 thumbs | BOOK | 2 thumbs */}
      <div className="w-full max-w-2xl grid gap-3"
        style={{ gridTemplateColumns:"1fr 1.9fr 1fr",gridTemplateRows:"1fr 1fr",height:"clamp(280px,56vh,490px)" }}>

        {/* TL */}
        <ReceptionThumb {...thumbs[0]} />

        {/* CENTER booking panel — spans 2 rows */}
        <div className="row-span-2 flex flex-col rounded-2xl overflow-hidden"
          style={{ border:"2px solid rgba(201,168,76,0.55)",
            background:"linear-gradient(180deg,#1a1208 0%,#2a1a0a 100%)",
            boxShadow:"0 0 50px rgba(201,168,76,0.28),inset 0 1px 0 rgba(201,168,76,0.15)" }}>
          <div className="h-0.5 bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent" />

          {/* Header */}
          <div className="px-4 py-3 border-b border-[#c9a84c]/15 text-center">
            <p className="text-[#c9a84c] text-[8px] font-mono tracking-[0.25em] uppercase">Reception</p>
            <p className="font-display text-[#f5f0e8]/90 text-base mt-0.5">The Mehmaan Manor</p>
          </div>

          {/* Hosts */}
          <div className="flex items-center justify-center gap-3 py-2.5 border-b border-[#c9a84c]/10">
            <span className="text-lg select-none">👩‍💼</span>
            <div className="text-center">
              <p className="text-[#f5f0e8]/75 text-xs font-semibold">Simran &amp; Jyoti</p>
              <div className="flex items-center justify-center gap-1 mt-0.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4caf6e] opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#4caf6e]" />
                </span>
                <span className="text-[#4caf6e]/60 text-[9px] font-mono">Online now</span>
              </div>
            </div>
            <span className="text-lg select-none">👩‍🍳</span>
          </div>

          {/* CTAs */}
          <div className="flex-1 flex flex-col gap-2.5 p-4 justify-center">
            <Link href="/book"
              onClick={e => { if(isDragging.current) e.preventDefault(); }}
              className="flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
              style={{ background:"linear-gradient(135deg,#c9a84c 0%,#e8d070 50%,#c9a84c 100%)",
                color:"#1a0800",boxShadow:"0 4px 20px rgba(201,168,76,0.45)" }}>
              📅 Book Now · No Fees
            </Link>
            <a href="https://wa.me/918828352311?text=Hi!%20I%27d%20like%20to%20book%20at%20The%20Mehmaan%20Manor."
              target="_blank" rel="noopener noreferrer"
              onClick={e => { if(isDragging.current) e.preventDefault(); }}
              className="flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm border-2 border-[#4caf6e]/50 text-[#4caf6e] hover:bg-[#4caf6e] hover:text-white transition-all active:scale-[0.97]">
              💬 WhatsApp Simran
            </a>
            <Link href="/homes"
              onClick={e => { if(isDragging.current) e.preventDefault(); }}
              className="flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-mono text-[#f5f0e8]/40 hover:text-[#c9a84c] border border-[#f5f0e8]/8 hover:border-[#c9a84c]/30 transition-all">
              🏠 Browse All Homes
            </Link>
          </div>

          {/* Trust strip */}
          <div className="px-4 pb-3 border-t border-[#c9a84c]/10 pt-2.5">
            <div className="flex items-center justify-center gap-4">
              {["No fees","Free cancel","Direct"].map(b=>(
                <span key={b} className="flex items-center gap-1 text-[#f5f0e8]/30 text-[8px]">
                  <span className="text-[#c9a84c]/50 font-bold">✓</span>{b}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* TR */}
        <ReceptionThumb {...thumbs[1]} />
        {/* BL */}
        <ReceptionThumb {...thumbs[2]} />
        {/* BR */}
        <ReceptionThumb {...thumbs[3]} />
      </div>
    </div>
  );
}

/* ── Reception thumbnail ─────────────────────────────────── */
function ReceptionThumb({ src, label }: { src: string; label: string }) {
  return (
    <div className="relative rounded-xl overflow-hidden"
      style={{ border:"1.5px solid rgba(201,168,76,0.25)" }}>
      <img src={src} alt={label} loading="lazy" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
      {[["top-1 left-1","t","l"],["top-1 right-1","t","r"],["bottom-1 left-1","b","l"],["bottom-1 right-1","b","r"]].map(([pos,v,h])=>(
        <div key={pos} className={`absolute ${pos} w-3 h-3 pointer-events-none`}
          style={{
            borderTop:    v==="t" ? "1.5px solid rgba(201,168,76,0.65)" : undefined,
            borderBottom: v==="b" ? "1.5px solid rgba(201,168,76,0.65)" : undefined,
            borderLeft:   h==="l" ? "1.5px solid rgba(201,168,76,0.65)" : undefined,
            borderRight:  h==="r" ? "1.5px solid rgba(201,168,76,0.65)" : undefined,
          }} />
      ))}
      <span className="absolute bottom-1.5 left-0 right-0 text-center text-white/65 text-[8px] font-mono">{label}</span>
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
      {/* ── Trigger button — fixed bottom-left over the hero ── */}
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

      {phase === "blackout"  && <BlackoutScreen   onDone={() => go("intro")} />}
      {phase === "intro"     && <IntroScreen       onDone={() => go("exterior")} />}
      {phase === "exterior"  && <ExteriorScreen    onEnter={() => go("entering")} onClose={exit} />}
      {phase === "entering"  && <EnterTransition   onDone={() => go("interior")} />}
      {phase === "interior"  && <InteriorScreen    properties={properties} onClose={exit} />}
    </>
  );
}
