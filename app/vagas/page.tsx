import type { Metadata } from "next";
import { BlocoPendente } from "@/components/Blocos";
import { CabecaPagina } from "@/components/CabecaPagina";
import { vagas } from "@/content/conteudo-editorial";

export const metadata: Metadata = { title: "Vagas" };

export default function Vagas() {
  return (
    <>
      <CabecaPagina titulo="Vagas">
        <p>Processos seletivos da FAMI: vagas abertas e histórico dos processos encerrados.</p>
      </CabecaPagina>
      <section className="secao">
        <div className="container">
          <BlocoPendente dado={vagas} />
        </div>
      </section>
      <section className="secao secao-alt" aria-labelledby="encerrados-titulo">
        <div className="container texto">
          <h2 id="encerrados-titulo">Processos encerrados</h2>
          <p>
            Cada processo encerrado tem uma página com os atos publicados e a situação final.
            Documentos com nomes de candidatos ficam no site só enquanto a publicação é necessária,
            e em versão reduzida.
          </p>
        </div>
      </section>
    </>
  );
}
