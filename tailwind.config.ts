export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      backgroundImage: {
        "custom-gradient":
          "linear-gradient(to top, #000000, #120d10, #1b161d, #1f1f2a, #1f2937);",
      },
      fontFamily: {
        roboto: ["Roboto", "sans-serif"], // Menambahkan Roboto ke dalam fontFamily
      },
    },
  },
  plugins: [],
};
