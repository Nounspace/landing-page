/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'primary': ['Changa', 'sans-serif'],
        'secondary': ['JetBrains Mono', 'monospace'],
        // You can also override the default sans and mono fonts
        'sans': ['Changa', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
