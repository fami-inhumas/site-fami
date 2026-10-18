import type { Metadata } from "next";
import { TabelaCertificados } from "@/components/Blocos";
import { CabecaPagina } from "@/components/CabecaPagina";
import { certificados } from "@/content/certificados";
import { instituicao } from "@/content/instituicao";

export const metadata: Metadata = { title: "Certificados" };

export default function Certificados() {
  return (
    <>
      <CabecaPagina titulo="Certificados" migalhas={[{ rotulo: "Instituto", href: "/instituto" }]}>
        <p>
          Títulos, registros e certificações da FAMI (CNPJ da matriz {instituicao.cnpj}), conferidos
          nos documentos originais.
        </p>
      </CabecaPagina>
      <section className="secao">
        <div className="container">
          <TabelaCertificados lista={certificados} />
        </div>
      </section>
    </>
  );
}
