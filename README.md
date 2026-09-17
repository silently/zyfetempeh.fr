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
│   ├── fonts/           # Inter + Arima en woff2, servies par le site (voir Polices)
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
npm run fonts   # retélécharge les polices depuis Google Fonts (rare, voir Polices)
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

## Polices

Arima (titres) et Inter (tout le reste) sont **servies par le site**, pas
chargées chez Google : le visiteur ne fait aucune requête vers un tiers, et son
IP n'est transmise à personne. Les `@font-face` sont en tête de
`src/assets/style.css`, les fichiers dans `src/assets/fonts/`.

Deux fichiers par police, tous deux **variables** (un seul fichier couvre
toutes les graisses) :

| Fichier | Poids | Quand il est téléchargé |
| --- | --- | --- |
| `inter-latin.woff2` | 47 Ko | toujours (préchargé) |
| `arima-latin.woff2` | 30 Ko | toujours (préchargé) |
| `inter-latin-ext.woff2` | 83 Ko | seulement si la page contient un caractère hors latin de base |
| `arima-latin-ext.woff2` | 22 Ko | idem |

Le français tient entièrement dans le sous-ensemble `latin` : en pratique les
`latin-ext` ne partent jamais, ils sont là pour un nom propre étranger. Les deux
polices du premier écran sont préchargées depuis `base.njk`, sinon le navigateur
ne les découvre qu'après avoir lu le CSS.

Pour récupérer une version plus récente :

```sh
npm run fonts   # retélécharge les 4 woff2 et affiche les unicode-range à vérifier
```

Les URL de Google portent un hash de version, donc le script les redemande à
l'API plutôt que de les figer. Il affiche les `unicode-range` reçus : s'ils
diffèrent de ceux de `style.css`, reporter les nouveaux.

Changer de police : ajouter la famille dans `FAMILLES`
(`scripts/fetch-fonts.mjs`), lancer `npm run fonts`, puis ajouter les
`@font-face` et le `--font-body` / `--font-display` correspondants dans
`style.css`.

Les deux polices sont sous SIL Open Font License 1.1 ; les licences sont
redistribuées avec les fichiers (`src/assets/fonts/*-OFL.txt`), comme l'exige
la licence.

## Modifier le contenu

- **FAQ** : liste `faq` en tête de `src/index.md` (alimente l'accordéon et les données structurées `FAQPage`).
- **Textes** : `src/index.md`, `src/faq.md`, `src/recettes.md`, `src/ou-nous-trouver.md`.
- **Navbar, Instagram, nom, URL** : `src/_data/site.json`.

## SEO

`<title>`/`description` uniques par page, URL canonique, Open Graph + Twitter Card, JSON-LD (`Organization` + `FAQPage`), `sitemap.xml`/`robots.txt` générés, zéro JS.

## Déploiement

Push sur `main` → le workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) build et publie sur GitHub Pages (Settings → Pages → Source : GitHub Actions). Le domaine personnalisé (`zyfetempeh.fr`) est géré via `src/CNAME`.
