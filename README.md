# zyfetempeh.fr

Site vitrine de **Zyfe**, généré avec [Eleventy (11ty)](https://www.11ty.dev/) et déployé sur GitHub Pages.

Design minimal, mobile-first, sans framework CSS ni JavaScript.

## Structure

```
src/
├── _data/site.json      # nom, URL, Instagram, entrées de navbar
├── _includes/base.njk   # <head> SEO, en-tête, navbar, pied de page
├── assets/
│   ├── style.css
│   ├── logo.svg / favicon.svg
│   ├── og-image.png     # image de partage social 1200×630
│   └── wave.png         # décoration sous l'onglet actif de la navbar
├── index.md              # page Tempeh + FAQ
├── recettes.md
├── a-propos.md
├── sitemap.njk / robots.njk
└── CNAME                 # domaine personnalisé

brand/                    # fichiers sources du logo (jpg, pdf, png haute résolution) — non publiés
```

## Développement local

```sh
npm install
npm run dev     # http://localhost:8080, rechargement automatique
npm run build   # génère le site statique dans _site/
```

## Modifier le contenu

- **FAQ** : liste `faq` en tête de `src/index.md` (alimente l'accordéon et les données structurées `FAQPage`).
- **Textes** : `src/index.md`, `src/recettes.md`, `src/a-propos.md`.
- **Navbar, Instagram, nom, URL** : `src/_data/site.json`.

## SEO

`<title>`/`description` uniques par page, URL canonique, Open Graph + Twitter Card, JSON-LD (`Organization` + `FAQPage`), `sitemap.xml`/`robots.txt` générés, zéro JS.

## Déploiement

Push sur `main` → le workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) build et publie sur GitHub Pages (Settings → Pages → Source : GitHub Actions). Le domaine personnalisé (`zyfetempeh.fr`) est géré via `src/CNAME`.
