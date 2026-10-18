import type { Metadata } from "next";
import { BlocoPendente } from "@/components/Blocos";
import { CabecaPagina } from "@/components/CabecaPagina";
import { estatuto } from "@/content/conteudo-editorial";

export const metadata: Metadata = { title: "Estatuto" };

export default function Estatuto() {
  return (
    <>
      <CabecaPagina titulo="Estatuto" migalhas={[{ rotulo: "Instituto", href: "/instituto" }]}>
        <p>O estatuto social vigente da FAMI, para consulta pública.</p>
      </CabecaPagina>
      <section className="secao">
        <div className="container texto">
          <BlocoPendente dado={estatuto} />
        </div>
      </section>
    </>
  );
}
