/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light Grace Theme
        'light-grace': {
          primary: '#3A7CA5',
          secondary: '#F2E9E4',
          background: '#FAFAFA',
          text: '#2C2C2C',
          accent: '#E8B04C',
          divider: '#E0E0E0',
        },
        // Warm Faith Theme
        'warm-faith': {
          primary: '#D77A61',
          secondary: '#FFF3E2',
          background: '#F7E7CE',
          text: '#4B2E05',
          accent: '#B5C99A',
          divider: '#E6D8C3',
        },
        // Nature Hope Theme
        'nature-hope': {
          primary: '#387C6D',
          secondary: '#F0F5F3',
          background: '#E3EDE6',
          text: '#1E392A',
          accent: '#E2C044',
          divider: '#D7E2DC',
        },
        // Midnight Prayer Theme
        'midnight-prayer': {
          primary: '#1E2A38',
          secondary: '#2F3E46',
          background: '#121212',
          text: '#E0E0E0',
          accent: '#C5A25D',
          divider: '#3E4A52',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'h1': ['32px', { lineHeight: '1.2', fontWeight: '700' }],
        'h2': ['24px', { lineHeight: '1.3', fontWeight: '600' }],
        'h3': ['20px', { lineHeight: '1.4', fontWeight: '500' }],
        'body': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'small': ['14px', { lineHeight: '1.4', fontWeight: '400' }],
      },
    },
  },
  plugins: [],
}