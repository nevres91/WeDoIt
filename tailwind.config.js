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
      },
    },
  },
  plugins: [],
};
