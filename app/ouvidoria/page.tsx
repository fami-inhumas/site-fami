import type { Metadata } from "next";
import { BlocoPendente } from "@/components/Blocos";
import { CabecaPagina } from "@/components/CabecaPagina";
import { responsaveisOuvidoria } from "@/content/conteudo-editorial";

export const metadata: Metadata = { title: "Ouvidoria" };

// Fase 1: página informativa, SEM formulário (desenho técnico, seção 3).
// O formulário só existe depois que a Diretoria nomear os responsáveis de cada rota
// e eles gerarem as próprias chaves.
export default function Ouvidoria() {
  return (
    <>
      <CabecaPagina titulo="Ouvidoria">
        <p>
          Um canal para relatar irregularidades, operado pela própria FAMI, sem plataforma
          contratada. O canal ainda não está aberto; esta página explica como ele vai funcionar.
        </p>
      </CabecaPagina>

      <section className="secao" aria-labelledby="rotas-titulo">
        <div className="container texto">
          <h2 id="rotas-titulo">Três caminhos, cada um com seus responsáveis</h2>
          <ul>
            <li>
              <strong>Gente e Gestão</strong>
            </li>
            <li>
              <strong>Controle Interno</strong>
            </li>
            <li>
              <strong>Conselho Fiscal</strong> — para relatos que envolvem a gestão da FAMI.
            </li>
          </ul>
          <p>
            Você escolhe o caminho. Só os responsáveis daquele caminho conseguem ler o seu relato.
          </p>
          <BlocoPendente dado={responsaveisOuvidoria} />
        </div>
      </section>

      <section className="secao secao-alt" aria-labelledby="cifra-titulo">
        <div className="container texto">
          <h2 id="cifra-titulo">Como o seu relato é protegido</h2>
          <ul>
            <li>
              O texto e os anexos são cifrados no seu próprio navegador, antes de sair do seu
              aparelho. O servidor guarda só o conteúdo cifrado.
            </li>
            <li>
              Os anexos têm os dados ocultos (como local e autor) apagados antes da cifra.
            </li>
            <li>
              Os responsáveis leem os relatos num computador próprio, desconectado da internet,
              nunca numa página do site.
            </li>
            <li>
              O site não grava o seu endereço IP junto com o relato e não usa cookies nessas
              páginas. Não é preciso informar nome, e-mail ou telefone.
            </li>
            <li>
              Você acompanha a situação (recebido, em apuração, concluído) com um número de
              protocolo e uma senha que você mesmo cria.
            </li>
            <li>
              Cada relato recebe também um número em sequência: se um relato for apagado, falta um
              número, e isso aparece.
            </li>
          </ul>
        </div>
      </section>

      <section className="secao" aria-labelledby="limites-titulo">
        <div className="container texto">
          <h2 id="limites-titulo">Limites que você precisa conhecer</h2>
          <ul>
            <li>
              O próprio conteúdo do relato pode identificar você — por exemplo, se contar um fato que
              só você presenciou.
            </li>
            <li>
              Quem publica o site poderia, em tese, alterar o formulário. Por isso o código do site
              é público e o Conselho Fiscal confere periodicamente se o formulário no ar é o mesmo
              da versão publicada; qualquer diferença é registrada e comunicada à Diretoria.
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
