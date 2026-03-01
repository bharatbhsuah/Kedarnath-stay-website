/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FFF8F3',
        dark: '#1a1a1a',
        forest: '#2D5016',
        'forest-light': '#3A6B1F',
        'forest-dark': '#1e3610',
        gold: '#C9A227',
        'gold-light': '#E5C76B',
        earth: '#8B6F47',
        sand: '#E8DCC8',
        muted: '#6b7280',
      },
      fontFamily: {
        body: ['DM Sans', 'sans-serif'],
        heading: ['Playfair Display', 'serif'],
      },
      boxShadow: {
        card: '0 4px 14px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 12px 28px rgba(0, 0, 0, 0.12)',
        soft: '0 2px 8px rgba(45, 80, 22, 0.06)',
      },
      borderRadius: {
        card: '12px',
        button: '8px',
      },
    },
  },
  plugins: [],
}
