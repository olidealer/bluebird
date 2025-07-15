
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Using CSS variables for dynamic theming from backend
        'brand-primary': 'var(--color-primary)',
        'brand-secondary': '#FF5A5F',
        'brand-light': '#F7F7F7',
        'brand-dark': '#484848',
      }
    },
  },
  plugins: [],
}
