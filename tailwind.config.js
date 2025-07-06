export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        headline: ['Syncopate', 'sans-serif'],
        body: ['Rubik', 'sans-serif'],
        mono: ['Share Tech Mono', 'monospace'],
      },
      colors: {
        orange: '#FF6B00',
        blue: '#00BFFF',
        pink: '#FF69B4',
        purple: '#8A2BE2',
        light: '#cccccc',
        dark: '#000000',
        'mid-dark': '#111111',
        'light-dark': '#1a1a1a',
        muted: '#888888',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' }
        },
        scroll: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' }
        },
        'fade-in-up': {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(20px)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateY(0)' 
          }
        },
        breathing: {
          '0%, 100%': { 
            transform: 'scale(1)', 
            opacity: '1' 
          },
          '50%': { 
            transform: 'scale(1.05)', 
            opacity: '0.9' 
          }
        },
        gradient: {
          '0%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
          '100%': { 'background-position': '0% 50%' }
        }
      },
      animation: {
        marquee: 'marquee 7200s linear infinite',
        scroll: 'scroll 7200s linear infinite',
        'fade-in-up': 'fade-in-up 0.6s ease-out',
        breathing: 'breathing 3s ease-in-out infinite',
        gradient: 'gradient 3s ease infinite'
      }
    }
  },
  plugins: []
}