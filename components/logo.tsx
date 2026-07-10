/**
 * The Mehmaan Manor — Logo Mark
 * Pure SVG paths only — no <text> elements, no font dependency.
 * Dark green circle · Gold arch · MM monogram drawn as paths
 */

interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 44, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="The Mehmaan Manor"
    >
      {/* ── BACKGROUND ── */}
      {/* White outer ring */}
      <circle cx="60" cy="60" r="59" fill="white" />
      {/* Dark green fill */}
      <circle cx="60" cy="60" r="56" fill="#1a3328" />
      {/* Inner gold ring */}
      <circle cx="60" cy="60" r="51" fill="none" stroke="#c9a84c" strokeWidth="1" />

      {/* ── GOLD ARCH ── */}
      {/*
        The arch: two straight legs going down, connected by a
        perfect semicircle at the top. Stroke only, thick.
      */}
      <path
        d="M36 82 L36 52 Q36 22 60 22 Q84 22 84 52 L84 82"
        fill="none"
        stroke="#c9a84c"
        strokeWidth="5.5"
        strokeLinecap="butt"
      />

      {/* ── LARGE GOLD M (back, taller) ── */}
      {/*
        Classic serif M shape:
        Left vertical | left diagonal down | up to peak | right diagonal down | right vertical
        Drawn as a closed filled path
      */}
      <path
        d="
          M36 85
          L36 42
          L60 70
          L84 42
          L84 85
          L80 85
          L80 48
          L60 74
          L40 48
          L40 85
          Z
        "
        fill="#c9a84c"
      />

      {/* ── SMALL CREAM M (front, shorter, overlapping) ── */}
      {/*
        Slightly smaller, cream colored, centered slightly lower
        to create the layered monogram effect from the original logo
      */}
      <path
        d="
          M41 91
          L41 58
          L60 78
          L79 58
          L79 91
          L75.5 91
          L75.5 65
          L60 83
          L44.5 65
          L44.5 91
          Z
        "
        fill="#f0ebe0"
      />

      {/* ── GOLD DOT at arch base ── */}
      <circle cx="60" cy="86" r="2.8" fill="#c9a84c" />
    </svg>
  );
}

export function LogoWordmark({
  className = "",
  light = false,
}: {
  className?: string;
  light?: boolean;
}) {
  return (
    <span
      className={`font-display tracking-wide ${
        light ? "text-cream" : "text-forest"
      } ${className}`}
    >
      The Mehmaan Manor
    </span>
  );
}
