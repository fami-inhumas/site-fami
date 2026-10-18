import type { Metadata } from "next";
import { CabecaPagina } from "@/components/CabecaPagina";
import { Valor } from "@/components/Pendente";
import { instituicao } from "@/content/instituicao";

export const metadata: Metadata = { title: "Acessibilidade" };

export default function Acessibilidade() {
  return (
    <>
      <CabecaPagina titulo="Acessibilidade">
        <p>O site da FAMI foi feito para que todas as pessoas consigam usá-lo.</p>
      </CabecaPagina>
      <section className="secao">
        <div className="container texto">
          <h2>Nosso compromisso</h2>
          <p>
            Seguimos as Diretrizes de Acessibilidade para Conteúdo Web (WCAG) 2.2, nível AA. Cada
            versão do site é conferida por ferramenta automática e por teste manual com teclado,
            leitor de tela e celular.
          </p>

          <h2>Recursos do site</h2>
          <ul>
            <li>
              Link “Pular para o conteúdo” no topo de cada página — aparece ao apertar a tecla Tab.
            </li>
            <li>Todo o site pode ser usado só com o teclado; o item em foco fica destacado.</li>
            <li>Cores com contraste acima do mínimo exigido.</li>
            <li>O mapa de atuação tem uma lista em texto com todas as cidades.</li>
            <li>O menu funciona no celular mesmo sem JavaScript.</li>
          </ul>

          <h2>Encontrou uma barreira?</h2>
          <p>
            Conte para a gente: <Valor dado={instituicao.contatoPublico} />
          </p>
        </div>
      </section>
    </>
  );
}
