"use client";

import { cn } from "@/lib/utils";

interface PlaceholderImageProps {
  caption: string;
  className?: string;
  aspectRatio?: "video" | "square" | "portrait" | "landscape" | "fill";
  variant?: "dark" | "light" | "forest";
}

export function PlaceholderImage({
  caption,
  className,
  aspectRatio = "video",
  variant = "forest",
}: PlaceholderImageProps) {
  const aspectClasses = {
    video: "aspect-video",
    square: "aspect-square",
    portrait: "aspect-[3/4]",
    landscape: "aspect-[4/3]",
    fill: "h-full w-full",
  };

  const id = caption.replace(/\s+/g, "-").toLowerCase().slice(0, 20);

  const gradients: Record<string, [string, string, string]> = {
    forest: ["oklch(0.22 0.04 155)", "oklch(0.28 0.05 155)", "oklch(0.32 0.05 155)"],
    dark:   ["oklch(0.14 0.03 155)", "oklch(0.20 0.04 155)", "oklch(0.25 0.04 160)"],
    light:  ["oklch(0.90 0.02 85)",  "oklch(0.93 0.02 85)",  "oklch(0.95 0.01 90)"],
  };
  const [c1, c2, c3] = gradients[variant];

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden",
        aspectRatio !== "fill" && aspectClasses[aspectRatio],
        aspectRatio === "fill" && "absolute inset-0",
        className
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 800 600"
      >
        <defs>
          {/* Background gradient */}
          <linearGradient id={`bg-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={c1} />
            <stop offset="50%" stopColor={c2} />
            <stop offset="100%" stopColor={c3} />
          </linearGradient>

          {/* Noise texture filter */}
          <filter id={`noise-${id}`} x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" result="noiseOut"/>
            <feColorMatrix type="saturate" values="0" in="noiseOut" result="grayNoise"/>
            <feBlend in="SourceGraphic" in2="grayNoise" mode="overlay" result="blended"/>
            <feComposite in="blended" in2="SourceGraphic" operator="in"/>
          </filter>

          {/* Radial vignette */}
          <radialGradient id={`vig-${id}`} cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="100%" stopColor="oklch(0.10 0.02 155)" stopOpacity="0.7" />
          </radialGradient>

          {/* Window light */}
          <radialGradient id={`light-${id}`} cx="65%" cy="35%" r="40%">
            <stop offset="0%" stopColor="oklch(0.75 0.12 85)" stopOpacity="0.12" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {/* Base background */}
        <rect width="800" height="600" fill={`url(#bg-${id})`} />

        {/* Architectural room elements */}
        {/* Floor */}
        <rect x="0" y="420" width="800" height="180" fill="oklch(0.18 0.03 155)" opacity="0.8"/>
        {/* Floor highlight (wood grain suggestion) */}
        <rect x="0" y="420" width="800" height="3" fill="oklch(0.75 0.12 85)" opacity="0.15"/>
        {/* Back wall top */}
        <rect x="0" y="0" width="800" height="420" fill="oklch(0.28 0.04 155)" opacity="0.3"/>

        {/* Large window frame right */}
        <rect x="540" y="30" width="220" height="350" rx="2" fill="oklch(0.18 0.03 155)" opacity="0.6"/>
        <rect x="550" y="40" width="200" height="330" rx="1" fill="oklch(0.75 0.12 85)" opacity="0.07"/>
        {/* Window cross bars */}
        <line x1="650" y1="40" x2="650" y2="370" stroke="oklch(0.18 0.03 155)" strokeWidth="6"/>
        <line x1="550" y1="200" x2="750" y2="200" stroke="oklch(0.18 0.03 155)" strokeWidth="6"/>
        {/* Window glow */}
        <rect x="550" y="40" width="200" height="330" fill={`url(#light-${id})`}/>

        {/* Sofa silhouette */}
        <rect x="80" y="340" width="340" height="80" rx="8" fill="oklch(0.24 0.04 155)" opacity="0.9"/>
        {/* Sofa back */}
        <rect x="80" y="300" width="340" height="50" rx="8" fill="oklch(0.26 0.04 155)" opacity="0.9"/>
        {/* Sofa arms */}
        <rect x="72" y="305" width="30" height="115" rx="6" fill="oklch(0.26 0.04 155)" opacity="0.9"/>
        <rect x="398" y="305" width="30" height="115" rx="6" fill="oklch(0.26 0.04 155)" opacity="0.9"/>
        {/* Throw pillow */}
        <rect x="190" y="308" width="60" height="44" rx="4" fill="oklch(0.75 0.12 85)" opacity="0.4"/>
        <rect x="270" y="310" width="50" height="40" rx="4" fill="oklch(0.85 0.05 85)" opacity="0.25"/>

        {/* Coffee table */}
        <rect x="130" y="410" width="200" height="12" rx="2" fill="oklch(0.22 0.03 155)" opacity="0.9"/>
        <rect x="155" y="422" width="8" height="25" fill="oklch(0.20 0.03 155)" opacity="0.9"/>
        <rect x="307" y="422" width="8" height="25" fill="oklch(0.20 0.03 155)" opacity="0.9"/>
        {/* Coffee cup on table */}
        <ellipse cx="240" cy="408" rx="10" ry="5" fill="oklch(0.75 0.12 85)" opacity="0.5"/>
        <rect x="232" y="392" width="16" height="16" rx="2" fill="oklch(0.20 0.03 155)" opacity="0.9"/>

        {/* Floor lamp */}
        <line x1="490" y1="420" x2="490" y2="240" stroke="oklch(0.75 0.12 85)" strokeWidth="3" opacity="0.6"/>
        <ellipse cx="490" cy="238" rx="35" ry="18" fill="oklch(0.22 0.04 155)" opacity="0.9"/>
        {/* Lamp shade inner glow */}
        <ellipse cx="490" cy="240" rx="30" ry="14" fill="oklch(0.75 0.12 85)" opacity="0.12"/>

        {/* Plant in corner */}
        <rect x="30" y="355" width="24" height="65" rx="4" fill="oklch(0.20 0.03 155)" opacity="0.9"/>
        <ellipse cx="42" cy="340" rx="34" ry="28" fill="oklch(0.32 0.07 145)" opacity="0.8"/>
        <ellipse cx="28" cy="330" rx="22" ry="18" fill="oklch(0.34 0.07 145)" opacity="0.7"/>
        <ellipse cx="56" cy="328" rx="20" ry="20" fill="oklch(0.30 0.07 145)" opacity="0.7"/>

        {/* Wall art / frame */}
        <rect x="300" y="80" width="160" height="120" rx="2" fill="oklch(0.20 0.03 155)" opacity="0.7"/>
        <rect x="308" y="88" width="144" height="104" fill="oklch(0.75 0.12 85)" opacity="0.08"/>

        {/* Noise texture overlay */}
        <rect width="800" height="600" fill={`url(#bg-${id})`} filter={`url(#noise-${id})`} opacity="0.12"/>

        {/* Vignette */}
        <rect width="800" height="600" fill={`url(#vig-${id})`}/>

        {/* Gold line accent — bottom */}
        <line x1="0" y1="418" x2="800" y2="418" stroke="oklch(0.75 0.12 85)" strokeWidth="1" opacity="0.3"/>
      </svg>

      {/* Caption overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p
          className={cn(
            "font-mono text-[10px] md:text-xs text-center uppercase tracking-[0.2em] max-w-[200px] leading-relaxed",
            variant === "light" ? "text-forest/40" : "text-cream/30"
          )}
        >
          {caption}
        </p>
      </div>

      {/* Corner accents */}
      <div className="absolute top-3 left-3 w-6 h-6 border-t border-l border-gold/30" />
      <div className="absolute bottom-3 right-3 w-6 h-6 border-b border-r border-gold/30" />
    </div>
  );
}
