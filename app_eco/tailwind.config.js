/** @type {import('tailwindcss').Config} */
const tintColorLight = "#0a7ea4";

module.exports = {
  darkMode: "media",
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        /** Đồng bộ `tintColorLight` trong `constants/theme.ts` */
        primary: {
          DEFAULT: tintColorLight,
          foreground: "#ffffff",
        },
        app: {
          bg: "#ffffff",
          fg: "#11181C",
          muted: "#6B7280",
          surface: "#F3F4F6",
          border: "#E5E7EB",
          danger: "#DC2626",
          success: "#16A34A",
          warning: "#F97316",
          slate: "#1E293B",
        },
      },
      borderRadius: {
        card: "16px",
      },
    },
  },
  plugins: [],
};
