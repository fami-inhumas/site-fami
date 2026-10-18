import type { Metadata } from "next";
import { CabecaPagina } from "@/components/CabecaPagina";
import { Valor } from "@/components/Pendente";
import { instituicao } from "@/content/instituicao";

export const metadata: Metadata = { title: "Quem somos" };

export default function QuemSomos() {
  return (
    <>
      <CabecaPagina titulo="Quem somos" migalhas={[{ rotulo: "Instituto", href: "/instituto" }]}>
        <p>
          A FAMI é uma organização da sociedade civil fundada em {instituicao.fundacao}, com sede em{" "}
          {instituicao.cidadeSede} ({instituicao.uf}) e atuação em Goiás e no Tocantins.
        </p>
      </CabecaPagina>
      <section className="secao">
        <div className="container texto">
          <h2>Identificação</h2>
          <dl>
            <dt>
              <strong>Razão social</strong>
            </dt>
            <dd>
              <Valor dado={instituicao.razaoSocial} />
            </dd>
            <dt>
              <strong>CNPJ da matriz</strong>
            </dt>
            <dd>{instituicao.cnpj}</dd>
            <dt>
              <strong>Fundação</strong>
            </dt>
            <dd>{instituicao.fundacao}</dd>
            <dt>
              <strong>Sede</strong>
            </dt>
            <dd>{instituicao.enderecoSede}</dd>
          </dl>
        </div>
      </section>
    </>
  );
}
