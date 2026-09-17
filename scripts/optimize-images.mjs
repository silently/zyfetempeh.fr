#!/usr/bin/env node
// Génère les images du site (src/assets) à partir des originaux (src/assets/raw).
// Les originaux ne sont jamais modifiés ; seul src/assets est publié (voir .eleventy.js).
// src/assets/lib/ (réserve d'images non utilisées) est ignoré de bout en bout.
//
// Usage :
//   npm run images                 -> traite ce qui a changé
//   npm run images:check           -> aperçu, n'écrit rien
//   npm run images -- --force      -> retraite tout
//   npm run images -- --prune      -> supprime aussi les orphelins d'assets/
//   npm run images -- --quality 75 --max-width 1600
import { readdir, stat, readFile, writeFile, mkdir, unlink } from "node:fs/promises";
import { join, extname, relative, dirname } from "node:path";
import sharp from "sharp";

const SOURCE = "src/assets/raw";
const DESTINATION = "src/assets";
const EXT = new Set([".jpg", ".jpeg", ".png"]);

const args = process.argv.slice(2);
const flag = (nom) => args.includes(`--${nom}`);
const option = (nom, defaut) => {
  const i = args.indexOf(`--${nom}`);
  return i !== -1 && args[i + 1] ? Number(args[i + 1]) : defaut;
};

const dryRun = flag("dry-run");
const prune = flag("prune");
const force = flag("force");
const quality = option("quality", 80);
const maxWidth = option("max-width", 0); // 0 = pas de redimensionnement

async function lister(dir) {
  const out = [];
  for (const entree of await readdir(dir, { withFileTypes: true })) {
    const chemin = join(dir, entree.name);
    if (entree.isDirectory()) out.push(...(await lister(chemin)));
    else if (EXT.has(extname(entree.name).toLowerCase())) out.push(chemin);
  }
  return out;
}

async function aJour(source, destination) {
  try {
    const [s, d] = await Promise.all([stat(source), stat(destination)]);
    return d.mtimeMs >= s.mtimeMs;
  } catch {
    return false; // destination absente
  }
}

const ko = (n) => `${(n / 1024).toFixed(0)} Ko`;

let avant = 0;
let apres = 0;
let traites = 0;
let ignores = 0;

for (const source of (await lister(SOURCE)).sort()) {
  const destination = join(DESTINATION, relative(SOURCE, source));
  const nom = relative(process.cwd(), destination);

  if (!force && (await aJour(source, destination))) {
    avant += (await stat(source)).size;
    apres += (await stat(destination)).size;
    ignores++;
    continue;
  }

  const original = await readFile(source);
  const png = extname(source).toLowerCase() === ".png";

  let pipeline = sharp(original).rotate(); // rotate() applique l'orientation EXIF
  if (maxWidth) {
    const { width } = await sharp(original).metadata();
    if (width > maxWidth) pipeline = pipeline.resize({ width: maxWidth });
  }
  pipeline = png
    ? pipeline.png({ compressionLevel: 9, effort: 10, palette: true })
    : pipeline.jpeg({ quality, progressive: true, mozjpeg: true });

  // Si la compression fait grossir le fichier, on recopie l'original tel quel.
  const optimise = await pipeline.toBuffer();
  const sortie = optimise.length < original.length ? optimise : original;

  avant += original.length;
  apres += sortie.length;
  traites++;

  const pourcent = (((original.length - sortie.length) / original.length) * 100).toFixed(0);
  console.log(
    `  ${dryRun ? " ?" : "->"} ${nom} — ${ko(original.length)} -> ${ko(sortie.length)} (-${pourcent} %)`,
  );

  if (!dryRun) {
    await mkdir(dirname(destination), { recursive: true });
    await writeFile(destination, sortie);
  }
}

// Orphelins : images d'assets/ dont l'original n'est plus dans raw/
// (typiquement déplacé dans lib/ parce qu'elles ne servent plus).
const attendues = new Set(
  (await lister(SOURCE)).map((f) => join(DESTINATION, relative(SOURCE, f))),
);
const orphelins = (await lister(DESTINATION))
  .filter((f) => !f.startsWith(join(DESTINATION, "raw") + "/"))
  .filter((f) => !f.startsWith(join(DESTINATION, "lib") + "/"))
  .filter((f) => !attendues.has(f));

for (const orphelin of orphelins.sort()) {
  const nom = relative(process.cwd(), orphelin);
  if (prune && !dryRun) {
    await unlink(orphelin);
    console.log(`  x  ${nom} — supprimée (plus d'original dans ${SOURCE}/)`);
  } else {
    console.log(`  !  ${nom} — orpheline (plus d'original dans ${SOURCE}/) — --prune pour supprimer`);
  }
}

if (!traites && !ignores) {
  console.log(`Aucune image dans ${SOURCE}/.`);
} else {
  console.log(
    `\n${traites} image(s) ${dryRun ? "à traiter" : "générée(s)"}` +
      (ignores ? `, ${ignores} déjà à jour` : "") +
      ` — ${ko(avant)} -> ${ko(apres)} (-${(((avant - apres) / avant) * 100).toFixed(0)} %)`,
  );
  if (dryRun) console.log(`Aperçu seulement — relancer sans --dry-run pour écrire dans ${DESTINATION}/.`);
}
