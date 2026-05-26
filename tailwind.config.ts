import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Enterprise base
        ink: {
          50: "#f7f8fb",
          100: "#eef0f6",
          200: "#d8dce8",
          300: "#b4bbcf",
          400: "#7e88a3",
          500: "#5a647e",
          600: "#3f485f",
          700: "#2b3146",
          800: "#1a1f31",
          900: "#0f1322",
          950: "#080b18",
        },
        // Sidebar / dark navy
        navy: {
          DEFAULT: "#0f172a",
          deep: "#0a1224",
          panel: "#111a2e",
        },
        // Accents
        accent: {
          blue: "#3b82f6",
          indigo: "#6366f1",
          cyan: "#22d3ee",
          neon: "#7df9ff",
        },
        status: {
          success: "#10b981",
          warning: "#f59e0b",
          error: "#ef4444",
          pending: "#94a3b8",
          info: "#3b82f6",
        },
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(rgba(15,23,42,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.04) 1px, transparent 1px)",
        "radial-glow":
          "radial-gradient(ellipse at top, rgba(99,102,241,0.12), transparent 60%)",
      },
      backgroundSize: {
        "grid-32": "32px 32px",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(15, 23, 42, 0.08)",
        "glass-lg": "0 20px 60px rgba(15, 23, 42, 0.12)",
        "neon-blue": "0 0 0 1px rgba(59,130,246,0.6), 0 0 24px rgba(59,130,246,0.45)",
        "neon-cyan": "0 0 0 1px rgba(34,211,238,0.6), 0 0 28px rgba(34,211,238,0.55)",
      },
      animation: {
        "pulse-glow": "pulseGlow 1.8s ease-in-out infinite",
        "hook-trace": "hookTrace 1.2s ease-out forwards",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": {
            boxShadow:
              "0 0 0 1px rgba(34,211,238,0.55), 0 0 18px rgba(34,211,238,0.35)",
          },
          "50%": {
            boxShadow:
              "0 0 0 1px rgba(34,211,238,0.9), 0 0 36px rgba(34,211,238,0.65)",
          },
        },
        hookTrace: {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "system-ui",
          "sans-serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Consolas",
          "monospace",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
