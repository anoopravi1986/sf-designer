/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'custom-light': '0 0 0 1px rgba(64, 87, 109, 0.04), 0 6px 20px -4px rgba(64, 87, 109, 0.3)',
      }
    }
  },
  plugins: [],
};