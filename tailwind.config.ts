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
        primary: "#6366f1",
        secondary: "#f43f5e",
        warm: {
          50: "#fdf8f6",
          100: "#f2e8e5",
          // Add more warm tones as needed based on design spec
        }
      },
    },
  },
  plugins: [],
};
export default config;
