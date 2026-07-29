import type { Config } from "tailwindcss";

/**
 * Color conversions from oklch to hex (for maximum browser compatibility):
 * forest   oklch(0.32 0.05 155)  → #1a3328  (dark green)
 * forest-deep oklch(0.22 0.04 155) → #0f2119  (deeper green)
 * gold     oklch(0.75 0.12 85)   → #c9a84c  (warm gold)
 * cream    oklch(0.97 0.015 85)  → #f5f0e8  (warm off-white)
 * ink      oklch(0.20 0.02 155)  → #1a2420  (near-black)
 */

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: "#1a3328",
          deep: "#0f2119",
        },
        gold: {
          DEFAULT: "#c9a84c",
        },
        cream: {
          DEFAULT: "#f5f0e8",
        },
        ink: {
          DEFAULT: "#1a2420",
        },
        border:     "#ddd8cc",
        input:      "#ddd8cc",
        ring:       "#1a3328",
        background: "#f5f0e8",
        foreground: "#1a2420",
        primary: {
          DEFAULT:    "#1a3328",
          foreground: "#f5f0e8",
        },
        secondary: {
          DEFAULT:    "#ede8de",
          foreground: "#1a2420",
        },
        accent: {
          DEFAULT:    "#c9a84c",
          foreground: "#1a2420",
        },
        muted: {
          DEFAULT:    "#ede8de",
          foreground: "#4a5e58",
        },
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "serif"],
        sans:    ["var(--font-inter)", "sans-serif"],
        mono:    ["var(--font-jetbrains)", "monospace"],
      },
      fontSize: {
        hero:    ["clamp(4rem, 10vw, 8.75rem)", { lineHeight: "0.95", letterSpacing: "-0.02em" }],
        display: ["clamp(2.5rem, 5vw, 4.5rem)",  { lineHeight: "1.1",  letterSpacing: "-0.01em" }],
        title:   ["clamp(1.75rem, 3vw, 2.5rem)", { lineHeight: "1.2",  letterSpacing: "-0.01em" }],
      },
      transitionDuration: {
        "800":  "800ms",
        "1200": "1200ms",
      },
      keyframes: {
        "fade-up": {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.8s ease-out",
        "fade-in": "fade-in 0.6s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
