import type { Metadata } from "next";
import { CartaoPrograma } from "@/components/Blocos";
import { CabecaPagina } from "@/components/CabecaPagina";
import { programasEmAcao } from "@/content/programas";

export const metadata: Metadata = { title: "Programas em ação" };

export default function ProgramasEmAcao() {
  return (
    <>
      <CabecaPagina titulo="Programas em ação" migalhas={[{ rotulo: "Atuação", href: "/atuacao" }]}>
        <p>Os programas que a FAMI executa hoje.</p>
      </CabecaPagina>
      <section className="secao">
        <div className="container">
          <ul className="grade">
            {programasEmAcao.map((p) => (
              <CartaoPrograma key={p.nome} p={p} />
            ))}
          </ul>
          <p className="aviso">
            Fotos, legendas e notícias da Casa da Acolhida e do CASER passam por revisão de
            segurança antes de publicadas. Rosto coberto não basta: fachada, uniforme, legenda e
            contexto também identificam uma criança ou um adolescente.
          </p>
        </div>
      </section>
    </>
  );
}
