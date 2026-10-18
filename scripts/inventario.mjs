// Inventário do site atual (fami.org.br) — SÓ LEITURA.
//
// Fontes: sitemap do WordPress, API pública do WordPress (páginas, notícias,
// mídia, categorias, tags) e os links internos encontrados no HTML de cada
// página e notícia.
//
// O QUE NÃO FAZ: não baixa PDF nem imagem. Para mídia, guarda só o endereço e o
// título informados pela própria API. O HTML das páginas é lido para achar links
// e descartado; nada é gravado além do CSV.
//
// Saída: docs/inventario-site-antigo.csv (separador ";" e BOM, para abrir direto
// no Excel em português) e o total por tipo na tela.
// Uso: node scripts/inventario.mjs

import { createHash } from "node:crypto";
import { writeFileSync } from "node:fs";
import { join } from "node:path";

const RAIZ = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const SITE = "https://fami.org.br";
const UA = "site-fami-inventario/1.0 (somente leitura; FAMI)";
const pausa = (ms) => new Promise((ok) => setTimeout(ok, ms));

async function obter(url, comoJson = true) {
  for (let tentativa = 1; tentativa <= 3; tentativa++) {
    try {
      const r = await fetch(url, { headers: { "User-Agent": UA }, redirect: "follow" });
      if (!r.ok) return { ok: false, status: r.status, headers: r.headers };
      return { ok: true, status: r.status, headers: r.headers, corpo: comoJson ? await r.json() : await r.text() };
    } catch (e) {
      if (tentativa === 3) return { ok: false, status: 0, erro: String(e) };
      await pausa(1000 * tentativa);
    }
  }
}

async function apiTudo(tipo, campos) {
  const itens = [];
  for (let pagina = 1; pagina < 100; pagina++) {
    const r = await obter(`${SITE}/wp-json/wp/v2/${tipo}?per_page=100&page=${pagina}&_fields=${campos}`);
    if (!r.ok) break;
    itens.push(...r.corpo);
    const total = Number(r.headers.get("x-wp-totalpages") ?? 1);
    if (pagina >= total) break;
    await pausa(300);
  }
  return itens;
}

