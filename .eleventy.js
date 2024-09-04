const rimraf = require("rimraf");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");

module.exports = function(eleventyConfig) {
  // delete contents of public to ensure removed files are removed from the final build
  rimraf.windows.sync("public/");

  // Pass-through copy directives
  eleventyConfig.addPassthroughCopy("./src/css");
  eleventyConfig.addPassthroughCopy("./src/img");
  eleventyConfig.addPassthroughCopy("./src/fonts");
  eleventyConfig.addPassthroughCopy("./src/js");

  // Exclude drafts from builds unless in watch/serve mode
  eleventyConfig.addGlobalData("eleventyComputed.permalink", function() {
    return (data) => {
      if (data.draft && !process.env.BUILD_DRAFTS) {
        return false;
      }
      return data.permalink;
    };
  });

  eleventyConfig.addGlobalData("eleventyComputed.eleventyExcludeFromCollections", function() {
    return (data) => {
      if (data.draft && !process.env.BUILD_DRAFTS) {
        return true;
      }
      return data.eleventyExcludeFromCollections;
    };
  });

  eleventyConfig.on("eleventy.before", ({ runMode }) => {
    if (runMode === "serve" || runMode === "watch") {
      process.env.BUILD_DRAFTS = true;
    }
  });

  // Add Eleventy Navigation plugin
  if (eleventyNavigationPlugin) {
    try {
      eleventyConfig.addPlugin(eleventyNavigationPlugin);
      console.log("Eleventy Navigation plugin added successfully.");
    } catch (error) {
      console.error("Error adding Eleventy Navigation plugin:", error);
    }
  } else {
    console.error("Failed to load Eleventy Navigation plugin.");
  }

  // Eleventy configuration object
  return {
    passthroughFileCopy: true,
    dir: {
      input: "src",
      output: "public",
      includes: "_includes",
      data: "_data"
    }
  };
};

