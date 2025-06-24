import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Original shadcn colors
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Modern Verse colors with glassmorphism support
        verse: {
          "primary-bg": "#0a0a0a",
          "secondary-bg": "#1a1a1a",
          "accent-bg": "#2a2a2a",
          "glass-bg": "rgba(255, 255, 255, 0.1)",
          "glass-border": "rgba(255, 255, 255, 0.2)",
          "glass-hover": "rgba(255, 255, 255, 0.15)",
          "loading-overlay": "rgba(10, 10, 10, 0.8)",
          "nav-button": "#f8f9fa",
          "nav-button-dark": "rgba(248, 249, 250, 0.1)",
          "text-primary": "#ffffff",
          "text-secondary": "#a0a0a0",
          "text-muted": "#666666",
          "accent-blue": "#3b82f6",
          "accent-purple": "#8b5cf6",
          "accent-green": "#10b981",
          "accent-orange": "#f59e0b",
          "accent-red": "#ef4444",
          "gradient-start": "#667eea",
          "gradient-end": "#764ba2",
        },
      },
      fontFamily: {
        verse: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Consolas", "monospace"],
      },
      fontSize: {
        "verse-xs": "11px",
        "verse-sm": "13px",
        "verse-base": "15px",
        "verse-lg": "17px",
        "verse-xl": "20px",
        "verse-2xl": "24px",
        "verse-3xl": "32px",
      },
      fontWeight: {
        "verse-light": "300",
        "verse-normal": "400",
        "verse-medium": "500",
        "verse-semibold": "600",
        "verse-bold": "700",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        verse: "12px",
        "verse-sm": "8px",
        "verse-lg": "16px",
        "verse-xl": "20px",
      },
      backdropBlur: {
        xs: "2px",
        verse: "16px",
        "verse-lg": "24px",
      },
      boxShadow: {
        verse: "0 8px 32px rgba(0, 0, 0, 0.12)",
        "verse-lg": "0 20px 40px rgba(0, 0, 0, 0.15)",
        "verse-xl": "0 30px 60px rgba(0, 0, 0, 0.2)",
        "verse-glass": "0 8px 32px rgba(0, 0, 0, 0.3)",
        "verse-glow": "0 0 20px rgba(59, 130, 246, 0.4)",
        "verse-purple-glow": "0 0 20px rgba(139, 92, 246, 0.4)",
      },
      spacing: {
        "verse-xs": "4px",
        "verse-sm": "8px",
        "verse-md": "16px",
        "verse-lg": "24px",
        "verse-xl": "32px",
        "verse-2xl": "48px",
      },
      transitionDuration: {
        verse: "0.2s",
        "verse-slow": "0.4s",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "spin-smooth": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.05)" },
        },
        "slide-up": {
          from: { transform: "translateY(100%)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "slide-down": {
          from: { transform: "translateY(-100%)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "scale-in": {
          from: { transform: "scale(0.95)", opacity: "0" },
          to: { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "spin-smooth": "spin-smooth 1s linear infinite",
        float: "float 3s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "slide-up": "slide-up 0.3s ease-out",
        "slide-down": "slide-down 0.3s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-verse": "linear-gradient(135deg, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
