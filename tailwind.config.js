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
        watchtower: {
          bg: '#040507',
          card: '#0c0e14',
          'card-deep': '#07080c',
          line: '#181f2e',
          cyan: '#00f0ff',
          lime: '#00ff9d',
          amber: '#ffb703',
          red: '#ff2a5f',
          blue: '#38bdf8',
          purple: '#a855f7',
          muted: '#94a3b8',
          ink: '#f8fafc',
        },
        aegis: {
          bg: '#040507',
          panel: '#0c0e14',
          'panel-2': '#07080c',
          line: '#181f2e',
          cyan: '#00f0ff',
          lime: '#00ff9d',
          amber: '#ffb703',
          red: '#ff2a5f',
          blue: '#38bdf8',
          purple: '#a855f7',
          muted: '#94a3b8',
          ink: '#f8fafc',
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
