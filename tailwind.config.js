/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Add your custom color here
        "form-bg": "#F8F9FA",
        "text-color": "#333333 ",
        "input-bg": "#FFFFFF ",
        "input-text": "#555555",
        "login-button": "#FF7F50 ",
        "button-hover": "#c7603a ",
        "custom-blue": "#4A90E2",

        "calm-n-cool-1-hover": "#d1c6be",
        "calm-n-cool-1": "#F6EAE2",
        "calm-n-cool-2.2": "#6c807e",
        "calm-n-cool-2": "#47DCCa",
        "calm-n-cool-3": "#04BFBF",
        "calm-n-cool-4": "#037F8C",
        "calm-n-cool-5": "#005163",
        "calm-n-cool-6": "#013440",
      },
      backgroundImage: {
        couple: "url('/src/assets/couple.png')",
        husband: "url('/src/assets/husband.png')",
        wife: "url('/src/assets/wife.png')",
        dashboard: `url('src/assets/dashboard_2.jpg')`,
        woman: `url('src/assets/woman_small.png')`,
        man: `url('src/assets/man.png')`,
        profile: `url('src/assets/profile_picture.jpg')`,
        findPartner: `url('src/assets/find_partner_2.png')`,
        cupid: `url('src/assets/cupid_2.png')`,
        edit_profile: `url('src/assets/edit_profile.svg')`,
      },
      fontFamily: {
        montserrat: ["montserrat", "sans-serif"],
      },
    },
  },
  plugins: [],
};
