/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream:         '#F5F3EE',
        'cream-light': '#FAFAF8',
        black:         '#1A1A1A',
        'black-light': '#2D2D2D',
        accent:        '#E8714F',
      },
      fontFamily: {
        display: ['Anton', 'sans-serif'],
        editorial: ['Libre Baskerville', 'serif'],
        ui: ['DM Sans', 'sans-serif'],
        data: ['Courier Prime', 'monospace'],
      },
      boxShadow: {
        editorial: '4px 4px 0px rgba(26, 26, 26, 0.5)',
      },
      borderWidth: {
        rule: '2px',
      },
      keyframes: {
        marquee: {
          '0%':   { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'slide-down': {
          '0%':   { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)',      opacity: '1' },
        },
      },
      animation: {
        marquee:    'marquee 28s linear infinite',
        'slide-down': 'slide-down 0.3s ease forwards',
      },
    },
  },
  plugins: [],
}
