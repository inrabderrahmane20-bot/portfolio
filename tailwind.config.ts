import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        void:      '#030308',
        nebula:    '#08081F',
        starlight: '#EEF1FF',
        indigo2:   '#818CF8',
        cyan2:     '#38BDF8',
        violet2:   '#A78BFA',
      },
      fontFamily: {
        /* `serif` stays the display slot — mapped to Syne for the Deep Field theme */
        serif: ['Syne', 'system-ui', 'sans-serif'],
        sans:  ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono:  ['JetBrains Mono', 'monospace'],
      },
      transitionTimingFunction: {
        'expo-out': 'cubic-bezier(0.19, 1, 0.22, 1)',
      },
      boxShadow: {
        glow:    '0 0 40px rgba(99, 102, 241, 0.25)',
        'glow-c':'0 0 40px rgba(56, 189, 248, 0.2)',
      },
    },
  },
  plugins: [],
};

export default config;
