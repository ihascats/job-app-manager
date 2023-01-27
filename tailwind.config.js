/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      height: {
        'screen-p4': 'calc(100vh - 48px)',
      },
      width: {
        'screen-p4': 'calc(100vw - 32px)',
        'screen-resume-select': 'calc(100% - 36px);',
      },
    },
  },
  plugins: [],
};
