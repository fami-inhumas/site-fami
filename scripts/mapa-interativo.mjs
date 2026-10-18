// Placar do mapa interativo: tudo medido com o JavaScript DESLIGADO no navegador.
//   1. Os painéis das cidades começam fechados.
//   2. Clicar no título (summary) abre o painel; clicar de novo fecha.
//   3. Clicar no marcador do desenho leva ao painel daquela cidade e o deixa aberto.
//   4. Teclado: Tab até o marcador + Enter abre o painel da cidade.
//   5. A página não tem nenhum <script>.
// Usa o Edge instalado (channel "msedge"). Uso: node scripts/mapa-interativo.mjs

import { spawn } from "node:child_process";
import { join } from "node:path";
import { chromium } from "playwright";

const RAIZ = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const PORTA = 3014;
const URL_MAPA = `http://localhost:${PORTA}/atuacao/onde-atuamos`;

const servidor = spawn(process.execPath, [join(RAIZ, "scripts", "servidor-local.mjs"), String(PORTA)], { stdio: "ignore" });
await new Promise((ok) => setTimeout(ok, 800));
const navegador = await chromium.launch({ channel: "msedge" });
const falhas = [];
const linhas = [];

try {
  const ctx = await navegador.newContext({ javaScriptEnabled: false, viewport: { width: 1280, height: 900 } });
  const pg = await ctx.newPage();
  await pg.goto(URL_MAPA);

  const jsLigado = await pg.evaluate(() => typeof window !== "undefined").catch(() => null);
  const scripts = await pg.locator("script").count();
  const paineis = pg.locator("details.painel-cidade");
  const marcadores = pg.locator("svg a.mapa-marcador");
  const nPaineis = await paineis.count();
  const nMarcadores = await marcadores.count();
  const abertosNoInicio = await pg.locator("details.painel-cidade[open]").count();

  if (scripts !== 0) falhas.push(`a página tem ${scripts} <script>`);
  if (nPaineis === 0 || nPaineis !== nMarcadores) falhas.push(`painéis (${nPaineis}) e marcadores (${nMarcadores}) não batem`);
  if (abertosNoInicio !== 0) falhas.push(`${abertosNoInicio} painel(is) já abertos no início`);

  for (let i = 0; i < nPaineis; i++) {
    const painel = paineis.nth(i);
    const id = await painel.locator(".painel-corpo").getAttribute("id");
    const nome = (await painel.locator("summary strong").innerText()).trim();

    // 2. summary abre e fecha
    await painel.locator("summary").click();
    const abriuPeloTitulo = await painel.evaluate((d) => d.open);
    await painel.locator("summary").click();
    const fechouPeloTitulo = !(await painel.evaluate((d) => d.open));

    // 3. marcador do desenho
    await pg.goto(URL_MAPA);
    await marcadores.nth(i).click();
    const hash = await pg.evaluate(() => location.hash);
    const abriuPeloMarcador = await pg.locator(`details:has(#${id})`).evaluate((d) => d.open);
    const destacado = await pg.locator(`details:has(#${id})`).evaluate((d) => d.matches(":has(:target)"));

    // 4. teclado: focar o marcador e apertar Enter
    await pg.goto(URL_MAPA);
    await marcadores.nth(i).focus();
    await pg.keyboard.press("Enter");
    const abriuPeloTeclado = await pg.locator(`details:has(#${id})`).evaluate((d) => d.open);

    linhas.push({ cidade: nome, titulo: abriuPeloTitulo && fechouPeloTitulo, marcador: abriuPeloMarcador, alvo: hash === `#${id}` && destacado, teclado: abriuPeloTeclado });
    if (!abriuPeloTitulo || !fechouPeloTitulo) falhas.push(`${nome}: o título não abre/fecha o painel`);
    if (hash !== `#${id}`) falhas.push(`${nome}: o marcador levou a "${hash}"`);
    if (!abriuPeloMarcador) falhas.push(`${nome}: o marcador não abriu o painel`);
    if (!destacado) falhas.push(`${nome}: o painel não ficou destacado (:target)`);
    if (!abriuPeloTeclado) falhas.push(`${nome}: Enter no marcador não abriu o painel`);
    await pg.goto(URL_MAPA);
  }

  console.log(`\nMapa interativo — JavaScript desligado no navegador: ${jsLigado === null ? "sim" : "sim (avaliação do teste não usa scripts da página)"}`);
  console.log(`<script> na página: ${scripts} | painéis: ${nPaineis} | marcadores: ${nMarcadores} | abertos no início: ${abertosNoInicio}`);
  console.table(linhas);
} finally {
  await navegador.close();
  servidor.kill();
}

console.log(`Falhas do mapa: ${falhas.length}`);
for (const f of falhas) console.log("  - " + f);
process.exit(falhas.length ? 1 : 0);
