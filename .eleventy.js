module.exports = function (eleventyConfig) {
  // Fichiers copiés tels quels dans le site généré.
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  // CNAME : domaine personnalisé GitHub Pages (voir README).
  eleventyConfig.addPassthroughCopy({ "src/CNAME": "CNAME" });

  // Date au format ISO 8601 pour le <lastmod> du sitemap.
  eleventyConfig.addFilter("dateToIso", (d) => new Date(d).toISOString());

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    // Le Markdown des pages est d'abord passé dans Nunjucks (pour la mise en page).
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
