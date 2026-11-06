/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fredoka', 'ui-rounded', '"Arial Rounded MT Bold"', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: '#2a1650',
        grape: '#5b2bd6',
        night: '#1b0b3a',
      },
      keyframes: {
        pop: { '0%': { transform: 'scale(0.4)', opacity: '0' }, '100%': { transform: 'scale(1)', opacity: '1' } },
        wiggle: { '0%, 100%': { transform: 'rotate(-4deg)' }, '50%': { transform: 'rotate(4deg)' } },
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-14px)' } },
        'bounce-in': {
          '0%': { transform: 'translateY(-60px) scale(0.6)', opacity: '0' },
          '60%': { transform: 'translateY(8px) scale(1.05)', opacity: '1' },
          '100%': { transform: 'translateY(0) scale(1)' },
        },
        zoom: {
          '0%': { transform: 'scale(0.2) rotate(-12deg)', opacity: '0' },
          '100%': { transform: 'scale(1) rotate(0)', opacity: '1' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-10px)' },
          '40%, 80%': { transform: 'translateX(10px)' },
        },
        'pulse-big': { '0%, 100%': { transform: 'scale(1)' }, '50%': { transform: 'scale(1.08)' } },
        rise: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '30%': { transform: 'translateY(0)', opacity: '1' },
          '80%': { transform: 'translateY(-18px)', opacity: '1' },
          '100%': { transform: 'translateY(-30px)', opacity: '0' },
        },
      },
      animation: {
        pop: 'pop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        wiggle: 'wiggle 1.2s ease-in-out infinite',
        float: 'float 4s ease-in-out infinite',
        'bounce-in': 'bounce-in 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        zoom: 'zoom 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        shake: 'shake 0.5s ease-in-out both',
        'pulse-big': 'pulse-big 1s ease-in-out infinite',
        rise: 'rise 0.9s ease-out both',
      },
    },
  },
  plugins: [],
};
