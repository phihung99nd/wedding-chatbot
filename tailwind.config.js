/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        blush: {
          50: '#fdf7f6',
          100: '#f8e8e4',
          200: '#f2d3cc',
          300: '#e7b0a8',
          400: '#d9827a'
        },
        ivory: '#f9f5f0',
        ink: '#2a2a2a'
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['Nunito', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        soft: '0 18px 45px rgba(15, 23, 42, 0.12)'
      },
      backgroundImage: {
        'romantic-gradient':
          'radial-gradient(circle at top left, rgba(244, 219, 210, 0.85), transparent 55%), radial-gradient(circle at bottom right, rgba(237, 217, 200, 0.9), transparent 55%)'
      }
    }
  },
  plugins: []
}

