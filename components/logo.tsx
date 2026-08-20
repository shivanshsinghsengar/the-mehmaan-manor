/**
 * The Mehmaan Manor — Logo Mark
 * Only the MM monogram with arch — no text below
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
      {/* Dark green background */}
      <rect width="120" height="120" fill="#1a3328" />

      {/* Gold arch */}
      <path
        d="M28 100 L28 58 Q28 20 60 20 Q92 20 92 58 L92 100"
        fill="none"
        stroke="#c9a84c"
        strokeWidth="5"
        strokeLinecap="butt"
      />

      {/* Large gold M (back) */}
      <path
        d="M30 98 L30 48 L60 78 L90 48 L90 98 L85 98 L85 56 L60 84 L35 56 L35 98 Z"
        fill="#c9a84c"
      />

      {/* Small cream M (front, overlapping) */}
      <path
        d="M36 104 L36 62 L60 86 L84 62 L84 104 L79.5 104 L79.5 70 L60 92 L40.5 70 L40.5 104 Z"
        fill="#f0ebe0"
      />

      {/* Gold dot at arch base right */}
      <circle cx="92" cy="80" r="3" fill="#c9a84c" />
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
