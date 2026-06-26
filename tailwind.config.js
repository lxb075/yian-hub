/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        // 品牌主色
        moss: {
          50: "#F2F4F1",
          100: "#DEE5DD",
          200: "#B9C8B6",
          300: "#92AC8D",
          400: "#6B8E64",
          500: "#4D7247",
          600: "#3D5C39",
          700: "#2F4A3A", // 主色
          800: "#243830",
          900: "#1A2A26",
        },
        sand: {
          50: "#FBF7EF",
          100: "#F4EFE6", // 背景底
          200: "#E9DFCD",
          300: "#D9C8A6",
          400: "#C8A45C", // 强调金
          500: "#B58A3F",
          600: "#937031",
        },
        ink: {
          50: "#F4F5F4",
          100: "#E2E4E1",
          200: "#BFC3BD",
          300: "#8E9489",
          400: "#5E645B",
          500: "#3A4037",
          600: "#1B1F1C", // 深墨
        },
        // 功能色
        alert: {
          DEFAULT: "#C8553D",
          soft: "#F2D7CF",
        },
        warn: {
          DEFAULT: "#D9A441",
          soft: "#F5E5BD",
        },
        safe: {
          DEFAULT: "#7FB59C",
          soft: "#D9EBDF",
        },
        info: {
          DEFAULT: "#5A6B7B",
          soft: "#D6DEE5",
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['"Manrope"', '"PingFang SC"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"SF Mono"', 'Consolas', 'monospace'],
      },
      boxShadow: {
        card: "0 1px 0 0 rgba(27,31,28,0.04), 0 1px 3px 0 rgba(27,31,28,0.04)",
        soft: "0 4px 16px -8px rgba(27,31,28,0.08)",
        ring: "0 0 0 4px rgba(47,74,58,0.08)",
        glow: "0 0 0 1px rgba(200,164,92,0.4), 0 8px 32px -8px rgba(200,164,92,0.25)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseRing: {
          "0%": { boxShadow: "0 0 0 0 rgba(200,85,61,0.45)" },
          "70%": { boxShadow: "0 0 0 12px rgba(200,85,61,0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(200,85,61,0)" },
        },
        wave: {
          "0%,100%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(6px)" },
        },
        countUp: {
          from: { opacity: "0.4", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        rise: "rise 0.5s cubic-bezier(0.22, 0.61, 0.36, 1) both",
        "pulse-ring": "pulseRing 1.8s cubic-bezier(0.66, 0, 0, 1) infinite",
        wave: "wave 1.4s ease-in-out infinite",
        "count-up": "countUp 0.4s ease-out",
      },
    },
  },
  plugins: [],
};
