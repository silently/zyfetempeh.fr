# zyfetempeh.fr

Site vitrine de [**Zyfe**](https://zyfetempeh.fr), généré avec [Eleventy (11ty)](https://www.11ty.dev/) et déployé sur GitHub Pages.

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
│   ├── wave.png         # décoration sous l'onglet actif de la navbar
│   ├── *.jpg / *.png    # images compressées servies au visiteur (générées)
│   ├── raw/             # originaux des images utilisées — non publiés (voir Images)
│   └── lib/             # réserve d'images non utilisées — ni traitées, ni publiées
├── index.md             # Accueil
├── faq.md               # FAQ
├── recettes.md
├── ou-nous-trouver.md
├── sitemap.njk / robots.njk
└── CNAME                 # domaine personnalisé

brand/                    # fichiers sources du logo (jpg, pdf, png haute résolution) — non publiés
```

## Développement local

```sh
npm install
npm run dev     # http://localhost:8080, rechargement automatique
npm run build   # génère le site statique dans _site/
npm run images  # recompresse les images : src/assets/raw/ -> src/assets/ (voir Images)
```

## Images

> **Ajouter ou remplacer une image, en 3 temps :**
> 1. déposer l'original dans **`src/assets/raw/`** (nom de fichier définitif) ;
> 2. lancer **`npm run images`** ;
> 3. la référencer dans les pages en `/assets/<nom>` (ex. `/assets/front4-sm.jpg`).
>
> Ne jamais retoucher les fichiers à la racine de `src/assets/` : ils sont
> **générés** et seront écrasés au prochain `npm run images`.

Trois emplacements, trois rôles :

| Dossier | Contenu | Publié ? |
| --- | --- | --- |
| `src/assets/raw/` | originaux des images utilisées sur le site | non |
| `src/assets/` | versions compressées, même nom de fichier — c'est ce que voit le visiteur | oui |
| `src/assets/lib/` | réserve : images non utilisées, gardées au cas où (ni traitées, ni publiées) | non |

`raw/` et `lib/` restent hors du site parce que `.eleventy.js` ne copie que les
fichiers à la racine d'`assets` (`src/assets/*.*`).

```sh
npm run images                          # (re)génère ce qui a changé : raw/ -> assets/
npm run images:check                    # aperçu des gains, n'écrit rien
npm run images -- --force               # retraite tout (après un changement de qualité)
npm run images -- --prune               # supprime aussi les orphelines d'assets/
npm run images -- --quality 75          # qualité JPEG (défaut : 80)
npm run images -- --max-width 1600      # redimensionne au-delà de cette largeur
```

Le script est incrémental : il ne retraite une image que si son original est
plus récent. Il signale aussi les **orphelines** — un fichier à la racine
d'`assets` sans original dans `raw/`, typiquement après un déplacement vers
`lib/` — et `--prune` les supprime.

**Mettre une image de côté** : déplacer son original de `raw/` vers `lib/`, puis
`npm run images -- --prune` pour retirer la version compressée du site. Pour la
remettre en service, le trajet inverse (`lib/` → `raw/`, puis `npm run images`).

Les deux versions (original et compressée) sont committées : GitHub Pages ne
fait que `npm run build` et ne repasse pas par ce script.

Compression via [sharp](https://sharp.pixelplumbing.com/) : mozjpeg pour les
JPEG, palette + compression maximale pour les PNG. Les SVG ne sont pas touchés.
Gain constaté sur le site : 7,1 Mo d'originaux → 795 Ko servis.

## Modifier le contenu

- **FAQ** : liste `faq` en tête de `src/index.md` (alimente l'accordéon et les données structurées `FAQPage`).
- **Textes** : `src/index.md`, `src/faq.md`, `src/recettes.md`, `src/ou-nous-trouver.md`.
- **Navbar, Instagram, nom, URL** : `src/_data/site.json`.

## SEO

`<title>`/`description` uniques par page, URL canonique, Open Graph + Twitter Card, JSON-LD (`Organization` + `FAQPage`), `sitemap.xml`/`robots.txt` générés, zéro JS.

## Déploiement

Push sur `main` → le workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) build et publie sur GitHub Pages (Settings → Pages → Source : GitHub Actions). Le domaine personnalisé (`zyfetempeh.fr`) est géré via `src/CNAME`.
