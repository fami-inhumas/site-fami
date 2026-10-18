import type { Metadata } from "next";
import { BlocoPendente } from "@/components/Blocos";
import { CabecaPagina } from "@/components/CabecaPagina";
import { noticias } from "@/content/conteudo-editorial";

export const metadata: Metadata = { title: "Notícias" };

export default function Noticias() {
  return (
    <>
      <CabecaPagina titulo="Notícias">
        <p>O que acontece na FAMI e nos seus programas.</p>
      </CabecaPagina>
      <section className="secao">
        <div className="container">
          <BlocoPendente dado={noticias} />
        </div>
      </section>
    </>
  );
}
