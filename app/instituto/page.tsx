import type { Metadata } from "next";
import { CabecaPagina } from "@/components/CabecaPagina";
import { IndiceSecao } from "@/components/IndiceSecao";

export const metadata: Metadata = { title: "Instituto" };

export default function Instituto() {
  return (
    <>
      <CabecaPagina titulo="Instituto">
        <p>Quem somos, nossa história, o estatuto e os certificados da FAMI.</p>
      </CabecaPagina>
      <IndiceSecao href="/instituto" />
    </>
  );
}
