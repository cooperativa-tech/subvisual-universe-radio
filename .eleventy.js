const lazyImagesPlugin = require("eleventy-plugin-lazyimages");

module.exports = function (eleventyConfig) {
  eleventyConfig.setTemplateFormats([
    // Templates:
    "html",
    "njk",
    "liquid",
    "md",
    // Static Assets:
    "jpeg",
    "jpg",
    "png",
    "svg",
    "woff",
    "woff2",
  ]);

  eleventyConfig.addPlugin(lazyImagesPlugin, {
    transformImgPath: (src) => `./static/${src}`,
  });

  eleventyConfig.addFilter("formatDate", (date) =>
    new Date(date).toLocaleDateString(undefined, {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
  );

  return {
    dir: {
      input: "site/",
      data: "_data",
      includes: "_includes",
      output: "_output",
    },
  };
};
