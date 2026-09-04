"use client";

/**
 * MOVA-style animation primitives — production-safe
 *
 * ImgReveal  — fade + scale entrance for images (NO clip-path, always visible)
 * SplitText  — word-by-word slide-up reveal
 * SplitChars — per-character staggered entrance
 * ParallaxImg— scroll-driven vertical parallax
 * LineReveal — fade + rise on scroll
 * GridReveal — staggered grid children reveal
 * LineDraw   — gold line draws itself in
 */

import { useEffect, useRef, type ReactNode, type CSSProperties } from "react";

/* ─── Bulletproof intersection observer ──────────────────────── */
function observe(
  el: Element,
  onEnter: () => void,
  options?: IntersectionObserverInit
): () => void {
  let fired = false;

  const fire = () => {
    if (fired) return;
    fired = true;
    onEnter();
  };

  // Guaranteed fallback — always show content after 1.2s even if IO never fires
  const fallback = setTimeout(fire, 1200);

  // If already in viewport, fire immediately next frame
  const rect = el.getBoundingClientRect();
  if (rect.top < window.innerHeight + 200 && rect.bottom > -200) {
    requestAnimationFrame(fire);
    return () => clearTimeout(fallback);
  }

  const io = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        fire();
        io.unobserve(el);
      }
    },
    {
      threshold: 0,
      rootMargin: "0px 0px 200px 0px",
      ...options,
    }
  );
  io.observe(el);

  return () => {
    clearTimeout(fallback);
    io.disconnect();
  };
}

/* ════════════════════════════════════════════════════════════════
   ImgReveal
   Safe image reveal: starts visible but slightly scaled/faded.
   Never hides images via clip-path. Graceful fallback always works.
   ════════════════════════════════════════════════════════════════ */
interface ImgRevealProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  delay?: number;
}

export function ImgReveal({
  children,
  className = "",
  style,
  delay = 0,
}: ImgRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Start state: slightly scaled up, opacity low
    el.style.opacity = "0";
    el.style.transform = "scale(1.04)";
    el.style.transition = `opacity 0.9s ease ${delay}ms, transform 1.1s cubic-bezier(0.16,1,0.3,1) ${delay}ms`;

    const cleanup = observe(el, () => {
      el.style.opacity = "1";
      el.style.transform = "scale(1)";
    });

    return cleanup;
  }, [delay]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ position: "relative", overflow: "hidden", ...style }}
    >
      {children}
    </div>
  );
}

// Keep ImgWipe as alias to ImgReveal for backwards compat
export const ImgWipe = ImgReveal;

/* ════════════════════════════════════════════════════════════════
   SplitText
   Word-by-word slide up from clip mask on scroll entry.
   ════════════════════════════════════════════════════════════════ */
interface SplitTextProps {
  text: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  style?: CSSProperties;
  stagger?: number;
  delay?: number;
}

export function SplitText({
  text,
  as: Tag = "span",
  className = "",
  style,
  stagger = 55,
  delay = 0,
}: SplitTextProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const inners = el.querySelectorAll<HTMLElement>(".split-word-inner");

    const cleanup = observe(el, () => {
      inners.forEach((inner, i) => {
        inner.style.transitionDelay = `${delay + i * stagger}ms`;
        inner.classList.add("visible");
      });
    });

    return cleanup;
  }, [delay, stagger]);

  const words = text.split(" ");

  return (
    // @ts-expect-error dynamic tag
    <Tag ref={ref} className={className} style={style} aria-label={text}>
      {words.map((word, i) => (
        <span key={i} className="split-word" aria-hidden="true">
          <span className="split-word-inner">{word}</span>
          {i < words.length - 1 && "\u00A0"}
        </span>
      ))}
    </Tag>
  );
}

/* ════════════════════════════════════════════════════════════════
   SplitChars
   Per-character skew entrance for big display headings.
   ════════════════════════════════════════════════════════════════ */
interface SplitCharsProps {
  text: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  style?: CSSProperties;
  stagger?: number;
  delay?: number;
}

