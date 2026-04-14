const pluginRss = require("@11ty/eleventy-plugin-rss");
const svgSprite = require("eleventy-plugin-svg-sprite");
const dateFilter = require('./src/filters/dateFilter.js');

module.exports = function (config) {
  // RELOAD ON SCSS COMPILE
  config.setBrowserSyncConfig({
    files: './src/assets/styles/*.css'
  });

  // PASSTHROUGHS
  config.addPassthroughCopy("src/assets/images/");
  config.addPassthroughCopy("src/assets/vendor/css/bootstrap.min.css");
  config.addPassthroughCopy("src/assets/vendor/css/materialdesignicons.min.css");
  config.addPassthroughCopy("src/assets/vendor/css/pe-icon-7-stroke.css");
  config.addPassthroughCopy("src/assets/vendor/css/tiny-slider.css");
  config.addPassthroughCopy("src/assets/vendor/css/style.css");
  config.addPassthroughCopy("src/assets/vendor/js");
  config.addPassthroughCopy("src/assets/js");
  config.addPassthroughCopy({"src/assets/fonts" : "assets/vendor/fonts"});
  config.addPassthroughCopy({"src/flyers/*.html" : "flyers"});

  // Exclude raw flyer HTML files from template processing (passthrough only)
  config.ignores.add("src/flyers/*.html");

  // LAYOUTS //
  config.addLayoutAlias("base", "layouts/base.njk");

  // FILTERS //
  config.addFilter('dateFilter', dateFilter);

  // TRANSFORMS //
  // minify HTML
  const htmlMinTransform = require("./src/transforms/html-min.js");
  const isProduction = process.env.ELEVENTY_ENV === "production";
  // html min only in production
  if (isProduction) {
    config.addTransform("htmlmin", htmlMinTransform);
  }

  // PLUG-INS //
  config.addPlugin(pluginRss);
  config.addPlugin(svgSprite, {
    path: "./src/assets/icons",
    svgShortcode: "icon",
    globalClasses: "icon",
  });

  // EXTRAS //
  // Post List Excerpts
  config.setFrontMatterParsingOptions({
    excerpt: true,
    excerpt_separator: "<!-- excerpt -->",
  });

  // BASE CONFIGURATION //
  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "includes",
      data: "data",
    },
    templateFormats: ["html", "njk", "md", "11ty.js"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
