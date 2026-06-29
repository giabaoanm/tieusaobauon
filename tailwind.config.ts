import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Bảng màu "trúc khô" — vàng hổ phách ấm của cây tre/trúc đã phơi khô.
        // Sáng (50-100): kem ngà · Vàng đặc trưng (300-500) · Tối (700-900): nâu gỗ.
        bamboo: {
          50: "#faf6ea",
          100: "#f1e8cf",
          200: "#e2d0a4",
          300: "#ccb074",
          400: "#b8964e", // vàng hoàng thổ trầm, ngả nâu (trúc khô lâu năm)
          500: "#a07d3a",
          600: "#87662e", // nền nút (chữ trắng)
          700: "#6d5226",
          800: "#574221",
          900: "#45351c", // màu chữ (nâu đất)
        },
        clay: {
          50: "#faf6f2",
          100: "#f1e7da",
          200: "#e2cdb5",
          300: "#cfac88",
          400: "#bd8a5f",
          500: "#ad7148",
          600: "#985b3d",
          700: "#7e4734",
          800: "#683b30",
          900: "#56332a",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
