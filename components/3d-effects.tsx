"use client";

import { useRef, useEffect, ReactNode, CSSProperties } from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";

/* ─── Tilt Card ─────────────────────────────────────────────────────────────
   Wraps any card — on mouse move the card tilts toward the cursor in 3D.
   Usage: <TiltCard><YourCard /></TiltCard>
*/
interface TiltCardProps {
  children: ReactNode;
  className?: string;
  intensity?: number; // degrees of tilt, default 12
  style?: CSSProperties;
}

export function TiltCard({ children, className = "", intensity = 12, style }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;   // -0.5 to 0.5
    const y = (e.clientY - top) / height - 0.5;
    el.style.transform = `perspective(800px) rotateY(${x * intensity}deg) rotateX(${-y * intensity}deg) scale3d(1.02,1.02,1.02)`;
    el.style.transition = "transform 0.1s ease-out";
  }

  function onMouseLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)";
    el.style.transition = "transform 0.5s ease-out";
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{ willChange: "transform", ...style }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  );
}

/* ─── Parallax Layer ────────────────────────────────────────────────────────
   Moves at a different scroll speed to create depth layering.
   speed: 0 = fixed, 0.5 = half speed, 1 = normal, 1.5 = faster than scroll
*/
interface ParallaxLayerProps {
  children: ReactNode;
  speed?: number;
  className?: string;
}

export function ParallaxLayer({ children, speed = 0.4, className = "" }: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`${-50 * speed}px`, `${50 * speed}px`]);
  const smoothY = useSpring(y, { stiffness: 80, damping: 20 });

  return (
    <motion.div ref={ref} style={{ y: smoothY }} className={className}>
      {children}
    </motion.div>
  );
}

/* ─── Float ─────────────────────────────────────────────────────────────────
   Gentle continuous floating animation — for logos, icons, decorative items.
*/
interface FloatProps {
  children: ReactNode;
  className?: string;
  amplitude?: number; // px, default 8
  duration?: number;  // seconds, default 4
}

export function Float({ children, className = "", amplitude = 8, duration = 4 }: FloatProps) {
  return (
    <motion.div
      className={className}
      animate={{ y: [0, -amplitude, 0] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Reveal3D ───────────────────────────────────────────────────────────────
   Scroll-triggered reveal with a subtle 3D perspective lift.
   Replaces the plain CSS .reveal class for key elements.
*/
interface Reveal3DProps {
  children: ReactNode;
  className?: string;
  delay?: number; // seconds
  direction?: "up" | "left" | "right";
}

export function Reveal3D({ children, className = "", delay = 0, direction = "up" }: Reveal3DProps) {
  const initial = {
    opacity: 0,
    y: direction === "up" ? 40 : 0,
    x: direction === "left" ? -40 : direction === "right" ? 40 : 0,
    rotateX: direction === "up" ? 12 : 0,
    rotateY: direction === "left" ? -8 : direction === "right" ? 8 : 0,
  };

  return (
    <motion.div
      className={className}
      initial={initial}
      whileInView={{ opacity: 1, y: 0, x: 0, rotateX: 0, rotateY: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformPerspective: 1000 }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Depth Text ─────────────────────────────────────────────────────────────
   Hero headline with layered shadow to create a 3D depth effect.
*/
interface DepthTextProps {
  children: ReactNode;
  className?: string;
  color?: string;       // shadow color, default gold
  as?: "h1" | "h2" | "h3" | "p" | "span";
  style?: CSSProperties;
}

export function DepthText({ children, className = "", color = "oklch(0.75 0.12 85)", as: Tag = "h1", style }: DepthTextProps) {
  return (
    <Tag
      className={className}
      style={{
        textShadow: `1px 1px 0 ${color}33, 2px 2px 0 ${color}22, 3px 3px 0 ${color}11, 4px 4px 12px ${color}18`,
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}

/* ─── Mouse Parallax ─────────────────────────────────────────────────────────
   The wrapped element drifts slightly as the user moves the mouse across
   the viewport — adds a subtle depth to hero sections.
   intensity: max px shift, default 15
*/
interface MouseParallaxProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
}

export function MouseParallax({ children, className = "", intensity = 15 }: MouseParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onMove(e: MouseEvent) {
      const el = ref.current;
      if (!el) return;
      const x = (e.clientX / window.innerWidth - 0.5) * intensity;
      const y = (e.clientY / window.innerHeight - 0.5) * intensity;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      el.style.transition = "transform 0.15s ease-out";
    }
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [intensity]);

  return (
    <div ref={ref} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}

/* ─── Scroll Progress Bar ────────────────────────────────────────────────────
   Thin gold line at the top of the page indicating scroll progress.
*/
export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] bg-gold z-[9999] origin-left"
      style={{ scaleX }}
    />
  );
}
