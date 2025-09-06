/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
  'brand-blue': '#3b82f6',
  'brand-cyan': '#06b6d4',
  'brand-violet': '#9333ea',
  bg: 'rgb(var(--bg) / <alpha-value>)',
  fg: 'rgb(var(--fg) / <alpha-value>)',
  muted: 'rgb(var(--muted) / <alpha-value>)',
  card: 'rgb(var(--card) / <alpha-value>)',
  primary: 'rgb(var(--primary) / <alpha-value>)',
      },
    },
  },
  plugins: [],
}
