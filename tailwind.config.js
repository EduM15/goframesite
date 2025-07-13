// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'bebas-neue': ['Bebas Neue', 'cursive'],
      },
      colors: {
        // Paleta de Cores do Projeto GoFrame
        background: '#121212', // Fundo Principal
        surface: '#1e1e1e',    // Cards/Superfícies
        primary: '#FF4500',    // Destaque Laranja
        'text-main': '#FFFFFF',
        'text-secondary': '#B3B3B3',
        success: '#4caf50',
        danger: '#f44336',
      }
    },
  },
  plugins: [],
}