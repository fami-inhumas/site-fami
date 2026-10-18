import type { Metadata } from "next";
import { BlocoPendente } from "@/components/Blocos";
import { CabecaPagina } from "@/components/CabecaPagina";
import { contaDoacao } from "@/content/conteudo-editorial";
import { instituicao } from "@/content/instituicao";

export const metadata: Metadata = { title: "Doe" };

// Fase 1: SEM chave Pix até o Superintendente definir a conta de recursos próprios.
export default function Doe() {
  return (
    <>
      <CabecaPagina titulo="Doe">
        <p>
          As doações vão para uma conta de recursos próprios da FAMI, separada das contas das
          parcerias com o poder público.
        </p>
      </CabecaPagina>

      <section className="secao" aria-labelledby="pix-titulo">
        <div className="container texto">
          <h2 id="pix-titulo">Doação por Pix</h2>
          <BlocoPendente dado={contaDoacao} />
        </div>
      </section>

      <section className="secao secao-alt" aria-labelledby="seguranca-titulo">
        <div className="container texto">
          <h2 id="seguranca-titulo">Doe com segurança</h2>
          <ul>
            <li>
              O site oficial da FAMI é <strong>{instituicao.dominioOficial}</strong>. Desconfie de
              qualquer página com outro endereço pedindo doação.
            </li>
            <li>
              Antes de confirmar o Pix, confira no aplicativo do seu banco se o recebedor é a FAMI,
              CNPJ {instituicao.cnpj}.
            </li>
            <li>
              Toda doação recebida é conferida na contabilidade da FAMI antes da emissão do recibo.
            </li>
            <li>A FAMI não promete dedução no imposto de renda.</li>
          </ul>
        </div>
      </section>
    </>
  );
}
