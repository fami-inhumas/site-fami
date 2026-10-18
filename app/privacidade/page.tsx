import type { Metadata } from "next";
import { CabecaPagina } from "@/components/CabecaPagina";
import { Valor } from "@/components/Pendente";
import { encarregadoDados } from "@/content/conteudo-editorial";
import { instituicao } from "@/content/instituicao";

export const metadata: Metadata = { title: "Privacidade" };

export default function Privacidade() {
  return (
    <>
      <CabecaPagina titulo="Privacidade">
        <p>Como o site da FAMI trata os seus dados, conforme a Lei Geral de Proteção de Dados.</p>
      </CabecaPagina>
      <section className="secao">
        <div className="container texto">
          <h2>O que este site não faz</h2>
          <ul>
            <li>Não usa cookies.</li>
            <li>Não usa ferramentas de estatística de acesso, nem de publicidade.</li>
            <li>
              Não carrega nada de outros sites no seu navegador: fontes, mapa e imagens são servidos
              pelo próprio site. Não há vídeos ou publicações de redes sociais embutidos.
            </li>
            <li>Não tem formulários nesta fase: nenhum dado pessoal é coletado pelas páginas.</li>
          </ul>

          <h2>Hospedagem</h2>
          <p>
            O site é hospedado pela Vercel. Como em qualquer hospedagem, o servidor registra dados
            técnicos de acesso (como endereço IP e horário) para segurança e funcionamento.
          </p>

          <h2>Quem responde pelos dados</h2>
          <p>
            Controladora: FAMI, CNPJ {instituicao.cnpj}, {instituicao.enderecoSede}.
          </p>
          <p>
            Encarregado de dados: <Valor dado={encarregadoDados} />
          </p>

          <h2>Seus direitos</h2>
          <p>
            Você pode pedir confirmação de tratamento, acesso, correção ou eliminação dos seus dados
            pessoais pelo canal do encarregado.
          </p>
        </div>
      </section>
    </>
  );
}
