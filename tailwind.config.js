/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: "#f2d00d",
        "primary-dark": "#cba108",
        "background-light": "#f8f8f5",
        "background-dark": "#221f10",
        "surface-dark": "#2d2a1b",
        "surface-darker": "#1a180c",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "sans-serif"],
        serif: ["Playfair Display", "serif"],
      },
      backgroundImage: {
        'pattern-dots': "radial-gradient(rgba(242, 208, 13, 0.1) 1px, transparent 1px)",
      },
      animation: {
        'fade-in-up': 'fadeInUp 1s ease-out forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}

