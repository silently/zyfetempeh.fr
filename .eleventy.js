module.exports = function (eleventyConfig) {
  // Fichiers copiés tels quels dans le site généré.
  // Le glob ne prend que les fichiers à la racine d'assets : src/assets/raw/
  // (originaux des images) reste donc hors du site publié.
  eleventyConfig.addPassthroughCopy({ "src/assets/*.*": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/assets/fonts": "assets/fonts" });
  // CNAME : domaine personnalisé GitHub Pages (voir README).
  eleventyConfig.addPassthroughCopy({ "src/CNAME": "CNAME" });

  // Date au format ISO 8601 pour le <lastmod> du sitemap.
  eleventyConfig.addFilter("dateToIso", (d) => new Date(d).toISOString());

  // Année courante, pour le © du pied de page.
  eleventyConfig.addShortcode("annee", () => String(new Date().getFullYear()));

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
