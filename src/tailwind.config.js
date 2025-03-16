/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}", // Đảm bảo Tailwind áp dụng cho tất cả file React
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  };
  