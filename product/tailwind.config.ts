import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1d1d1f",
        sub: "#6e6e73",
        faint: "#f5f5f7",
        line: "#d2d2d7",
        accent: "#0071e3",
        ok: "#1d8a3e",
        warn: "#b45309",
        danger: "#c92a1f",
      },
      fontFamily: {
        sans: [
          "var(--font-geist-sans)",
          "SF Pro Display",
          "Segoe UI",
          "system-ui",
          "sans-serif",
        ],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
