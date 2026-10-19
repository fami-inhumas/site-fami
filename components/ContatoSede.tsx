import { instituicao } from "@/content/instituicao";

/** Telefone e e-mail públicos da sede, como links (tel: e mailto: não fazem requisição). */
export function ContatoSede() {
  return (
    <>
      telefone <a href={instituicao.telefoneLink}>{instituicao.telefone}</a> · e-mail{" "}
      <a href={`mailto:${instituicao.email}`}>{instituicao.email}</a>
    </>
  );
}
