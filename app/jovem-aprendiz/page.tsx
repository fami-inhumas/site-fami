import type { Metadata } from "next";
import { BlocoPendente } from "@/components/Blocos";
import { CabecaPagina } from "@/components/CabecaPagina";
import { Valor } from "@/components/Pendente";
import { textoDireitosAprendiz } from "@/content/conteudo-editorial";
import { instituicao } from "@/content/instituicao";

export const metadata: Metadata = { title: "Jovem Aprendiz" };

// Fase 1: página informativa, SEM formulário. A inscrição online é da Fase 3.
export default function JovemAprendiz() {
  return (
    <>
      <CabecaPagina titulo="Jovem Aprendiz">
        <p>
          Aprendizagem profissional em Inhumas (GO) e no Tocantins: Palmas, Araguatins,
          Augustinópolis, Dianópolis e Paraíso do Tocantins. No Tocantins, o programa é executado
          por contrato de gestão com a UNITINS.
        </p>
      </CabecaPagina>

      <section className="secao" id="jovem" aria-labelledby="jovem-titulo">
        <div className="container texto">
          <h2 id="jovem-titulo">Para jovens</h2>
          <ul>
            <li>Para quem tem de 14 a 23 anos.</li>
            <li>Pessoa com deficiência não tem idade máxima.</li>
            <li>
              Inscrever-se não é o mesmo que ser contratado: a inscrição coloca você no cadastro; a
              contratação depende de vaga numa empresa.
            </li>
            <li>
              Se você tem menos de 18 anos, seu responsável participa no momento da contratação.
            </li>
          </ul>
          <p className="aviso">
            A inscrição pelo site ainda não está aberta. Enquanto isso, procure a FAMI:{" "}
            <Valor dado={instituicao.contatoPublico} />
          </p>
        </div>
      </section>

      <section className="secao secao-alt" id="empresa" aria-labelledby="empresa-titulo">
        <div className="container texto">
          <h2 id="empresa-titulo">Para empresas</h2>
          <p>
            Empresas que querem contratar aprendizes podem contar com a FAMI para a seleção e o
            acompanhamento dos jovens.
          </p>
          <p className="aviso">
            O cadastro de empresas pelo site ainda não está aberto. Contato:{" "}
            <Valor dado={instituicao.contatoPublico} />
          </p>
        </div>
      </section>

      <section className="secao" aria-labelledby="direitos-titulo">
        <div className="container texto">
          <h2 id="direitos-titulo">Direitos do aprendiz</h2>
          <BlocoPendente dado={textoDireitosAprendiz} />
        </div>
      </section>
    </>
  );
}
