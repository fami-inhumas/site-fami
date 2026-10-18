// Em qual ambiente o site está sendo gerado.
// Na Vercel, VERCEL_ENV vale "production", "preview" ou "development".
// SITE_FAMI_AMBIENTE permite forçar o valor localmente (usado na prova do bloqueio).
export function ambiente(): string {
  return process.env.SITE_FAMI_AMBIENTE ?? process.env.VERCEL_ENV ?? "local";
}

export function ehProducao(): boolean {
  return ambiente() === "production";
}
