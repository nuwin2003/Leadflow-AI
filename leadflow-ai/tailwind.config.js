/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./context/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
    "./utils/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#E6F1FB',
          100: '#B5D4F4',
          200: '#85B7EB',
          400: '#378ADD',
          600: '#185FA5',
          800: '#0C447C',
          900: '#042C53',
        },
      },
      fontFamily: {
        sans: ['var(--font-dm)', 'DM Sans', 'system-ui', 'sans-serif'],
        syne: ['var(--font-syne)', 'sans-serif'],
        reglo: ['Reglo', 'sans-serif'],
        dm: ['var(--font-dm)', 'DM Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      keyframes: {
        drift1: {
          '0%, 100%': { transform: 'translate(0px, 0px)' },
          '33%': { transform: 'translate(-18px, 24px)' },
          '66%': { transform: 'translate(12px, -16px)' },
        },
        drift2: {
          '0%, 100%': { transform: 'translate(0px, 0px)' },
          '33%': { transform: 'translate(22px, -18px)' },
          '66%': { transform: 'translate(-14px, 20px)' },
        },
        drift3: {
          '0%, 100%': { transform: 'translate(-50%, -50%)' },
          '50%': { transform: 'translate(-44%, -56%)' },
        },
      },
      animation: {
        'drift-1': 'drift1 9s ease-in-out infinite',
        'drift-2': 'drift2 11s ease-in-out infinite',
        'drift-3': 'drift3 14s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
