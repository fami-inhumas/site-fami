// Varredura estática de terceiros (complementa a medição no navegador do placar):
// procura em out/ qualquer recurso que o navegador CARREGARIA de outra origem —
// src=, srcset=, url(...), @import, <link href> de folha de estilo, fonte, ícone
// ou pré-carregamento, e <script>/<iframe>/<embed>/<object>.
// Links de navegação comuns (<a href="https://...">) não são requisição e ficam de
// fora; o atributo xmlns do SVG também (é um nome, não um endereço carregado).

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const RAIZ = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const args = process.argv.slice(2);
const pastaArg = args.indexOf("--pasta");
const SAIDA = pastaArg >= 0 ? args[pastaArg + 1] : join(RAIZ, "out");

function listar(pasta) {
  let r = [];
  for (const item of readdirSync(pasta)) {
    const c = join(pasta, item);
    if (statSync(c).isDirectory()) r = r.concat(listar(c));
    else if (/\.(html|css|txt|svg|webmanifest|json)$/i.test(item)) r.push(c);
  }
  return r;
}

const EXTERNO = String.raw`(?:https?:)?\/\/[^"'\s)>]+`;
const PADROES = [
  new RegExp(String.raw`\bsrc\s*=\s*["']?(${EXTERNO})`, "gi"),
  new RegExp(String.raw`\bsrcset\s*=\s*["'][^"']*?(${EXTERNO})`, "gi"),
  new RegExp(String.raw`url\(\s*["']?(${EXTERNO})`, "gi"),
  new RegExp(String.raw`@import\s+(?:url\()?["']?(${EXTERNO})`, "gi"),
  new RegExp(
    String.raw`<link\b(?=[^>]*\brel=["']?(?:stylesheet|preload|prefetch|preconnect|dns-prefetch|icon|apple-touch-icon|manifest|modulepreload))[^>]*\bhref=["']?(${EXTERNO})`,
    "gi"
  ),
  new RegExp(String.raw`<(?:iframe|embed|object)\b[^>]*(?:src|data)=["']?(${EXTERNO})`, "gi"),
];

const achados = [];
const arquivos = listar(SAIDA);
for (const arq of arquivos) {
  const texto = readFileSync(arq, "utf8");
  for (const p of PADROES) {
    for (const m of texto.matchAll(p)) achados.push({ arquivo: relative(SAIDA, arq), url: m[1] });
  }
}

console.log(`\nVarredura de terceiros — ${arquivos.length} arquivos em ${SAIDA}`);
console.log(`Recursos de outra origem: ${achados.length}`);
for (const a of achados) console.log(`  ${a.arquivo}: ${a.url}`);
process.exit(achados.length === 0 ? 0 : 1);
