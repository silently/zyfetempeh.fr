#!/usr/bin/env node
// Télécharge les polices depuis Google Fonts dans src/assets/fonts/, une fois,
// pour que le site les serve lui-même (aucun appel à Google chez le visiteur).
//
// Usage : npm run fonts
//
// Les URL de Google contiennent un hash de version : elles changent à chaque
// mise à jour de la police. Ce script les redemande à l'API au lieu de les
// figer, donc relancer suffit pour récupérer une version plus récente.
// Après un téléchargement, vérifier les @font-face en tête de src/assets/style.css
// (les unicode-range viennent de la même réponse et sont affichés ci-dessous).
import { writeFile, mkdir } from "node:fs/promises";

const DESTINATION = "src/assets/fonts";

// Sous-ensembles gardés : le français tient entièrement dans « latin ».
// « latin-ext » est une assurance (noms propres étrangers) que le navigateur
// ne télécharge que si la page contient un caractère qui l'exige.
const SOUS_ENSEMBLES = ["latin", "latin-ext"];

// familles telles que demandées à l'API, avec l'axe de graisse du fichier variable
const FAMILLES = [
  { nom: "Inter", requete: "Inter:wght@100..900" },
  { nom: "Arima", requete: "Arima:wght@100..700" },
];

// Sans un User-Agent récent, Google renvoie du TTF au lieu du woff2.
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36";

await mkdir(DESTINATION, { recursive: true });

for (const { nom, requete } of FAMILLES) {
  const url = `https://fonts.googleapis.com/css2?family=${requete}&display=swap`;
  const reponse = await fetch(url, { headers: { "User-Agent": UA } });
  if (!reponse.ok) throw new Error(`${nom} : l'API Google répond ${reponse.status}`);
  const css = await reponse.text();

  // La réponse annonce chaque sous-ensemble en commentaire avant son @font-face.
  const blocs = css.split("/*").slice(1);
  for (const sousEnsemble of SOUS_ENSEMBLES) {
    const bloc = blocs.find((b) => b.startsWith(` ${sousEnsemble} `));
    if (!bloc) throw new Error(`${nom} : sous-ensemble « ${sousEnsemble} » absent de la réponse`);

    const woff2 = bloc.match(/url\((https:[^)]+\.woff2)\)/)?.[1];
    const plage = bloc.match(/unicode-range: ([^;]+);/)?.[1];
    if (!woff2) throw new Error(`${nom}/${sousEnsemble} : pas d'URL woff2 (User-Agent trop ancien ?)`);

    const fichier = `${DESTINATION}/${nom.toLowerCase()}-${sousEnsemble}.woff2`;
    const police = Buffer.from(await (await fetch(woff2, { headers: { "User-Agent": UA } })).arrayBuffer());
    await writeFile(fichier, police);

    console.log(`${fichier} — ${(police.length / 1024).toFixed(0)} Ko`);
    console.log(`  unicode-range: ${plage};`);
  }
}

console.log("\nVérifier que les unicode-range ci-dessus correspondent à ceux de src/assets/style.css.");
