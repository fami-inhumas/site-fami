// Marcador de dado ainda não confirmado.
//
// Regra (pedido da Fase 1, "Guarda de publicação"): qualquer dado marcado como
// PENDENTE impede o build de produção. A pré-visualização mostra o marcador.
//
// Como a guarda encontra os pendentes: scripts/guarda-pendentes.mjs lê o texto
// de content/ e app/ e conta cada chamada `pendente("...", "...")`.
// Por isso o rótulo e quem decide são SEMPRE textos literais entre aspas,
// nunca variáveis — a guarda não conseguiria ler uma variável.

export type Pendente = {
  readonly pendente: true;
  /** O que falta, em linguagem simples. */
  readonly rotulo: string;
  /** Quem confirma o dado (desenho técnico, seção 9). */
  readonly decide: string;
};

export function pendente(rotulo: string, decide: string): Pendente {
  return { pendente: true, rotulo, decide };
}

export function ehPendente(valor: unknown): valor is Pendente {
  return (
    typeof valor === "object" &&
    valor !== null &&
    (valor as { pendente?: unknown }).pendente === true
  );
}

/** Um dado que pode estar confirmado (T) ou ainda pendente. */
export type Talvez<T> = T | Pendente;
