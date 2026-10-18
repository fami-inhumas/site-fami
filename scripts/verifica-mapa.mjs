// Verificação do mapa (placar, item 7): nenhum endereço ou coordenada de
// acolhimento ou atendimento socioeducativo no que é entregue ao navegador.
//
// Varre TODOS os arquivos de out/ (HTML, os .txt com dados do React, CSS, JS)
// em três camadas:
//
//  1. LISTA BRANCA — todo trecho com cara de endereço (Rua, Av., Qd., Lt., CEP...)
//     tem de pertencer a um dos dois endereços autorizados: sede e unidade de Palmas.
//     Qualquer outro endereço = falha, mesmo que ninguém saiba qual é.
//  2. COORDENADAS — nenhum par latitude/longitude decimal, nenhuma palavra
//     latitude/longitude e nenhum link de serviço de mapa.
//  3. LISTA NEGRA LOCAL (opcional) — endereços reais protegidos, num arquivo
//     FORA do repositório (o repositório é público e não pode guardá-los):
//        node scripts/verifica-mapa.mjs --lista "C:\caminho\enderecos-protegidos.txt"
//     Um endereço por linha. Comparação sem acento, sem maiúsculas e sem pontuação.
//
// O QUE NÃO PROMETE: não lê imagem (uma foto de fachada não é texto). Fotos das
// unidades protegidas passam pela revisão editorial do ECA art. 143.

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const RAIZ = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const args = process.argv.slice(2);
const pastaArg = args.indexOf("--pasta");
const SAIDA = pastaArg >= 0 ? args[pastaArg + 1] : join(RAIZ, "out");
const listaArg = args.indexOf("--lista");
const LISTA = listaArg >= 0 ? args[listaArg + 1] : null;

// Os dois únicos endereços autorizados (desenho técnico, seção 1).
const AUTORIZADOS = [
  "Rua da Saudade, Qd. 135, Lt. 19, Centro, Inhumas – GO",
  "204 Sul, Av. NS 4, Centro, Espaço 21, Sala 09, Palmas – TO",
];

const normalizar = (s) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const autorizadosNorm = AUTORIZADOS.map(normalizar);

function listar(pasta) {
  let r = [];
  for (const item of readdirSync(pasta)) {
    const c = join(pasta, item);
    if (statSync(c).isDirectory()) r = r.concat(listar(c));
    else if (/\.(html|txt|json|js|css|xml|svg|webmanifest)$/i.test(item)) r.push(c);
  }
  return r;
}

const PADRAO_ENDERECO =
  /\b(Rua|R\.|Avenida|Av\.|Alameda|Travessa|Rodovia|Quadra|Qd\.|Lote|Lt\.|CEP|Setor)\s+[^<>"\\\n]{1,60}/g;
const PADRAO_COORD = /-?\b\d{1,2}\.\d{4,}\s*,\s*-?\d{1,3}\.\d{4,}\b/g;
const PALAVRAS_MAPA = /\b(latitude|longitude|geo:|google\.[a-z.]+\/maps|maps\.google|openstreetmap|maps\.apple|waze\.com)\b/gi;

const arquivos = listar(SAIDA);
const foraDaListaBranca = [];
const coordenadas = [];
const naListaNegra = [];
let autorizadosEncontrados = 0;

const listaNegra = LISTA
  ? readFileSync(LISTA, "utf8")
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)
  : [];

for (const arq of arquivos) {
  const rel = relative(SAIDA, arq);
  const bruto = readFileSync(arq, "utf8");
  // Texto sem tags HTML, para que "Rua" quebrado por marcação também apareça.
  const texto = bruto.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ");

  for (const m of texto.matchAll(PADRAO_ENDERECO)) {
    const inicio = normalizar(m[0]).split(" ").slice(0, 4).join(" ");
    if (autorizadosNorm.some((a) => a.includes(inicio))) autorizadosEncontrados++;
    else {
      foraDaListaBranca.push({ arquivo: rel, trecho: m[0].slice(0, 70) });
    }
  }
  for (const m of bruto.matchAll(PADRAO_COORD)) coordenadas.push({ arquivo: rel, trecho: m[0] });
  for (const m of bruto.matchAll(PALAVRAS_MAPA)) coordenadas.push({ arquivo: rel, trecho: m[0] });

  if (listaNegra.length) {
    const tn = normalizar(texto);
    for (const proibido of listaNegra) {
      if (tn.includes(normalizar(proibido))) naListaNegra.push({ arquivo: rel, endereco: "(item " + (listaNegra.indexOf(proibido) + 1) + " da lista)" });
    }
  }
}

console.log(`\nVerificação do mapa — ${arquivos.length} arquivos em ${SAIDA}`);
console.log(`0. Trechos de endereço autorizados encontrados (controle positivo): ${autorizadosEncontrados}`);
console.log(`1. Endereços fora da lista branca (sede e Palmas): ${foraDaListaBranca.length}`);
for (const f of foraDaListaBranca) console.log(`     ${f.arquivo}: "${f.trecho}"`);
console.log(`2. Coordenadas ou links de mapa: ${coordenadas.length}`);
for (const c of coordenadas) console.log(`     ${c.arquivo}: "${c.trecho}"`);
if (LISTA) {
  console.log(`3. Endereços protegidos da lista local (${listaNegra.length} itens): ${naListaNegra.length}`);
  for (const n of naListaNegra) console.log(`     ${n.arquivo}: ${n.endereco}`);
} else {
  console.log("3. Lista negra local: NÃO RODADA (passe --lista com o arquivo fora do repositório).");
}

const total = foraDaListaBranca.length + coordenadas.length + naListaNegra.length;
console.log(total === 0 ? "\nResultado: 0 ocorrências.\n" : `\nResultado: ${total} ocorrência(s). FALHOU.\n`);
process.exit(total === 0 ? 0 : 1);
