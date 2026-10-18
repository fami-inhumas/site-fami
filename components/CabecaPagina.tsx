import Link from "next/link";
import type { ReactNode } from "react";

type Migalha = { rotulo: string; href?: string };

export function CabecaPagina({
  titulo,
  migalhas = [],
  children,
}: {
  titulo: string;
  migalhas?: Migalha[];
  children?: ReactNode;
}) {
  return (
    <div className="cabeca-pagina">
      <div className="container">
        <nav className="migalhas" aria-label="Você está em">
          <ol>
            <li>
              <Link href="/">Início</Link>
            </li>
            {migalhas.map((m) => (
              <li key={m.rotulo}>{m.href ? <Link href={m.href}>{m.rotulo}</Link> : m.rotulo}</li>
            ))}
            <li aria-current="page">{titulo}</li>
          </ol>
        </nav>
        <h1>{titulo}</h1>
        {children}
      </div>
    </div>
  );
}
