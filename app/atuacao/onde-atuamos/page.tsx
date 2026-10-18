import type { Metadata } from "next";
import { CabecaPagina } from "@/components/CabecaPagina";
import { MapaAtuacao } from "@/components/MapaAtuacao";

export const metadata: Metadata = { title: "Onde atuamos" };

export default function OndeAtuamos() {
  return (
    <>
      <CabecaPagina titulo="Onde atuamos" migalhas={[{ rotulo: "Atuação", href: "/atuacao" }]}>
        <p>
          A FAMI está em Goiás e no Tocantins. Divulgamos o endereço completo só da sede, em
          Inhumas, e da unidade de Palmas. Unidades de acolhimento e de atendimento socioeducativo
          aparecem só pela cidade, para proteger quem é atendido.
        </p>
      </CabecaPagina>
      <section className="secao">
        <div className="container">
          <MapaAtuacao />
        </div>
      </section>
    </>
  );
}
