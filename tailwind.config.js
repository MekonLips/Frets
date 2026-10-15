/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  // Keep the original app's browser defaults; reset styles would alter its appearance.
  corePlugins: { preflight: false },
  theme: { extend: {} },
  plugins: [],
};
