/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    // ...
  ],
  
    backgroundImage: {
      'hero': "url('../client/src/photo/New_York_Midtown_Skyline_at_night.jpg')",
    },

}