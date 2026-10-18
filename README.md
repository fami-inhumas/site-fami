# Site da FAMI — Fase 1

Site institucional novo da FAMI, em **pré-visualização**. Nada aqui substitui o
`fami.org.br`: sem mudança de DNS, sem tocar no WordPress atual, no GestOSC, no ERP
Aprendiz, no FAMI Service ou no Google Workspace.

Referência completa: [`docs/DESENHO-TECNICO-SITE-FAMI.md`](docs/DESENHO-TECNICO-SITE-FAMI.md).

## Como funciona

- **Next.js (App Router) + TypeScript**, gerado como **HTML estático puro**
  (`output: "export"`). O pós-build retira os scripts do Next: o site não usa
  JavaScript no navegador, e a CSP proíbe qualquer script (`script-src 'none'`).
- **Hospedagem:** Vercel, como site estático (`vercel.json`). Região `gru1` já
  declarada para quando houver função de servidor.
- **Fontes** Fraunces (títulos) e Source Sans 3 (texto): baixadas **no build** pelo
  `next/font` e servidas pelo próprio site. O visitante não faz requisição ao Google.
- **Zero terceiros no navegador:** sem analytics, feeds, mapas ou vídeos externos,
  sem CDN. O mapa é um SVG próprio.
- **Cabeçalhos de segurança e CSP:** em `vercel.json` (fonte única). O servidor local
  (`npm start`) aplica os mesmos cabeçalhos.

## Comandos

| Comando | O que faz |
| --- | --- |
| `npm install` | Instala as dependências (versões fixas). |
| `npm run build` | Guarda de pendentes → build estático → pós-build (retira scripts, limpa metadados de imagens). Saída em `out/`. |
| `npm start` | Serve `out/` em http://localhost:3010 com os cabeçalhos da Vercel. |
| `npm run prova:bloqueio` | Mostra o build de **produção** bloqueado enquanto houver PENDENTE. |
| `npm run verifica:tudo` | Terceiros + mapa + placar (axe, CSP, console) + teclado. Precisa do build. |
| `npm run inventario` | Relê o `fami.org.br` (só leitura) e regenera os CSVs do inventário. |

O placar e o teste de teclado usam o **Microsoft Edge já instalado** (Playwright,
`channel: "msedge"`); não baixam navegador.

## Guarda de publicação (PENDENTE)

Todo dado não confirmado é escrito como `pendente("o que falta", "quem confirma")`
em `content/`. Duas travas independentes:

1. `scripts/guarda-pendentes.mjs` conta as marcações antes do build. Em produção
   (`VERCEL_ENV=production`), se houver alguma, **o build para** com a lista. Uma
   marcação com rótulo que não seja texto literal também para o build, em qualquer
   ambiente.
2. `components/Pendente.tsx` derruba a geração da página se um pendente chegar a ser
   desenhado num build de produção (pega o que a varredura de texto não enxerga).

Na pré-visualização, o pendente aparece como um marcador amarelo tracejado.

**O que a guarda NÃO promete:** não confere se um dado "confirmado" está certo, e não
enxerga dado pendente escrito sem a marcação (ex.: "a definir" digitado como texto).

Para confirmar um dado: troque o `pendente(...)` pelo valor conferido, no arquivo de
`content/` indicado pela lista da guarda.

## Proteção de atendidos

- `content/unidades.ts`: cidades de acolhimento e socioeducação **não têm campo de
  endereço** (o TypeScript impede). Não há latitude/longitude no repositório.
- `npm run verifica:mapa` varre tudo o que vai ao navegador: lista branca de endereços
  (só sede e Palmas), nenhuma coordenada ou link de mapa, e — opcionalmente — uma
  lista negra com os endereços reais protegidos, guardada **fora** deste repositório
  público: `node scripts/verifica-mapa.mjs --lista "C:\caminho\enderecos-protegidos.txt"`.
- Imagens: o pós-build remove EXIF, GPS, XMP e IPTC e confere relendo cada arquivo.
- Nenhuma imagem gerada por IA representando atendidos.

## Inventário do site antigo

- `docs/inventario-site-antigo-publico.csv` — vai ao repositório. Título e nome de
  arquivo **omitidos** em toda mídia e em toda página de CASER ou acolhimento.
- `docs/inventario-site-antigo.csv` — versão **completa**, com títulos que trazem
  nomes de candidatos. Está no `.gitignore`: não vai ao repositório público.
- O `id` liga as duas versões. Separador `;` (abre direto no Excel em português).

## Regras da casa

- Segredo (token, chave, senha) nunca passa pelo chat nem entra no repositório.
- Comando que cria ou altera conta, repositório, projeto ou configuração de terceiros:
  mostrado antes, executado só com confirmação do Thiago.
- Nada entra em produção sem APROVADO do Superintendente.