export function SplitChars({
  text,
  as: Tag = "span",
  className = "",
  style,
  stagger = 40,
  delay = 0,
}: SplitCharsProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const inners = el.querySelectorAll<HTMLElement>(".split-char-inner");

    const cleanup = observe(el, () => {
      inners.forEach((inner, i) => {
        inner.style.transitionDelay = `${delay + i * stagger}ms`;
        inner.classList.add("visible");
      });
    });

    return cleanup;
  }, [delay, stagger]);

  return (
    // @ts-expect-error dynamic tag
    <Tag
      ref={ref}
      className={className}
      style={{ ...style, display: "inline-flex", flexWrap: "wrap" }}
      aria-label={text}
    >
      {text.split("").map((char, i) => (
        <span key={i} className="split-char" aria-hidden="true">
          <span className="split-char-inner">
            {char === " " ? "\u00A0" : char}
          </span>
        </span>
      ))}
    </Tag>
  );
}

/* ════════════════════════════════════════════════════════════════
   ParallaxImg
   Scroll-driven vertical parallax. Inner image is oversized so
   parallax shift doesn't reveal edges.
   ════════════════════════════════════════════════════════════════ */
interface ParallaxImgProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  speed?: number;
}

export function ParallaxImg({
  children,
  className = "",
  style,
  speed = 0.12,
}: ParallaxImgProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;

    const onScroll = () => {
      const rect = wrap.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      inner.style.transform = `translateY(${center * speed}px)`;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [speed]);

  return (
    <div
      ref={wrapRef}
      className={className}
      style={{ position: "relative", overflow: "hidden", ...style }}
    >
      <div
        ref={innerRef}
        style={{
          position: "absolute",
          inset: "-10% 0",
          willChange: "transform",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   LineReveal  — fade + translateY on scroll
   ════════════════════════════════════════════════════════════════ */
interface LineRevealProps {
  children: ReactNode;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  style?: CSSProperties;
  delay?: number;
}

export function LineReveal({
  children,
  as: Tag = "div",
  className = "",
  style,
  delay = 0,
}: LineRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const cleanup = observe(el, () => {
      el.style.transitionDelay = `${delay}ms`;
      el.classList.add("visible");
    });

    return cleanup;
  }, [delay]);

  return (
    // @ts-expect-error dynamic tag
    <Tag ref={ref} className={`line-reveal ${className}`} style={style}>
      {children}
    </Tag>
  );
}

/* ════════════════════════════════════════════════════════════════
   GridReveal  — stagger direct children on scroll
   ════════════════════════════════════════════════════════════════ */
interface GridRevealProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  stagger?: number;
  delay?: number;
}

export function GridReveal({
  children,
  className = "",
  style,
  stagger = 100,
  delay = 0,
}: GridRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const items = el.querySelectorAll<HTMLElement>(":scope > *");
    items.forEach((item) => item.classList.add("grid-reveal-child"));

    const cleanup = observe(el, () => {
      items.forEach((item, i) => {
        item.style.transitionDelay = `${delay + i * stagger}ms`;
        item.classList.add("visible");
      });
    });

    return cleanup;
  }, [delay, stagger]);

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   LineDraw  — gold line draws itself in
   ════════════════════════════════════════════════════════════════ */
interface LineDrawProps {
  className?: string;
  style?: CSSProperties;
  delay?: number;
}

export function LineDraw({ className = "", style, delay = 0 }: LineDrawProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const cleanup = observe(el, () => {
      el.style.transitionDelay = `${delay}ms`;
      el.classList.add("visible");
    });

    return cleanup;
  }, [delay]);

  return <div ref={ref} className={`line-draw ${className}`} style={style} />;
}

/* ════════════════════════════════════════════════════════════════
   SectionProgressLine  — left edge vertical gold bar
   ════════════════════════════════════════════════════════════════ */
export function SectionProgressLine() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const cleanup = observe(
      el.parentElement ?? el,
      () => el.classList.add("visible"),
      { threshold: 0 }
    );
    return cleanup;
  }, []);

  return <div ref={ref} className="section-progress-line" />;
}

/* ════════════════════════════════════════════════════════════════
   useScrollReveal  — generic hook, adds "visible" class on entry
   ════════════════════════════════════════════════════════════════ */
export function useScrollReveal<T extends HTMLElement>(delay = 0) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const cleanup = observe(el, () => {
      el.style.transitionDelay = `${delay}ms`;
      el.classList.add("visible");
    });

    return cleanup;
  }, [delay]);

  return ref;
}
