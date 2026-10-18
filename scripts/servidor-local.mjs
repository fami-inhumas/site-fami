// Servidor local para conferir o site estático com os MESMOS cabeçalhos da Vercel.
// Lê os cabeçalhos de vercel.json (fonte única) e imita cleanUrls.
// Uso: node scripts/servidor-local.mjs [porta]

import { createServer } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";

const RAIZ = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const SAIDA = join(RAIZ, "out");
const PORTA = Number(process.argv.slice(2).find((a) => /^\d+$/.test(a)) ?? 3010);

const vercel = JSON.parse(readFileSync(join(RAIZ, "vercel.json"), "utf8"));
const cabecalhos = vercel.headers.find((h) => h.source === "/(.*)").headers;

const TIPOS = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".woff2": "font/woff2",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".json": "application/json",
};

function resolver(url) {
  const caminho = normalize(decodeURIComponent(url.split("?")[0])).replace(/^(\.\.[\/\\])+/, "");
  const base = join(SAIDA, caminho);
  for (const c of [base, base + ".html", join(base, "index.html")]) {
    if (existsSync(c) && statSync(c).isFile()) return c;
  }
  return null;
}

createServer((req, res) => {
  for (const { key, value } of cabecalhos) {
    // HSTS e upgrade-insecure-requests não fazem sentido em http://localhost.
    if (key === "Strict-Transport-Security") continue;
    res.setHeader(key, key === "Content-Security-Policy" ? value.replace("; upgrade-insecure-requests", "") : value);
  }
  const arq = resolver(req.url ?? "/");
  if (!arq) {
    const nf = join(SAIDA, "404.html");
    res.statusCode = 404;
    res.setHeader("Content-Type", TIPOS[".html"]);
    res.end(existsSync(nf) ? readFileSync(nf) : "404");
    return;
  }
  res.setHeader("Content-Type", TIPOS[extname(arq)] ?? "application/octet-stream");
  res.end(readFileSync(arq));
}).listen(PORTA, () => console.log(`site-fami estático em http://localhost:${PORTA}`));
