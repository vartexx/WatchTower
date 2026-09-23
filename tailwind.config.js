/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          950: '#070b12',
          900: '#0c1322',
          850: '#111a2e',
          800: '#17233d',
          700: '#233458',
          accent: '#00f0ff',
          neon: '#00ff88',
          amber: '#ffaa00',
          danger: '#ff3366',
          purple: '#9d4edd',
        },
        aegis: {
          bg: '#0b161d',
          panel: '#14242d',
          'panel-2': '#10202a',
          line: '#253740',
          cyan: '#6be1d6',
          lime: '#c2e66b',
          amber: '#efb867',
          red: '#ff746d',
          blue: '#77a9ff',
          muted: '#7f939d',
          ink: '#e6edf0',
        }
      },
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        mono: ['DM Mono', 'JetBrains Mono', 'monospace', 'ui-monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
