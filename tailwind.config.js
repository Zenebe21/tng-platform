/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        tngDark: '#0B0F19',
        tngCard: '#161F30',
        tngGold: '#F59E0B',
        tngLight: '#F3F4F6',
      },
    },
  },
  plugins: [],
};
