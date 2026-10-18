import Link from "next/link";
import { menuPrincipal } from "@/content/navegacao";

/** Lista as páginas filhas de uma seção do menu (Instituto, Atuação). */
export function IndiceSecao({ href }: { href: string }) {
  const secao = menuPrincipal.find((i) => i.href === href);
  if (!secao?.filhos) return null;
  return (
    <section className="secao">
      <div className="container">
        <h2 className="sr-only">Nesta seção</h2>
        <ul className="grade">
          {secao.filhos.map((f) => (
            <li key={f.href} className="cartao">
              <h3>
                <Link href={f.href}>{f.rotulo}</Link>
              </h3>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
