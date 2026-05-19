/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        pitch:    '#0A0A0B',
        surface:  '#1C1C1E',
        green:    '#AAFF45',
        snow:     '#F5F5F0',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        body:    ['Sora', 'sans-serif'],
        mono:    ['"DM Mono"', 'monospace'],
      },
      keyframes: {
        heartbeat: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(170,255,69,0.6)' },
          '50%':       { boxShadow: '0 0 0 16px rgba(170,255,69,0)' },
        },
        breathe: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(170,255,69,0.10)' },
          '50%':       { boxShadow: '0 0 60px rgba(170,255,69,0.30)' },
        },
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
        heartbeat:  'heartbeat 0.4s ease-out 1',
        breathe:    'breathe 3s ease-in-out infinite',
        marquee:    'marquee 28s linear infinite',
        'slide-down': 'slide-down 0.3s ease forwards',
      },
      backgroundImage: {
        'flare-tr': 'radial-gradient(ellipse at top right, rgba(255,220,100,0.06) 0%, transparent 60%)',
      },
    },
  },
  plugins: [],
}
