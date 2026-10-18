import { ehPendente, type Pendente as TPendente, type Talvez } from "@/content/pendente";
import { ehProducao } from "@/lib/ambiente";

// Segunda trava, independente de scripts/guarda-pendentes.mjs:
// se um pendente for desenhado durante um build de produção, a geração da
// página falha. Pega também pendentes que a varredura de texto não enxerga.
function travaProducao(p: TPendente): void {
  if (ehProducao()) {
    throw new Error(
      `PENDENTE no build de produção: "${p.rotulo}" (confirma: ${p.decide}). ` +
        "Confirme o dado ou retire-o antes de publicar."
    );
  }
}

export function MarcadorPendente({ dado, bloco = false }: { dado: TPendente; bloco?: boolean }) {
  travaProducao(dado);
  return (
    <span className={bloco ? "pendente pendente-bloco" : "pendente"} data-pendente="">
      <strong>PENDENTE:</strong> {dado.rotulo}{" "}
      <span>(confirma: {dado.decide})</span>
    </span>
  );
}

/** Mostra o valor confirmado ou, se ainda pendente, o marcador. */
export function Valor({ dado, bloco = false }: { dado: Talvez<string>; bloco?: boolean }) {
  if (ehPendente(dado)) return <MarcadorPendente dado={dado} bloco={bloco} />;
  return <>{dado}</>;
}
