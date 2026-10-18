import type { Metadata } from "next";
import { BlocoPendente } from "@/components/Blocos";
import { CabecaPagina } from "@/components/CabecaPagina";
import { programasRealizados } from "@/content/programas";

export const metadata: Metadata = { title: "Programas realizados" };

export default function ProgramasRealizados() {
  return (
    <>
      <CabecaPagina titulo="Programas realizados" migalhas={[{ rotulo: "Atuação", href: "/atuacao" }]}>
        <p>Programas e parcerias que a FAMI já concluiu.</p>
      </CabecaPagina>
      <section className="secao">
        <div className="container texto">
          <BlocoPendente dado={programasRealizados} />
        </div>
      </section>
    </>
  );
}
