// Placar de entrega da Fase 1 — mede, página por página, no site estático (out/):
//   - requisições a terceiros no navegador (alvo: 0)
//   - violações de CSP e erros no console (alvo: 0)
//   - cabeçalho CSP presente em toda resposta
//   - axe: violações WCAG nível A/AA, incluindo 2.1 e 2.2 (alvo: 0)
//
// Usa o Edge já instalado no Windows (channel "msedge"); não baixa navegador.
// Sobe o próprio servidor local (mesmos cabeçalhos do vercel.json) na porta 3011.
// Uso: node scripts/placar.mjs

import { spawn } from "node:child_process";
import { mkdirSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { chromium } from "playwright";
import { AxeBuilder } from "@axe-core/playwright";

const RAIZ = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const SAIDA = join(RAIZ, "out");
const PORTA = 3011;
const BASE = `http://localhost:${PORTA}`;
const TAGS_WCAG = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

function paginas(pasta = SAIDA) {
  let r = [];
  for (const item of readdirSync(pasta)) {
    const c = join(pasta, item);
    if (statSync(c).isDirectory()) {
      if (item !== "_next") r = r.concat(paginas(c));
    } else if (item.endsWith(".html") && !["404.html", "_not-found.html"].includes(item)) {
      const rota = "/" + relative(SAIDA, c).replace(/\\/g, "/").replace(/\.html$/, "");
      r.push(rota === "/index" ? "/" : rota);
    }
  }
  return r.sort();
}

const servidor = spawn(process.execPath, [join(RAIZ, "scripts", "servidor-local.mjs"), String(PORTA)], {
  stdio: "ignore",
});
await new Promise((ok) => setTimeout(ok, 800));

const navegador = await chromium.launch({ channel: "msedge" });
const contexto = await navegador.newContext();
const rotas = paginas();
const resultado = [];

try {
  for (const rota of rotas) {
    const pagina = await contexto.newPage();
    const requisicoes = [];
    const consoleErros = [];
    pagina.on("request", (r) => requisicoes.push(r.url()));
    pagina.on("console", (m) => {
      if (m.type() === "error" || m.type() === "warning") consoleErros.push(m.text());
    });
    pagina.on("pageerror", (e) => consoleErros.push(String(e)));

    const resp = await pagina.goto(BASE + rota, { waitUntil: "networkidle" });
    const csp = resp?.headers()["content-security-policy"] ?? null;

    const axe = await new AxeBuilder({ page: pagina }).withTags(TAGS_WCAG).analyze();

    const terceiros = requisicoes.filter((u) => {
      try {
        return new URL(u).origin !== BASE && !u.startsWith("data:");
      } catch {
        return true;
      }
    });

    resultado.push({
      rota,
      status: resp?.status(),
      cspPresente: Boolean(csp),
      requisicoes: requisicoes.length,
      terceiros,
      consoleErros,
      violacoesCsp: consoleErros.filter((t) => /Content Security Policy/i.test(t)).length,
      axe: axe.violations.map((v) => ({
        id: v.id,
        impacto: v.impact,
        ajuda: v.help,
        nos: v.nodes.length,
        alvos: v.nodes.slice(0, 3).map((n) => n.target.join(" ")),
      })),
      axeAprovados: axe.passes.length,
    });
    await pagina.close();
  }
} finally {
  await navegador.close();
  servidor.kill();
}

mkdirSync(join(RAIZ, "relatorios"), { recursive: true });
writeFileSync(join(RAIZ, "relatorios", "placar.json"), JSON.stringify(resultado, null, 2));

const soma = (f) => resultado.reduce((a, r) => a + f(r), 0);
console.log("\nrota".padEnd(34) + "status  req  3ºs  csp  console  axe");
for (const r of resultado) {
  console.log(
    r.rota.padEnd(33) +
      String(r.status).padEnd(8) +
      String(r.requisicoes).padEnd(5) +
      String(r.terceiros.length).padEnd(5) +
      (r.cspPresente ? "sim  " : "NÃO  ") +
      String(r.consoleErros.length).padEnd(9) +
      r.axe.length
  );
}
console.log(`\nPáginas medidas: ${resultado.length}`);
console.log(`Requisições a terceiros: ${soma((r) => r.terceiros.length)}`);
console.log(`Páginas sem CSP: ${resultado.filter((r) => !r.cspPresente).length}`);
console.log(`Violações de CSP no console: ${soma((r) => r.violacoesCsp)}`);
console.log(`Erros/avisos no console: ${soma((r) => r.consoleErros.length)}`);
console.log(`Violações axe (A/AA): ${soma((r) => r.axe.length)}`);
for (const r of resultado.filter((r) => r.axe.length || r.consoleErros.length)) {
  for (const v of r.axe) console.log(`  [axe] ${r.rota}: ${v.id} (${v.impacto}) — ${v.ajuda} — ${v.alvos.join(" | ")}`);
  for (const e of r.consoleErros) console.log(`  [console] ${r.rota}: ${e.slice(0, 160)}`);
}
console.log("\nDetalhe: relatorios/placar.json\n");

const falhou =
  soma((r) => r.terceiros.length) +
  soma((r) => r.consoleErros.length) +
  soma((r) => r.axe.length) +
  resultado.filter((r) => !r.cspPresente || r.status !== 200).length;
process.exit(falhou > 0 ? 1 : 0);
