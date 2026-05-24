import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0a0a0a",
          900: "#0a0a0a",
          800: "#141414",
          700: "#1c1c1c",
          600: "#2a2a2a",
        },
        bone: {
          DEFAULT: "#f5f1ea",
          50: "#fbf9f4",
          100: "#f5f1ea",
          200: "#ebe4d6",
        },
        coral: {
          DEFAULT: "#7B65C8",
          400: "#9580D6",
          500: "#7B65C8",
          600: "#6450B0",
        },
        sunny: {
          DEFAULT: "#ffd23f",
          400: "#ffdc66",
          500: "#ffd23f",
          600: "#e6b800",
        },
        electric: {
          DEFAULT: "#3a5cff",
          500: "#3a5cff",
          600: "#1a3ce0",
        },
        mint: {
          DEFAULT: "#7af0c8",
          500: "#7af0c8",
        },
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', "serif"],
        body: ['"DM Sans"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
        kr: ['"Noto Sans KR"', "sans-serif"],
      },
      animation: {
        "marquee": "marquee 40s linear infinite",
        "marquee-slow": "marquee 80s linear infinite",
        "fade-up": "fadeUp 0.8s ease-out forwards",
        "fade-in": "fadeIn 1s ease-out forwards",
        "spin-slow": "spin 20s linear infinite",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
