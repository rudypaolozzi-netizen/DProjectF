/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#f4a825", // Or/Ambre (AetherVault login)
        "aether": "#13c8ec", // Cyan (Dashboard & Input)
        "bronze": "#b87333", // Cuivre (Dashboard)
        "brass": "#d4af37", // Laiton (History)
        "background-light": "#f6f8f8",
        "background-dark": "#101f22",
        "vault-dark": "#221b10",
        "surface": "#192f33",
        "surface-variant": "#234248",
        "on-surface-variant": "#92c0c9"
      },
      fontFamily: {
        "display": ["Space Grotesk", "sans-serif"],
        "cursive": ["Playball", "cursive"]
      }
    },
  },
  plugins: [],
};
