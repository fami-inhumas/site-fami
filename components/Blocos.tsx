import { ehPendente, type Pendente } from "@/content/pendente";
import type { NumeroDePrograma } from "@/content/numeros";
import type { Certificado } from "@/content/certificados";
import type { FichaPrograma } from "@/content/programas";
import { MarcadorPendente, Valor } from "./Pendente";

export function CartaoNumero({ item }: { item: NumeroDePrograma }) {
  const n = item.numero;
  return (
    <li className="cartao">
      <h3>{item.programa}</h3>
      {ehPendente(n) ? (
        <MarcadorPendente dado={n} />
      ) : (
        <>
          <p className="numero">{n.valor.toLocaleString("pt-BR")}</p>
          <p>{n.definicao}</p>
          <p className="onde">
            {n.periodo} · Fonte: {n.fonte}
          </p>
        </>
      )}
    </li>
  );
}

export function CartaoPrograma({ p }: { p: FichaPrograma }) {
  return (
    <li className="cartao">
      <h3>{p.nome}</h3>
      <p className="onde">{p.onde}</p>
      {ehPendente(p.resumo) ? (
        <p>
          <MarcadorPendente dado={p.resumo} />
        </p>
      ) : (
        (typeof p.resumo === "string" ? [p.resumo] : p.resumo).map((paragrafo) => (
          <p key={paragrafo}>{paragrafo}</p>
        ))
      )}
    </li>
  );
}

export function TabelaCertificados({ lista }: { lista: Certificado[] }) {
  return (
    <div className="tabela-rolagem">
      <table>
        <caption className="sr-only">Certificados e registros da FAMI</caption>
        <thead>
          <tr>
            <th scope="col">Certificado</th>
            <th scope="col">Ato</th>
            <th scope="col">Situação</th>
          </tr>
        </thead>
        <tbody>
          {lista.map((c) => (
            <tr key={c.titulo}>
              <th scope="row">{c.titulo}</th>
              <td>
                <Valor dado={c.ato} />
              </td>
              <td>{c.situacao ? <Valor dado={c.situacao} /> : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Bloco inteiro ainda sem conteúdo confirmado. */
export function BlocoPendente({ dado }: { dado: Pendente }) {
  return <MarcadorPendente dado={dado} bloco />;
}
