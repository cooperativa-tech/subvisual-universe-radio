module.exports = {
  mount: {
    _output: "/",
    assets: "/assets",
    static: "/",
  },
  plugins: [
    "snowpack-plugin-hash",
    "@snowpack/plugin-postcss",
    [
      "@snowpack/plugin-run-script",
      { cmd: "eleventy", watch: "$1 --watch --quiet" },
    ],
  ],
  devOptions: {
    hmrDelay: 300,
    open: "none",
  },
  optimize: {
    bundle: true,
    minify: true,
    target: "es2017",
  },
};
