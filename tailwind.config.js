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
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace', 'ui-monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
