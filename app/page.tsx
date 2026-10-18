import Link from "next/link";
import { BlocoPendente, CartaoNumero, CartaoPrograma, TabelaCertificados } from "@/components/Blocos";
import { MapaAtuacao } from "@/components/MapaAtuacao";
import { certificados } from "@/content/certificados";
import {
  contaDoacao,
  historias,
  noticias,
  parceiros,
  vagas,
} from "@/content/conteudo-editorial";
import { instituicao } from "@/content/instituicao";
import { numerosDeImpacto } from "@/content/numeros";
import { programasEmAcao } from "@/content/programas";
import { camposArt11 } from "@/content/transparencia";

// Ordem das seções definida pelo protótipo aprovado:
// abertura com números, programas, mapa, transparência, duas portas do Aprendiz,
// histórias, doação, notícias, vagas, certificados, ouvidoria, parceiros, rodapé.

export default function Inicio() {
  return (
    <>
      {/* 1. Abertura com números */}
      <section className="abertura" aria-labelledby="abertura-titulo">
        <div className="container">
          <h1 id="abertura-titulo">Desde {instituicao.fundacao.slice(-4)}, perto de quem precisa.</h1>
          <p>
            A FAMI é uma organização da sociedade civil com sede em Inhumas (GO) e atuação em Goiás
            e no Tocantins.
          </p>
        </div>
      </section>
      <section className="secao numeros" aria-labelledby="numeros-titulo">
        <div className="container">
          <h2 id="numeros-titulo">Nossos números</h2>
          <p className="secao-intro">
            Cada número é publicado por programa, com período e fonte. O total é a soma dos
            programas.
          </p>
          <ul className="grade">
            {numerosDeImpacto.map((n) => (
              <CartaoNumero key={n.programa} item={n} />
            ))}
          </ul>
        </div>
      </section>

      {/* 2. Programas */}
      <section className="secao secao-alt" aria-labelledby="programas-titulo">
        <div className="container">
          <h2 id="programas-titulo">Programas</h2>
          <ul className="grade">
            {programasEmAcao.map((p) => (
              <CartaoPrograma key={p.nome} p={p} />
            ))}
          </ul>
          <p>
            <Link href="/atuacao/programas-em-acao">Conheça os programas</Link>
          </p>
        </div>
      </section>

      {/* 3. Mapa */}
      <section className="secao" aria-labelledby="mapa-sec-titulo">
        <div className="container">
          <h2 id="mapa-sec-titulo">Onde atuamos</h2>
          <p className="secao-intro">
            Por proteção de quem é atendido, unidades de acolhimento e de atendimento
            socioeducativo aparecem só pela cidade.
          </p>
          <MapaAtuacao tituloNivel={3} />
        </div>
      </section>

      {/* 4. Transparência */}
      <section className="secao secao-bordo" aria-labelledby="transp-titulo">
        <div className="container">
          <h2 id="transp-titulo">Transparência</h2>
          <p className="secao-intro">
            Para cada parceria com o poder público, publicamos o que exige o art. 11 da Lei
            13.019/2014: {camposArt11.length} grupos de informação, do instrumento à remuneração da
            equipe, sem nomes.
          </p>
          <Link href="/transparencia" className="botao botao-claro">
            Ver a transparência
          </Link>
        </div>
      </section>

      {/* 5. Duas portas do Aprendiz */}
      <section className="secao" aria-labelledby="aprendiz-titulo">
        <div className="container">
          <h2 id="aprendiz-titulo">Jovem Aprendiz</h2>
          <div className="portas">
            <div className="porta">
              <h3>Sou jovem</h3>
              <p>
                Aprendizagem profissional para quem tem de 14 a 23 anos. Pessoa com deficiência não
                tem idade máxima.
              </p>
              <Link href="/jovem-aprendiz#jovem">Saiba como participar</Link>
            </div>
            <div className="porta">
              <h3>Sou empresa</h3>
              <p>Contrate aprendizes com o acompanhamento da FAMI.</p>
              <Link href="/jovem-aprendiz#empresa">Saiba como contratar</Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Histórias */}
      <section className="secao secao-alt" aria-labelledby="historias-titulo">
        <div className="container">
          <h2 id="historias-titulo">Histórias</h2>
          <BlocoPendente dado={historias} />
        </div>
      </section>

      {/* 7. Doação */}
      <section className="secao" aria-labelledby="doe-titulo">
        <div className="container">
          <h2 id="doe-titulo">Doe</h2>
          <p className="secao-intro">
            Sua doação vai para uma conta de recursos próprios da FAMI, separada das contas das
            parcerias.
          </p>
          <BlocoPendente dado={contaDoacao} />
          <p>
            <Link href="/doe">Como doar com segurança</Link>
          </p>
        </div>
      </section>

      {/* 8. Notícias */}
      <section className="secao secao-alt" aria-labelledby="noticias-titulo">
        <div className="container">
          <h2 id="noticias-titulo">Notícias</h2>
          <BlocoPendente dado={noticias} />
        </div>
      </section>

      {/* 9. Vagas */}
      <section className="secao" aria-labelledby="vagas-titulo">
        <div className="container">
          <h2 id="vagas-titulo">Vagas</h2>
          <BlocoPendente dado={vagas} />
          <p>
            <Link href="/vagas">Página de vagas e processos seletivos</Link>
          </p>
        </div>
      </section>

      {/* 10. Certificados */}
      <section className="secao secao-alt" aria-labelledby="cert-titulo">
        <div className="container">
          <h2 id="cert-titulo">Certificados</h2>
          <TabelaCertificados lista={certificados} />
        </div>
      </section>

      {/* 11. Ouvidoria */}
      <section className="secao" aria-labelledby="ouv-titulo">
        <div className="container">
          <h2 id="ouv-titulo">Ouvidoria</h2>
          <p className="secao-intro">
            Um canal operado pela própria FAMI, com relatos cifrados no seu navegador antes do
            envio. O canal ainda não está aberto.
          </p>
          <Link href="/ouvidoria">Como vai funcionar</Link>
        </div>
      </section>

      {/* 12. Parceiros */}
      <section className="secao secao-alt" aria-labelledby="parc-titulo">
        <div className="container">
          <h2 id="parc-titulo">Parceiros</h2>
          <BlocoPendente dado={parceiros} />
        </div>
      </section>
    </>
  );
}
