import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg:       '#F3EFE7',
        surface:  '#DDD2C3',
        elevated: '#FFFFFF',
        'text-main':      '#1E1E1E',
        'text-secondary': '#6E5846',
        'text-muted':     '#8A8178',
        divider:  '#CBB8A0',
        accent:   '#121212',
        'accent-dim': 'rgba(18,18,18,0.05)',
        /* legacy aliases kept so Tailwind doesn't purge them */
        ink:      '#F3EFE7',
        'ink-2':  '#DDD2C3',
        paper:    '#1E1E1E',
        'paper-2':'#6E5846',
        muted:    '#8A8178',
        border:   '#CBB8A0',
      },
      fontFamily: {
        sans:    ['Space Grotesk', 'system-ui', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
      },
      transitionTimingFunction: {
        'expo-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        'orb-a': {
          '0%,100%': { transform: 'translate(0,0) scale(1)' },
          '50%':     { transform: 'translate(-28px,-40px) scale(1.04)' },
        },
        'orb-b': {
          '0%,100%': { transform: 'translate(0,0) rotate(0deg)' },
          '33%':     { transform: 'translate(20px,-26px) rotate(5deg)' },
          '66%':     { transform: 'translate(-14px,16px) rotate(-4deg)' },
        },
        'orb-c': {
          '0%,100%': { transform: 'translate(0,0) scale(1)' },
          '50%':     { transform: 'translate(14px,-20px) scale(0.93)' },
        },
        'orb-d': {
          '0%,100%': { transform: 'translate(0,0) rotate(0deg)' },
          '50%':     { transform: 'translate(-10px,-16px) rotate(12deg)' },
        },
      },
      animation: {
        'orb-a': 'orb-a 10s ease-in-out infinite',
        'orb-b': 'orb-b 13s ease-in-out infinite',
        'orb-c': 'orb-c 8s ease-in-out infinite',
        'orb-d': 'orb-d 6.5s ease-in-out infinite',
      },
      boxShadow: {
        'accent':    '0 0 50px rgba(18,18,18,0.12)',
        'accent-sm': '0 0 22px rgba(18,18,18,0.08)',
        'card':      '0 0 0 1px #CBB8A0',
      },
    },
  },
  plugins: [],
};

export default config;
