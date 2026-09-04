"use client";

/**
 * MOVA-style animation primitives
 *
 * SplitText      — wraps each word in a clip-mask slot, triggers on scroll
 * SplitChars     — per-character staggered entrance (for big display words)
 * ImgWipe        — bottom-up curtain lift on images
 * ParallaxImg    — scroll-driven vertical parallax on images
 * LineReveal     — single line fade + rise
 * GridReveal     — staggered grid children reveal
 * LineDraw       — gold horizontal line that draws itself in
 * useScrollReveal— generic IntersectionObserver hook for custom elements
 */

import { useEffect, useRef, type ReactNode, type CSSProperties } from "react";

/* ─── shared intersection helper ─────────────────────────────── */
function observe(
  el: Element,
  onEnter: () => void,
  options?: IntersectionObserverInit
) {
  const io = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        onEnter();
        io.unobserve(el);
      }
    },
    { threshold: 0.1, rootMargin: "0px 0px -60px 0px", ...options }
  );
  io.observe(el);
  return io;
}

/* ════════════════════════════════════════════════════════════════
   SplitText
   Splits text into words, each word masked. Words slide up one
   by one when the container enters the viewport.
   ════════════════════════════════════════════════════════════════ */
interface SplitTextProps {
  text: string;
  /** Tag to render, defaults to span */
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  style?: CSSProperties;
  /** ms between each word */
  stagger?: number;
  /** ms delay before first word */
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

    const io = observe(el, () => {
      inners.forEach((inner, i) => {
        const t = delay + i * stagger;
        inner.style.transitionDelay = `${t}ms`;
        inner.classList.add("visible");
      });
    });

    return () => io.disconnect();
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
   Per-character stagger with skew — for big single words /
   display headings (MOVA brand name treatment)
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
    const io = observe(el, () => {
      inners.forEach((inner, i) => {
        inner.style.transitionDelay = `${delay + i * stagger}ms`;
        inner.classList.add("visible");
      });
    });

    return () => io.disconnect();
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
   ImgWipe
   Wraps an image (or any child) in a bottom-up clip-path reveal.
   Pass children — typically an <img> tag.
   ════════════════════════════════════════════════════════════════ */
interface ImgWipeProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  direction?: "up" | "right";
  delay?: number;
}

export function ImgWipe({
  children,
  className = "",
  style,
  direction = "up",
  delay = 0,
}: ImgWipeProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = observe(el, () => {
      el.style.transitionDelay = `${delay}ms`;
      el.classList.add("visible");
    });

    return () => io.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`${direction === "right" ? "img-wipe-x" : "img-wipe"} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   ParallaxImg
   On scroll, shifts inner image by `speed` fraction of scroll delta.
   Wrap an <img> or div — inner element gets translateY applied.
   ════════════════════════════════════════════════════════════════ */
interface ParallaxImgProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** 0 = no effect, 0.15 = gentle, 0.3 = dramatic */
  speed?: number;
}

export function ParallaxImg({
  children,
  className = "",
  style,
  speed = 0.18,
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
    onScroll(); // init
    return () => window.removeEventListener("scroll", onScroll);
  }, [speed]);

  return (
    <div ref={wrapRef} className={`parallax-img-wrap ${className}`} style={style}>
      <div ref={innerRef} className="parallax-img-inner">
        {children}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   LineReveal
   Single block-level element that fades + rises on scroll.
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

    const io = observe(el, () => {
      el.style.transitionDelay = `${delay}ms`;
      el.classList.add("visible");
    });

    return () => io.disconnect();
  }, [delay]);

  return (
    // @ts-expect-error dynamic tag
    <Tag ref={ref} className={`line-reveal ${className}`} style={style}>
      {children}
    </Tag>
  );
}

/* ════════════════════════════════════════════════════════════════
   GridReveal
   Wraps children and stagger-reveals them as grid items.
   Each direct child gets .grid-reveal-child with increasing delay.
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

    const io = observe(
      el,
      () => {
        items.forEach((item, i) => {
          item.style.transitionDelay = `${delay + i * stagger}ms`;
          item.classList.add("visible");
        });
      },
      { threshold: 0.05 }
    );

    return () => io.disconnect();
  }, [delay, stagger]);

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   LineDraw
   A gold horizontal line that draws itself from left to right.
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

    const io = observe(el, () => {
      el.style.transitionDelay = `${delay}ms`;
      el.classList.add("visible");
    });

    return () => io.disconnect();
  }, [delay]);

  return <div ref={ref} className={`line-draw ${className}`} style={style} />;
}

/* ════════════════════════════════════════════════════════════════
   SectionProgressLine
   Thin left-edge vertical gold line that grows to full height.
   ════════════════════════════════════════════════════════════════ */
export function SectionProgressLine() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = observe(
      el.parentElement ?? el,
      () => el.classList.add("visible"),
      { threshold: 0.02 }
    );
    return () => io.disconnect();
  }, []);

  return <div ref={ref} className="section-progress-line" />;
}

/* ════════════════════════════════════════════════════════════════
   useScrollReveal
   Generic hook — returns a ref; attach to any element to get a
   one-time "visible" class added on intersection.
   ════════════════════════════════════════════════════════════════ */
export function useScrollReveal<T extends HTMLElement>(delay = 0) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = observe(el, () => {
      el.style.transitionDelay = `${delay}ms`;
      el.classList.add("visible");
    });

    return () => io.disconnect();
  }, [delay]);

  return ref;
}
