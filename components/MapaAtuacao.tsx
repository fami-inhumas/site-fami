import { cidades, contornoGoias, contornoTocantins } from "@/content/unidades";

// Mapa próprio em SVG, sem serviço externo (desenho técnico, seção 2).
// Interativo SEM JavaScript (HTML e CSS puros):
//   - cada cidade é um painel <details>/<summary>, que abre e fecha com clique,
//     toque, Enter ou Espaço;
//   - cada marcador do desenho é um link para o painel da sua cidade (#cidade-...):
//     o alvo fica dentro do <details>, então o navegador abre o painel para mostrá-lo,
//     e o CSS (:has(:target)) destaca o painel.
// Desenho esquemático, sem escala. A lista de painéis é o conteúdo principal:
// quem usa leitor de tela recebe tudo por ela.
export function MapaAtuacao({ tituloNivel = 2 }: { tituloNivel?: 2 | 3 }) {
  const Titulo = tituloNivel === 2 ? "h2" : "h3";
  return (
    <div className="mapa">
      <svg viewBox="20 20 410 740" role="group" aria-labelledby="mapa-titulo" xmlns="http://www.w3.org/2000/svg">
        <title id="mapa-titulo">Mapa esquemático de onde a FAMI atua</title>
        <desc>
          Desenho sem escala dos estados de Goiás e Tocantins. Cada marcador numerado é um link
          para o painel da cidade, na lista ao lado.
        </desc>

        <polygon points={contornoTocantins} fill="#ede2d0" stroke="#550000" strokeWidth="2" aria-hidden="true" />
        <polygon points={contornoGoias} fill="#f9f4ec" stroke="#550000" strokeWidth="2" aria-hidden="true" />

        <text x="300" y="250" textAnchor="middle" fontSize="18" fill="#5a4540" letterSpacing="3" aria-hidden="true">
          TOCANTINS
        </text>
        <text x="235" y="510" textAnchor="middle" fontSize="18" fill="#5a4540" letterSpacing="3" aria-hidden="true">
          GOIÁS
        </text>

        {cidades.map((c, i) => (
          <a
            key={c.id}
            href={`#cidade-${c.id}`}
            className="mapa-marcador"
            aria-label={`${i + 1}. ${c.cidade} (${c.uf}) — abrir painel da cidade`}
          >
            {/* Área de toque maior que o marcador (WCAG 2.5.8: mínimo 24 px). */}
            <circle cx={c.x} cy={c.y} r="16" fill="transparent" />
            <circle className="mapa-ponto" cx={c.x} cy={c.y} r="11" fill="#550000" stroke="#fffdf9" strokeWidth="2" />
            <text x={c.x} y={c.y + 4.5} textAnchor="middle" fontSize="12" fontWeight="700" fill="#f6efe4">
              {i + 1}
            </text>
          </a>
        ))}
      </svg>

      <div>
        <Titulo className="sr-only">Cidades onde a FAMI atua</Titulo>
        <ol className="mapa-lista">
          {cidades.map((c, i) => (
            <li key={c.id}>
              <details className="painel-cidade">
                <summary>
                  <span className="marcador" aria-hidden="true">
                    {i + 1}
                  </span>
                  <strong>
                    {c.cidade} ({c.uf})
                  </strong>
                </summary>
                {/* O alvo do link fica DENTRO do <details>: ao seguir o link, o navegador
                    abre o painel fechado para mostrar o alvo (auto-expand do HTML). */}
                <div id={`cidade-${c.id}`} className="painel-corpo">
                  <p>
                    <strong>Programas:</strong> {c.programas.join(", ")}
                  </p>
                  {c.tipo === "endereco-publico" && (
                    <address className="endereco">
                      {c.unidadeDoEndereco}: {c.endereco}
                    </address>
                  )}
                  {c.observacao && <p className="obs">{c.observacao}</p>}
                </div>
              </details>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
