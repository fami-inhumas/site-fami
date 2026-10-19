import type { Metadata } from "next";
import { CabecaPagina } from "@/components/CabecaPagina";
import { textoHistoria } from "@/content/conteudo-editorial";
import { instituicao } from "@/content/instituicao";

export const metadata: Metadata = { title: "História" };

export default function Historia() {
  return (
    <>
      <CabecaPagina titulo="História" migalhas={[{ rotulo: "Instituto", href: "/instituto" }]}>
        <p>A FAMI foi fundada em {instituicao.fundacao}, em Inhumas (GO).</p>
      </CabecaPagina>
      <section className="secao">
        <div className="container texto">
          {textoHistoria.map((paragrafo) => (
            <p key={paragrafo}>{paragrafo}</p>
          ))}
        </div>
      </section>
    </>
  );
}
