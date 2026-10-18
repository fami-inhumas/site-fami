// Pós-build do site estático (roda depois do `next build`, inclusive na Vercel).
//
// 1. Retira do HTML todos os scripts do Next.js (o site não precisa de JavaScript
//    na Fase 1; a CSP proíbe scripts). Confere no fim: se sobrar um <script, falha.
// 2. Remove metadados (EXIF, GPS, XMP) de todas as imagens JPEG/PNG/WebP em out/
//    e confere relendo cada arquivo: se sobrar EXIF ou XMP, falha.

import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import sharp from "sharp";

const RAIZ = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const SAIDA = process.argv[2] ?? join(RAIZ, "out");

function listar(pasta, filtro) {
  let r = [];
  for (const item of readdirSync(pasta)) {
    const c = join(pasta, item);
    if (statSync(c).isDirectory()) r = r.concat(listar(c, filtro));
    else if (filtro.test(item)) r.push(c);
  }
  return r;
}

// ---------- 1. Scripts ----------
const htmls = listar(SAIDA, /\.html$/i);
let scriptsRetirados = 0;
let preloadsRetirados = 0;

for (const arq of htmls) {
  let html = readFileSync(arq, "utf8");
  html = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, () => {
    scriptsRetirados++;
    return "";
  });
  html = html.replace(/<link\b[^>]*\bas="script"[^>]*\/?>/gi, () => {
    preloadsRetirados++;
    return "";
  });
  html = html.replace(/<link\b[^>]*\brel="modulepreload"[^>]*\/?>/gi, () => {
    preloadsRetirados++;
    return "";
  });
  writeFileSync(arq, html);
}

const comScript = htmls.filter((a) => /<script\b/i.test(readFileSync(a, "utf8")));
console.log(
  `HTML: ${htmls.length} páginas; ${scriptsRetirados} scripts e ${preloadsRetirados} pré-carregamentos de script retirados.`
);
if (comScript.length > 0) {
  console.error("ERRO: ainda há <script> em:", comScript.map((a) => relative(SAIDA, a)));
  process.exit(1);
}

// ---------- 2. Metadados de imagens ----------
const imagens = listar(SAIDA, /\.(jpe?g|png|webp)$/i);
const comMetadado = [];

for (const arq of imagens) {
  const entrada = readFileSync(arq);
  const img = sharp(entrada); // sem .withMetadata(): o sharp descarta EXIF/GPS/XMP
  const fmt = (await img.metadata()).format;
  let saida;
  if (fmt === "jpeg") saida = await img.jpeg({ quality: 85, mozjpeg: true }).toBuffer();
  else if (fmt === "png") saida = await img.png({ compressionLevel: 9 }).toBuffer();
  else saida = await img.webp({ quality: 85 }).toBuffer();
  writeFileSync(arq, saida);

  const depois = await sharp(saida).metadata();
  if (depois.exif || depois.xmp || depois.iptc) comMetadado.push(relative(SAIDA, arq));
}

console.log(`Imagens: ${imagens.length} processadas; com metadado restante: ${comMetadado.length}.`);
if (comMetadado.length > 0) {
  console.error("ERRO: metadados restantes em:", comMetadado);
  process.exit(1);
}
