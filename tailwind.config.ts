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
        // Your custom colors
        maroon: {
          primary: "#A91D3A",
          secondary: "#8B1528",
          light: "#E8CDD1",
        },
        gold: {
          primary: "#FFD700",
          secondary: "#E8B923",
          light: "#FFF4D6",
        },
        // Tokens used by shadcn UI components
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      },
      borderRadius: {
        lg: "var(--radius)", // used by shadcn UI buttons/cards
      },
      fontFamily: {
        sans: ["Segoe UI", "Tahoma", "Geneva", "Verdana", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;

