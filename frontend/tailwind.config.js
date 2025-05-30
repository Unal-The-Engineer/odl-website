/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#4ECDC4',
          DEFAULT: '#2EC4B6',
          dark: '#1A9C8F',
        },
        secondary: {
          light: '#FFE66D',
          DEFAULT: '#FFD23F',
          dark: '#F4B400',
        },
        accent: {
          light: '#FF8360',
          DEFAULT: '#FF6B6B',
          dark: '#EE4266',
        },
        success: {
          light: '#9BE564',
          DEFAULT: '#6BD425',
          dark: '#4F9E19',
        },
        warning: {
          light: '#FFD166',
          DEFAULT: '#F4B400',
          dark: '#E09600',
        },
        error: {
          light: '#FF8A80',
          DEFAULT: '#FF5252',
          dark: '#D50000',
        },
        neutral: {
          light: '#F1F5F9',
          medium: '#E2E8F0',
          'medium-20': 'rgba(226, 232, 240, 0.2)',
          dark: '#CBD5E1',
        },
        background: '#F1F5F9',
        border: '#CBD5E1',
        text: {
          light: '#64748B',
          medium: '#475569',
          dark: '#1E293B',
        },
      },
      fontFamily: {
        sans: ['Quicksand', 'ui-sans-serif', 'system-ui'],
        display: ['Quicksand', 'ui-sans-serif', 'system-ui'],
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'blob': 'blob 7s infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
        }
      }
    },
  },
  plugins: [],
};