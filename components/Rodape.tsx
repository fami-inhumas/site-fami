import Link from "next/link";
import { instituicao } from "@/content/instituicao";
import { menuPrincipal, menuRodape } from "@/content/navegacao";
import { Valor } from "./Pendente";

export function Rodape() {
  return (
    <footer className="rodape">
      <div className="container">
        <div className="grade">
          <div>
            <h2>FAMI</h2>
            <p>
              <Valor dado={instituicao.razaoSocial} />
            </p>
            <p>CNPJ {instituicao.cnpj}</p>
            <p>Fundada em {instituicao.fundacao}</p>
          </div>
          <div>
            <h2>Sede</h2>
            <address className="sem-italico">
              <p>{instituicao.enderecoSede}</p>
              <p>
                <Valor dado={instituicao.contatoPublico} />
              </p>
            </address>
          </div>
          <nav aria-label="Mapa do site">
            <h2>Navegação</h2>
            <ul>
              {menuPrincipal.map((i) => (
                <li key={i.href}>
                  <Link href={i.href}>{i.rotulo}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Informações legais">
            <h2>Informações</h2>
            <ul>
              {menuRodape.map((i) => (
                <li key={i.href}>
                  <Link href={i.href}>{i.rotulo}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className="linha-final">
          Site oficial: <strong>{instituicao.dominioOficial}</strong>. Desconfie de páginas com outro
          endereço pedindo doação. Este site não usa cookies nem serviços de terceiros.
        </p>
      </div>
    </footer>
  );
}
