import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#2563EB",
          50: "#EFF6FF",
          600: "#1D4ED8",
          700: "#1E40AF",
        },
        navy: { DEFAULT: "#0F172A", 800: "#1E293B" },
        ice: "#EFF6FF",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        glow: "0 12px 32px -12px rgba(37, 99, 235, 0.6)",
        soft: "0 20px 50px -24px rgba(15, 23, 42, 0.25)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: { marquee: "marquee 38s linear infinite" },
    },
  },
  plugins: [],
};

export default config;
