import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        negro: "#0A0A0A",
        gris: "#181818",
        ligero: "#454545",
        nubes: "#7f7f7f",
        cielo: "#2B7FD5",
        blanco: "#E7F3F6",
        oscuro: "#2B674E",
        rosa: "#DE5689",
        amarillo: "#F0F373",
        ama: "#FFFCBD",
        noche: "#96A9B6",
        brillo: "#6AFE98",
        masa: "#06B4D1",
        naranja: "#FBAB39",
      },
      fontFamily: {
        vcr: "Vcr",
        bit: "Bitblox",
        mana: "Manaspace",
        abad: "Abaddon",
        con: "Consolas",
        arc: "Arcadia",
        nerdS: "Nerd Semi",
        nerdC: "Nerd Con",
        gothic: "Gothic",
        dep: "Departure",
        count: "Countdown",
      },
      fontSize: {
        xxs: "0.6rem",
      },
      screens: {
        preG: "377px",
      },
    },
  },
  plugins: [],
} satisfies Config;
