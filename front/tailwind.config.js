/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        manrope: ["Manrope", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#FE6801",
          dark: "#E65E00",
          container: "#FE6801",
          50: "#FACDAC",
          100: "#FCA060",
          700: "#FE8831",
        },
        secondary: "#575e70",
        "on-primary": "#FFFFFF",
        background: "#f8f9fa",
        surface: {
          DEFAULT: "#ffffff",
          dim: "#f3f4f5",
          container: "#F3F4F5",
        },
        "on-surface": {
          DEFAULT: "#191c1d",
          variant: "#464555",
        },
        outline: {
          DEFAULT: "#777587",
          variant: "#c7c4d8",
        },
        error: {
          DEFAULT: "#ba1a1a",
          container: "#ffdad6",
        },
        success: "#10B981",
      },
      maxWidth: {
        container: "1280px",
      },
      boxShadow: {
        soft: "0 1px 3px rgba(254,104,1,0.04), 0 1px 2px rgba(254,104,1,0.06)",
        elevated: "0 4px 6px rgba(254,104,1,0.04), 0 10px 15px rgba(254,104,1,0.06)",
        hover: "0 10px 25px rgba(254,104,1,0.08), 0 4px 10px rgba(254,104,1,0.04)",
      },
      fontSize: {
        display: ["48px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "800" }],
        h1: ["32px", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "700" }],
        h2: ["24px", { lineHeight: "1.3", fontWeight: "700" }],
        h3: ["20px", { lineHeight: "1.4", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "1.6", fontWeight: "400" }],
        "body-sm": ["14px", { lineHeight: "1.5", fontWeight: "400" }],
        "label-caps": ["12px", { lineHeight: "1", letterSpacing: "0.05em", fontWeight: "700" }],
      },
      borderRadius: {
        sm: "0.25rem",
        DEFAULT: "0.5rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.5rem",
        full: "9999px",
      },
    },
  },
  plugins: [],
};
