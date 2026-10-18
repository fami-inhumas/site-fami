import type { Metadata } from "next";
import { CabecaPagina } from "@/components/CabecaPagina";
import { IndiceSecao } from "@/components/IndiceSecao";

export const metadata: Metadata = { title: "Atuação" };

export default function Atuacao() {
  return (
    <>
      <CabecaPagina titulo="Atuação">
        <p>Os programas da FAMI, os que já concluímos e as cidades onde estamos.</p>
      </CabecaPagina>
      <IndiceSecao href="/atuacao" />
    </>
  );
}
