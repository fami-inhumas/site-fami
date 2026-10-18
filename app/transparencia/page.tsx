import type { Metadata } from "next";
import { BlocoPendente } from "@/components/Blocos";
import { CabecaPagina } from "@/components/CabecaPagina";
import { instituicao } from "@/content/instituicao";
import {
  camposArt11,
  colunasMatriz,
  documentosInstitucionais,
  parcerias,
} from "@/content/transparencia";

export const metadata: Metadata = { title: "Transparência" };

export default function Transparencia() {
  return (
    <>
      <CabecaPagina titulo="Transparência">
        <p>
          Informações sobre as parcerias da FAMI ({instituicao.cnpj}) com o poder público, na forma
          do art. 11 da Lei 13.019/2014. As mesmas informações ficam em local visível na sede.
        </p>
      </CabecaPagina>

      <section className="secao" aria-labelledby="parcerias-titulo">
        <div className="container">
          <h2 id="parcerias-titulo">Parcerias</h2>
          <BlocoPendente dado={parcerias} />
        </div>
      </section>

      <section className="secao secao-alt" aria-labelledby="campos-titulo">
        <div className="container texto">
          <h2 id="campos-titulo">O que publicamos sobre cada parceria</h2>
          <ul>
            {camposArt11.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          <p>
            Nas parcerias federais publicamos também o estatuto, a relação nominal de dirigentes e
            a cópia integral dos instrumentos (Decreto 7.724/2012, art. 63).
          </p>
        </div>
      </section>

      <section className="secao" aria-labelledby="matriz-titulo">
        <div className="container texto">
          <h2 id="matriz-titulo">Como cada parceria é registrada</h2>
          <p>Para cada instrumento, a FAMI mantém o registro de:</p>
          <ul>
            {colunasMatriz.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="secao secao-alt" aria-labelledby="docs-titulo">
        <div className="container">
          <h2 id="docs-titulo">Documentos institucionais</h2>
          <BlocoPendente dado={documentosInstitucionais} />
        </div>
      </section>

      <section className="secao" aria-labelledby="origem-titulo">
        <div className="container texto">
          <h2 id="origem-titulo">De onde vêm os dados</h2>
          <p>
            Os dados são publicados a partir de um extrato aprovado pelo Superintendente, com data
            de referência. O site não tem acesso aos sistemas internos da FAMI. Quando houver erro,
            a correção é publicada com a nova data e o registro da alteração.
          </p>
        </div>
      </section>
    </>
  );
}
