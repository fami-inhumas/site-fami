import { cidades, contornoGoias, contornoTocantins } from "@/content/unidades";

// Mapa próprio em SVG, sem serviço externo (desenho técnico, seção 2).
// Desenho esquemático, sem escala. A lista ao lado é o conteúdo principal:
// o desenho só ilustra, e quem usa leitor de tela recebe tudo pela lista.
export function MapaAtuacao({ tituloNivel = 2 }: { tituloNivel?: 2 | 3 }) {
  const Titulo = tituloNivel === 2 ? "h2" : "h3";
  return (
    <div className="mapa">
      <svg
        viewBox="20 20 410 740"
        role="img"
        aria-labelledby="mapa-titulo mapa-desc"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title id="mapa-titulo">Mapa esquemático de onde a FAMI atua</title>
        <desc id="mapa-desc">
          Desenho sem escala dos estados de Goiás e Tocantins, com marcadores numerados nas
          cidades listadas ao lado.
        </desc>

        <polygon points={contornoTocantins} fill="#ede2d0" stroke="#550000" strokeWidth="2" />
        <polygon points={contornoGoias} fill="#f9f4ec" stroke="#550000" strokeWidth="2" />

        <text x="300" y="250" textAnchor="middle" fontSize="18" fill="#5a4540" letterSpacing="3">
          TOCANTINS
        </text>
        <text x="235" y="510" textAnchor="middle" fontSize="18" fill="#5a4540" letterSpacing="3">
          GOIÁS
        </text>

        {cidades.map((c, i) => (
          <g key={c.id}>
            <circle cx={c.x} cy={c.y} r="11" fill="#550000" stroke="#fffdf9" strokeWidth="2" />
            <text
              x={c.x}
              y={c.y + 4.5}
              textAnchor="middle"
              fontSize="12"
              fontWeight="700"
              fill="#f6efe4"
            >
              {i + 1}
            </text>
          </g>
        ))}
      </svg>

      <div>
        <Titulo className="sr-only">Cidades onde a FAMI atua</Titulo>
        <ol className="mapa-lista">
          {cidades.map((c, i) => (
            <li key={c.id}>
              <span className="marcador" aria-hidden="true">
                {i + 1}
              </span>
              <strong>
                {c.cidade} ({c.uf})
              </strong>
              {" — "}
              {c.programas.join(", ")}
              {c.tipo === "endereco-publico" && (
                <address className="endereco">
                  {c.unidadeDoEndereco}: {c.endereco}
                </address>
              )}
              {c.observacao && <span className="obs">{c.observacao}</span>}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
