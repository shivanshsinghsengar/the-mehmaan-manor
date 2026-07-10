import type { Config } from "tailwindcss";

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
          DEFAULT: "oklch(0.32 0.05 155)",
          deep: "oklch(0.22 0.04 155)",
        },
        gold: {
          DEFAULT: "oklch(0.75 0.12 85)",
        },
        cream: {
          DEFAULT: "oklch(0.97 0.015 85)",
        },
        ink: {
          DEFAULT: "oklch(0.20 0.02 155)",
        },
        border: "oklch(0.89 0.01 155)",
        input: "oklch(0.89 0.01 155)",
        ring: "oklch(0.32 0.05 155)",
        background: "oklch(0.97 0.015 85)",
        foreground: "oklch(0.20 0.02 155)",
        primary: {
          DEFAULT: "oklch(0.32 0.05 155)",
          foreground: "oklch(0.97 0.015 85)",
        },
        secondary: {
          DEFAULT: "oklch(0.95 0.01 155)",
          foreground: "oklch(0.20 0.02 155)",
        },
        accent: {
          DEFAULT: "oklch(0.75 0.12 85)",
          foreground: "oklch(0.20 0.02 155)",
        },
        muted: {
          DEFAULT: "oklch(0.95 0.01 155)",
          foreground: "oklch(0.45 0.02 155)",
        },
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      fontSize: {
        hero: ["clamp(4rem, 10vw, 8.75rem)", { lineHeight: "0.95", letterSpacing: "-0.02em" }],
        display: ["clamp(2.5rem, 5vw, 4.5rem)", { lineHeight: "1.1", letterSpacing: "-0.01em" }],
        title: ["clamp(1.75rem, 3vw, 2.5rem)", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
      },
      transitionDuration: {
        "800": "800ms",
        "1200": "1200ms",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
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
