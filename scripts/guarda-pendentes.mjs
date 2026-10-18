// Guarda de publicação (pedido da Fase 1):
// qualquer dado marcado como PENDENTE impede o build de produção.
// A pré-visualização pode mostrar o marcador.
//
// O QUE ESTA GUARDA PROMETE
//   - Conta toda chamada pendente("rótulo", "quem decide") em content/, app/,
//     components/ e lib/ (comentários ignorados).
//   - Em produção (VERCEL_ENV=production, SITE_FAMI_AMBIENTE=production ou --producao),
//     se a contagem for maior que zero, o build PARA com a lista.
//   - Em QUALQUER ambiente, uma chamada pendente(...) cujo rótulo não seja texto
//     literal faz o build parar: a guarda não sabe ler variável e não finge que leu.
//
// O QUE ELA NÃO PROMETE
//   - Não confere se um dado "confirmado" está certo: ela pega o que está marcado
//     como pendente, não o que está errado.
//   - Não enxerga dado pendente escrito de outra forma (ex.: texto "a definir").
//     Para isso existe a segunda trava, em components/Pendente.tsx, que derruba
//     a geração da página se um pendente chegar a ser desenhado em produção.

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const RAIZ = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const PASTAS = ["content", "app", "components", "lib"];
const DEFINICAO = join("content", "pendente.ts");

const ambiente =
  process.argv.includes("--producao")
    ? "production"
    : process.env.SITE_FAMI_AMBIENTE ?? process.env.VERCEL_ENV ?? "local";
const ehProducao = ambiente === "production";

function arquivos(pasta) {
  const caminho = join(RAIZ, pasta);
  let saida = [];
  let itens;
  try {
    itens = readdirSync(caminho);
  } catch {
    return saida;
  }
  for (const item of itens) {
    const completo = join(caminho, item);
    if (statSync(completo).isDirectory()) saida = saida.concat(arquivos(join(pasta, item)));
    else if (/\.(ts|tsx)$/.test(item)) saida.push(completo);
  }
  return saida;
}

function semComentarios(texto) {
  return texto.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:"'`])\/\/.*$/gm, "$1");
}

const LITERAL = /pendente\(\s*(["'`])([\s\S]*?)\1\s*,\s*(["'`])([\s\S]*?)\3\s*\)/g;
const QUALQUER = /\bpendente\(/g;

const pendentes = [];
const ilegiveis = [];

for (const pasta of PASTAS) {
  for (const arq of arquivos(pasta)) {
    const rel = relative(RAIZ, arq);
    if (rel === DEFINICAO) continue;
    const texto = semComentarios(readFileSync(arq, "utf8"));

    const literais = [...texto.matchAll(LITERAL)];
    for (const m of literais) {
      const linha = texto.slice(0, m.index).split("\n").length;
      pendentes.push({ arquivo: rel, linha, rotulo: m[2], decide: m[4] });
    }

    const total = [...texto.matchAll(QUALQUER)].length;
    if (total !== literais.length) {
      ilegiveis.push({ arquivo: rel, chamadas: total, legiveis: literais.length });
    }
  }
}

console.log(`\nGuarda de pendentes — ambiente: ${ambiente}`);
console.log(`Pendentes encontrados: ${pendentes.length}\n`);
for (const p of pendentes) {
  console.log(`  - ${p.rotulo}  [confirma: ${p.decide}]  (${p.arquivo}:${p.linha})`);
}

if (ilegiveis.length > 0) {
  console.error("\nERRO: chamadas pendente(...) que a guarda não consegue ler:");
  for (const i of ilegiveis) {
    console.error(`  - ${i.arquivo}: ${i.chamadas} chamadas, ${i.legiveis} legíveis`);
  }
  console.error("Use texto literal entre aspas no rótulo e em quem decide.\n");
  process.exit(1);
}

if (ehProducao && pendentes.length > 0) {
  console.error(
    `\nBUILD DE PRODUÇÃO BLOQUEADO: ${pendentes.length} dado(s) PENDENTE(S).` +
      "\nConfirme cada dado (ou retire-o da página) antes de publicar.\n"
  );
  process.exit(1);
}

console.log(
  ehProducao
    ? "\nProdução liberada: nenhum pendente.\n"
    : "\nPré-visualização: pendentes aparecem com o marcador. Build segue.\n"
);
