/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f7ff',
          100: '#e0f0ff',
          200: '#bae2ff',
          300: '#7cd4ff',
          400: '#38c7ff',
          500: '#0099ff',
          600: '#0072ff',
          700: '#0057ea',
          800: '#0046bd',
          900: '#003a94',
        },
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#1e293b',
          700: '#0f172a',
          800: '#0d1424',
          900: '#0b101e',
        }
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'strong': '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'neon': '0 0 15px rgba(0, 153, 255, 0.3), 0 0 30px rgba(0, 153, 255, 0.2)',
        'neon-hover': '0 0 20px rgba(0, 153, 255, 0.4), 0 0 40px rgba(0, 153, 255, 0.3)',
        'glass': '0 0 15px 0 rgba(255, 255, 255, 0.05)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 153, 255, 0.2), 0 0 10px rgba(0, 153, 255, 0.1)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 153, 255, 0.4), 0 0 40px rgba(0, 153, 255, 0.2)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-tech': 'linear-gradient(135deg, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};