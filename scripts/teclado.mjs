// Teste de teclado em todas as páginas (parte automatizável do checklist manual).
// Com teclas de verdade (Playwright + Edge instalado), página por página:
//   1. O primeiro Tab foca "Pular para o conteúdo"; Enter leva o foco ao <main>.
//   2. Tab percorre todos os elementos focáveis sem armadilha (volta ao início).
//   3. Todo elemento focado tem contorno visível com contraste >= 3:1 contra o
//      fundo real em volta (WCAG 2.4.7, 2.4.11 e 1.4.11).
//   4. Celular (375 px): o botão "Menu" abre pelo teclado e o Tab seguinte cai
//      no primeiro link do menu.
// Uso: node scripts/teclado.mjs   (precisa do build em out/)

import { spawn } from "node:child_process";
import { readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { chromium } from "playwright";

const RAIZ = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const SAIDA = join(RAIZ, "out");
const PORTA = 3012;
const BASE = `http://localhost:${PORTA}`;

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

// Roda dentro da página: descreve o elemento focado e mede o contraste do contorno.
function descreverFoco() {
  const el = document.activeElement;
  if (!el || el === document.body) return { corpo: true };
  const lum = (rgb) => {
    const [r, g, b] = rgb.match(/\d+(\.\d+)?/g).slice(0, 3).map(Number).map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const transparente = (c) => c === "transparent" || /rgba\(.*,\s*0\)$/.test(c);
  // Fundo em volta do contorno: o do PAI do elemento (o contorno fica fora dele).
  let p = el.parentElement;
  let fundo = "rgb(246, 239, 228)";
  while (p) {
    const bg = getComputedStyle(p).backgroundColor;
    if (!transparente(bg)) {
      fundo = bg;
      break;
    }
    p = p.parentElement;
  }
  const cs = getComputedStyle(el);
  const a = lum(cs.outlineColor);
  const b = lum(fundo);
  const contraste = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  return {
    texto: (el.textContent || el.getAttribute("aria-label") || el.tagName).trim().replace(/\s+/g, " ").slice(0, 40),
    id: el.id,
    focoVisivel: el.matches(":focus-visible"),
    contorno: cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) >= 2,
    contraste: Math.round(contraste * 100) / 100,
    chave: el.outerHTML.slice(0, 120),
  };
}

const servidor = spawn(process.execPath, [join(RAIZ, "scripts", "servidor-local.mjs"), String(PORTA)], { stdio: "ignore" });
await new Promise((ok) => setTimeout(ok, 800));
const navegador = await chromium.launch({ channel: "msedge" });

const falhas = [];
const resumo = [];

try {
  const ctx = await navegador.newContext({ viewport: { width: 1280, height: 900 } });
  for (const rota of paginas()) {
    const pg = await ctx.newPage();
    await pg.goto(BASE + rota);

    // 1. Pular para o conteúdo
    await pg.keyboard.press("Tab");
    const primeiro = await pg.evaluate(descreverFoco);
    if (primeiro.texto !== "Pular para o conteúdo") falhas.push(`${rota}: primeiro Tab foi "${primeiro.texto}"`);
    await pg.keyboard.press("Enter");
    const aposEnter = await pg.evaluate(() => document.activeElement?.id);
    if (aposEnter !== "conteudo") falhas.push(`${rota}: Enter no "Pular" não levou ao conteúdo (${aposEnter})`);

    // 2 e 3. Percorrer tudo
    await pg.goto(BASE + rota);
    const vistos = [];
    let voltou = false;
    for (let i = 0; i < 200; i++) {
      await pg.keyboard.press("Tab");
      const f = await pg.evaluate(descreverFoco);
      if (f.corpo || (vistos.length > 0 && f.chave === vistos[0].chave)) {
        voltou = true;
        break;
      }
      vistos.push(f);
      if (!f.focoVisivel || !f.contorno) falhas.push(`${rota}: sem contorno visível em "${f.texto}"`);
      else if (f.contraste < 3) falhas.push(`${rota}: contorno com contraste ${f.contraste}:1 em "${f.texto}"`);
    }
    if (!voltou) falhas.push(`${rota}: o Tab não voltou ao início em 200 passos (possível armadilha)`);
    const menor = Math.min(...vistos.map((v) => v.contraste));
    resumo.push({ rota, focaveis: vistos.length, menorContraste: menor });
    await pg.close();
  }

  // 4. Menu do celular
  const cel = await navegador.newContext({ viewport: { width: 375, height: 812 } });
  const pg = await cel.newPage();
  await pg.goto(BASE + "/");
  let achouMenu = false;
  for (let i = 0; i < 10; i++) {
    await pg.keyboard.press("Tab");
    const t = await pg.evaluate(() => document.activeElement?.tagName);
    if (t === "SUMMARY") {
      achouMenu = true;
      break;
    }
  }
  await pg.keyboard.press("Enter");
  const aberto = await pg.evaluate(() => document.querySelector("details.menu-celular")?.open);
  await pg.keyboard.press("Tab");
  const depois = await pg.evaluate(descreverFoco);
  const larguraOk = await pg.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
  if (!achouMenu) falhas.push("celular: o botão Menu não recebeu foco");
  if (!aberto) falhas.push("celular: Enter no Menu não abriu");
  if (depois.texto !== "Instituto") falhas.push(`celular: depois de abrir, o Tab foi para "${depois.texto}"`);
  if (!larguraOk) falhas.push("celular: a página rola na horizontal a 375 px");
  resumo.push({ rota: "celular 375px", menuAbre: Boolean(aberto), primeiroItem: depois.texto, semRolagemHorizontal: larguraOk });
} finally {
  await navegador.close();
  servidor.kill();
}

console.table(resumo);
console.log(`\nFalhas de teclado: ${falhas.length}`);
for (const f of falhas) console.log("  - " + f);
process.exit(falhas.length ? 1 : 0);