const textoPuro = (html = "") =>
  html
    .replace(/<[^>]+>/g, "")
    .replace(/&#8211;|&#8212;/g, "–")
    .replace(/&#8217;|&#8216;/g, "'")
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/\s+/g, " ")
    .trim();

const semAcento = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

// ---------------- Sinalizações pedidas ----------------
function sinalizar(item) {
  const alvo = semAcento(`${item.titulo} ${item.url}`);
  const s = [];
  if (/revoga|revogad|anulad|anulacao|cancelad|cancelament|sem efeito|suspens/.test(alvo))
    s.push("EDITAL REVOGADO/ANULADO? conferir; não migrar se revogado");
  else if (/edital|processo seletivo|chamamento|selecao/.test(alvo)) s.push("edital: conferir situação antes de migrar");
  if (
    item.tipo === "PDF" &&
    /convoca|resultado|classifica|aprovad|selecionad|homologa|lista|gabarito|nomea|inscrit|deferid|indeferid|ganhador|contemplad/.test(alvo)
  )
    s.push("PDF DE CONVOCAÇÃO/RESULTADO: pode ter NOMES; não migrar sem versão minimizada");
  if (/caser|socioeducat|semiliberdade|internacao|medida socio|adolescente/.test(alvo))
    s.push("CASER/SOCIOEDUCAÇÃO: revisão ECA art. 143 antes de migrar");
  if (/acolhid|acolhimento|abrigo|casa lar|casa da acolhida/.test(alvo))
    s.push("ACOLHIMENTO: revisão ECA art. 143 antes de migrar");
  if (item.tipo === "imagem") s.push("imagem: conferir rosto/autorização de uso antes de migrar");
  if (/\.(xlsx?|ods|csv)($|\?)/i.test(item.url)) s.push("PLANILHA: pode ter dados pessoais; abrir e conferir antes de migrar");
  if (/\.(mp4|mov|avi|wmv|webm|m4v)($|\?)/i.test(item.url)) s.push("VÍDEO: conferir rosto/autorização (ECA art. 143 se houver adolescente)");
  if (/casino|cassino|viagra|cialis|loan|emprestimo rapido|crypto|bitcoin|slot|bet\b|apostas|porn|essay|replica|[Ѐ-ӿ一-鿿]/i.test(`${item.titulo} ${item.url}`))
    s.push("POSSÍVEL SPAM DO INCIDENTE: não migrar; guardar como evidência");
  if (/cneas/.test(alvo)) s.push("CNEAS: relatório NÃO vai ao site (traz endereço do acolhimento)");
  if (/alvara/.test(alvo)) s.push("ALVARÁ: NÃO vai ao site (dados do representante legal)");
  return s.join(" | ");
}

// ---------------- Destino proposto ----------------
const REGRAS_DESTINO = [
  [/quem somos|sobre|institucional|missao|a fami\b/, "/instituto/quem-somos"],
  [/historia|historico/, "/instituto/historia"],
  [/estatuto/, "/instituto/estatuto"],
  [/certifica|utilidade publica|cebas|cmas|cmdca|titulo/, "/instituto/certificados"],
  [/transparencia|prestacao|balanco|demonstra|relatorio de atividade|convenio|termo de colaboracao|termo de fomento|parceria|contrato de gestao|plano de trabalho|dirigente/, "/transparencia"],
  [/aprendiz|jovem/, "/jovem-aprendiz"],
  [/ouvidoria|denuncia/, "/ouvidoria"],
  [/doe|doac|contribu/, "/doe"],
  [/vaga|edital|processo seletivo|selecao|trabalhe|curriculo|convoca|resultado/, "/vagas"],
  [/privacidade|lgpd|cookie/, "/privacidade"],
  [/acessibilidade/, "/acessibilidade"],
  [/onde|unidade|endereco|localiza/, "/atuacao/onde-atuamos"],
  [/caminhar|fami service|caser|acolhida|programa|projeto/, "/atuacao/programas-em-acao"],
  [/contato|fale conosco/, "rodapé (contato) — sem página própria"],
  [/noticia|blog/, "/noticias"],
];

function destino(item) {
  if (item.sinalizacao.includes("SPAM")) return "não migrar (evidência do incidente)";
  if (item.sinalizacao.includes("CNEAS") || item.sinalizacao.includes("ALVARÁ")) return "não migrar (documento interno)";
  if (item.subtipo === "início") return "/";
  if (item.subtipo === "arquivo do tema") return "não migrar (peça interna do tema WordPress)";
  if (item.subtipo === "categoria" || item.subtipo === "tag") return "/noticias (301) — sem arquivo por categoria";
  if (item.tipo === "imagem") return "não migrar automaticamente — revisar uma a uma";
  const alvo = semAcento(`${item.titulo} ${item.url}`);
  for (const [re, d] of REGRAS_DESTINO) if (re.test(alvo)) return d;
  if (item.subtipo === "notícia") return "/noticias (após revisão)";
  return "DECIDIR";
}

// ---------------- Coleta ----------------
const linhas = new Map(); // url -> item
function adicionar(item) {
  const url = item.url.replace(/#.*$/, "");
  if (linhas.has(url)) {
    const atual = linhas.get(url);
    if (!atual.origem.includes(item.origem)) atual.origem += `+${item.origem}`;
    return;
  }
  linhas.set(url, { ...item, url });
}

const tipoPorArquivo = (url, mime = "") => {
  if (/pdf/i.test(mime) || /\.pdf($|\?)/i.test(url)) return "PDF";
  if (/^image\//i.test(mime) || /\.(jpe?g|png|gif|webp|svg|bmp|tiff?)($|\?)/i.test(url)) return "imagem";
  return "outro";
};

console.log("Lendo a API do WordPress...");
const [paginas, posts, midia, categorias, tags] = await Promise.all([
  apiTudo("pages", "link,title,date,modified,slug"),
  apiTudo("posts", "link,title,date,modified,slug"),
  apiTudo("media", "source_url,title,date,mime_type,media_type,slug"),
  apiTudo("categories", "link,name,count"),
  apiTudo("tags", "link,name,count"),
]);

adicionar({ url: `${SITE}/`, tipo: "página", subtipo: "início", titulo: "Página inicial", data: "", origem: "site" });
for (const p of paginas)
  adicionar({ url: p.link, tipo: "página", subtipo: "página", titulo: textoPuro(p.title?.rendered), data: p.date?.slice(0, 10), origem: "api" });
for (const p of posts)
  adicionar({ url: p.link, tipo: "página", subtipo: "notícia", titulo: textoPuro(p.title?.rendered), data: p.date?.slice(0, 10), origem: "api" });
for (const m of midia)
  adicionar({ url: m.source_url, tipo: tipoPorArquivo(m.source_url, m.mime_type), subtipo: m.mime_type ?? "", titulo: textoPuro(m.title?.rendered), data: m.date?.slice(0, 10), origem: "api" });
for (const c of categorias)
  adicionar({ url: c.link, tipo: "página", subtipo: "categoria", titulo: `Categoria: ${textoPuro(c.name)} (${c.count} itens)`, data: "", origem: "api" });
for (const t of tags)
  adicionar({ url: t.link, tipo: "página", subtipo: "tag", titulo: `Tag: ${textoPuro(t.name)} (${t.count} itens)`, data: "", origem: "api" });

console.log("Lendo o sitemap...");
const indice = await obter(`${SITE}/wp-sitemap.xml`, false);
const subSitemaps = indice.ok ? [...indice.corpo.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]) : [];
let usuariosNoSitemap = 0;
for (const sm of subSitemaps) {
  const r = await obter(sm, false);
  if (!r.ok) continue;
  const locs = [...r.corpo.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  if (/users/.test(sm)) {
    usuariosNoSitemap = locs.length; // NÃO entram no CSV (nomes de usuário do WordPress)
    continue;
  }
  const subtipo = /wpr_/.test(sm) ? "arquivo do tema" : /category/.test(sm) ? "categoria" : /page/.test(sm) ? "página" : "notícia";
  for (const loc of locs) adicionar({ url: loc, tipo: "página", subtipo, titulo: "", data: "", origem: "sitemap" });
  await pausa(200);
}

console.log("Lendo links internos de cada página e notícia (sem baixar arquivos)...");
const paraLer = [...linhas.values()].filter((i) => i.tipo === "página" && !["categoria", "tag", "arquivo do tema"].includes(i.subtipo));
let lidas = 0;
const quebrados = [];
for (const item of paraLer) {
  const r = await obter(item.url, false);
  lidas++;
  if (!r.ok) {
    item.status = r.status;
    continue;
  }
  item.status = r.status;
  if (!item.titulo) {
    const t = r.corpo.match(/<title>([^<]*)<\/title>/i);
    if (t) item.titulo = textoPuro(t[1]).replace(/\s*[–|-]\s*FAMI.*$/i, "");
  }
  for (const m of r.corpo.matchAll(/(?:href|src)=["'](https?:\/\/(?:www\.)?fami\.org\.br\/[^"'#\s]+)["']/gi)) {
    const u = m[1];
    if (/\/wp-(?:includes|json|admin)\/|\/feed\/?$|xmlrpc|\?p=|\/comments\/|\.(?:css|js|woff2?|ttf)(?:\?|$)/i.test(u)) continue;
    if (/\/wp-content\/(?:themes|plugins|cache)\//i.test(u)) continue;
    const tipo = tipoPorArquivo(u);
    const nomeArquivo = decodeURIComponent(u.split("/").pop().split("?")[0]);
    if (tipo === "página" || tipo === "outro") {
      if (/\/wp-content\/uploads\//i.test(u)) adicionar({ url: u, tipo: "outro", subtipo: "arquivo", titulo: nomeArquivo, data: "", origem: "link" });
      else adicionar({ url: u, tipo: "página", subtipo: "link interno", titulo: "", data: "", origem: "link" });
    } else {
      adicionar({ url: u, tipo, subtipo: "linkado no conteúdo", titulo: nomeArquivo, data: "", origem: "link" });
    }
  }
  if (lidas % 20 === 0) console.log(`  ${lidas}/${paraLer.length}`);
  await pausa(250);
}

// Links internos de página achados só no HTML: conferir se existem (só cabeçalho, sem corpo).
for (const item of [...linhas.values()].filter((i) => i.subtipo === "link interno" && i.status === undefined)) {
  try {
    const r = await fetch(item.url, { method: "HEAD", headers: { "User-Agent": UA }, redirect: "follow" });
    item.status = r.status;
  } catch {
    item.status = 0;
  }
  await pausa(150);
}

// ---------------- Saída ----------------
const itens = [...linhas.values()];
for (const i of itens) {
  if (!i.titulo) i.titulo = decodeURIComponent(i.url.replace(SITE, "").replace(/\/$/, "").split("/").pop() || "/");
  i.sinalizacao = sinalizar(i);
  if (i.status && i.status >= 400) {
    i.sinalizacao = [`LINK QUEBRADO (${i.status})`, i.sinalizacao].filter(Boolean).join(" | ");
    quebrados.push(i.url);
  }
  i.destino = destino(i);
}

// Propagar revogações: um ato "Revogação do Processo Seletivo nº 01/2025" marca
// também os demais arquivos do mesmo processo (edital, convocações, resultados).
const idProcesso = (t) => {
  const m = semAcento(t).match(/(?:processo seletivo|edital|chamamento)[^0-9]{0,12}(\d{1,3})\s*[\/\-_.]?\s*(20\d{2})/);
  return m ? `${Number(m[1])}/${m[2]}` : null;
};
const revogados = new Set(
  itens.filter((i) => i.sinalizacao.includes("REVOGADO")).map((i) => idProcesso(`${i.titulo} ${i.url}`)).filter(Boolean)
);
for (const i of itens) {
  const id = idProcesso(`${i.titulo} ${i.url}`);
  if (id && revogados.has(id) && !i.sinalizacao.includes("REVOGADO")) {
    i.sinalizacao = [`POSSÍVEL PROCESSO REVOGADO: mesmo número (${id}) de um ato de revogação; CONFERIR se é o mesmo processo`, i.sinalizacao].filter(Boolean).join(" | ");
    i.destino = "/vagas — histórico, se confirmada a revogação";
  }
}
console.log(`Processos com ato de revogação: ${[...revogados].join(", ") || "nenhum"}`);
const ordemTipo = { página: 0, PDF: 1, imagem: 2, outro: 3 };
itens.sort((a, b) => ordemTipo[a.tipo] - ordemTipo[b.tipo] || a.url.localeCompare(b.url));

const csvCampo = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
const idDe = (url) => createHash("sha1").update(url).digest("hex").slice(0, 10);
const cabecalho = ["id", "url", "tipo", "subtipo", "titulo", "data", "destino_proposto", "sinalizacao", "origem", "status_http"];
const gravar = (arquivo, linhasCsv) =>
  writeFileSync(join(RAIZ, "docs", arquivo), "﻿" + [cabecalho.join(";"), ...linhasCsv].join("\r\n") + "\r\n");

// COMPLETO: títulos e endereços como estão no site antigo. Contém NOMES de pessoas
// (candidatos em convocações e resultados). Fica fora do repositório público (.gitignore).
gravar(
  "inventario-site-antigo.csv",
  itens.map((i) =>
    [idDe(i.url), i.url, i.tipo, i.subtipo, i.titulo, i.data, i.destino, i.sinalizacao, i.origem, i.status ?? ""]
      .map(csvCampo)
      .join(";")
  )
);

// PÚBLICO: omite título e nome do arquivo de toda mídia (PDF, imagem, planilha,
// vídeo) e de toda página de CASER ou acolhimento. O id liga as duas versões.
const omitir = (i) => i.tipo !== "página" || /CASER|ACOLHIMENTO/.test(i.sinalizacao);
const OMITIDO = "[omitido: pode conter nome de pessoa — ver versão completa interna]";
gravar(
  "inventario-site-antigo-publico.csv",
  itens.map((i) => {
    const url = omitir(i) ? i.url.replace(/\/[^/]*\/?$/, "/[arquivo omitido]") : i.url;
    return [idDe(i.url), url, i.tipo, i.subtipo, omitir(i) ? OMITIDO : i.titulo, i.data, i.destino, i.sinalizacao, i.origem, i.status ?? ""]
      .map(csvCampo)
      .join(";");
  })
);
console.log(`Versão pública: ${itens.filter(omitir).length} linhas com título e arquivo omitidos.`);

const conta = (f) => itens.filter(f).length;
console.log(`\nInventário gravado: docs/inventario-site-antigo.csv — ${itens.length} URLs`);
console.log("Por tipo:");
for (const t of ["página", "PDF", "imagem", "outro"]) console.log(`  ${t.padEnd(8)} ${conta((i) => i.tipo === t)}`);
console.log("Sinalizações:");
const sinais = {
  "edital revogado/anulado?": (i) => i.sinalizacao.includes("EDITAL REVOGADO"),
  "edital (conferir situação)": (i) => i.sinalizacao.includes("edital: conferir"),
  "PDF convocação/resultado (nomes)": (i) => i.sinalizacao.includes("CONVOCAÇÃO"),
  "CASER/socioeducação (ECA 143)": (i) => i.sinalizacao.includes("CASER"),
  "acolhimento (ECA 143)": (i) => i.sinalizacao.includes("ACOLHIMENTO"),
  "possível spam do incidente": (i) => i.sinalizacao.includes("SPAM"),
  "CNEAS / alvará (não vão ao site)": (i) => /CNEAS|ALVARÁ/.test(i.sinalizacao),
  "possível processo revogado (conferir)": (i) => i.sinalizacao.includes("POSSÍVEL PROCESSO REVOGADO"),
  "planilha (dados pessoais?)": (i) => i.sinalizacao.includes("PLANILHA"),
  "vídeo (rosto/ECA)": (i) => i.sinalizacao.includes("VÍDEO"),
  "link quebrado": (i) => i.sinalizacao.includes("QUEBRADO"),
  "destino a DECIDIR": (i) => i.destino === "DECIDIR",
};
for (const [n, f] of Object.entries(sinais)) console.log(`  ${n.padEnd(34)} ${conta(f)}`);
console.log(`\nUsuários do WordPress expostos no sitemap: ${usuariosNoSitemap} (não listados no CSV)`);
