/**
 * The Mehmaan Manor — Logo
 * Uses the real brand logo image
 */
import Image from "next/image";

interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 44, className = "" }: LogoProps) {
  return (
    <Image
      src="/logo.png"
      alt="The Mehmaan Manor"
      width={size}
      height={size}
      className={`object-contain ${className}`}
      priority
    />
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
