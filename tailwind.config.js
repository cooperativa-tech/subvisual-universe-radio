module.exports = {
  purge: {
    mode: "all",
    content: ["./site/**/*", "./assets/**/*"],
  },
  theme: {
    screens: {
      "2xl": { max: "1535px" },
      xl: { max: "1279px" },
      lg: { max: "1023px" },
      md: { max: "767px" },
      sm: { max: "639px" },
    },
  },
};
