/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        crimson: ['"Crimson Text"', 'Georgia', 'serif'],
      },
      colors: {
        blood: {
          DEFAULT: '#c0000c',
          bright: '#ff2222',
          dim: '#8b0000',
          deep: '#550000',
        },
        void: {
          DEFAULT: '#080808',
          2: '#0e0e0e',
          3: '#141414',
          card: '#101010',
          border: '#1e1e1e',
        },
      },
      animation: {
        flicker: 'flicker 5s infinite',
        'glow-pulse': 'glowPulse 3s infinite',
        'fade-in': 'fadeIn 0.35s ease forwards',
        'slide-in': 'slideIn 0.3s ease forwards',
      },
      keyframes: {
        flicker: {
          '0%,100%': { opacity: '1' },
          '45%': { opacity: '0.9' },
          '50%': { opacity: '0.65' },
          '55%': { opacity: '0.9' },
        },
        glowPulse: {
          '0%,100%': { boxShadow: '0 0 6px rgba(192,0,12,0.4)' },
          '50%': { boxShadow: '0 0 22px rgba(192,0,12,0.9)' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          from: { opacity: '0', transform: 'translateX(-12px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
      },
      backdropBlur: {
        xs: '4px',
      },
      backgroundImage: {
        'red-glow': 'radial-gradient(ellipse at 50% 0%, rgba(192,0,12,0.15) 0%, transparent 60%)',
      },
    },
  },
  plugins: [],
}
