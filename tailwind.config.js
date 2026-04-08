/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#F5F0E8',
        'cream-dark': '#EDE8DF',
        'cream-deeper': '#E5DDD0',
        gold: '#7D6B3F',
        'gold-light': '#A08952',
        'gold-pale': '#C4A96A',
        'gold-muted': '#B09A6A',
        dark: '#1C1C1C',
        'dark-rich': '#141412',
        muted: '#6B6B6B',
        'muted-light': '#9B9B9B',
      },
      fontFamily: {
        playfair: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '7xl': '4.5rem',
        '8xl': '6rem',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'fade-up': 'fadeUp 0.8s ease-out forwards',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
