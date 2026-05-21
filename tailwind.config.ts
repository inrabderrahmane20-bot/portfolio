import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg:        '#030308',
        surface:   '#07071a',
        glass:     'rgba(255,255,255,0.04)',
        'text-1':  '#ffffff',
        'text-2':  'rgba(255,255,255,0.62)',
        'text-3':  'rgba(255,255,255,0.32)',
        accent:    '#818cf8',
        'accent-2':'#38bdf8',
        'accent-h':'#a78bfa',
        'a-glow':  'rgba(129,140,248,0.28)',
        border:    'rgba(255,255,255,0.07)',
        'b-glow':  'rgba(129,140,248,0.35)',
        /* Legacy aliases so other pages don't break */
        ink:       '#ffffff',
        paper:     '#030308',
        muted:     'rgba(255,255,255,0.32)',
        divider:   'rgba(255,255,255,0.07)',
      },
      fontFamily: {
        sans:    ['Space Grotesk', 'system-ui', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
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
      },
      animation: {
        'orb-a': 'orb-a 10s ease-in-out infinite',
        'orb-b': 'orb-b 13s ease-in-out infinite',
      },
      boxShadow: {
        accent:     '0 0 50px rgba(129,140,248,0.18)',
        'accent-sm':'0 0 22px rgba(129,140,248,0.12)',
        card:       '0 0 0 1px rgba(255,255,255,0.07)',
        glow:       '0 0 40px rgba(129,140,248,0.22)',
        'glow-2':   '0 0 40px rgba(56,189,248,0.18)',
      },
    },
  },
  plugins: [],
};

export default config;
