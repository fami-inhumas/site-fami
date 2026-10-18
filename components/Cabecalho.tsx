import Link from "next/link";
import { menuPrincipal } from "@/content/navegacao";

function Itens() {
  return (
    <ul>
      {menuPrincipal.map((item) => (
        <li key={item.href}>
          <Link href={item.href}>{item.rotulo}</Link>
        </li>
      ))}
      <li>
        <Link href="/doe" className="menu-doe">
          Doe
        </Link>
      </li>
    </ul>
  );
}

export function Cabecalho() {
  return (
    <header className="cabecalho">
      <div className="container">
        {/* O nome acessível começa pelo texto visível (WCAG 2.5.3). */}
        <Link href="/" className="marca">
          FAMI
          <span>Inhumas · Goiás · desde 1993</span>
          <span className="sr-only"> — página inicial</span>
        </Link>

        <nav className="menu menu-largo" aria-label="Menu principal">
          <Itens />
        </nav>

        {/* No celular, o mesmo menu dentro de <details>: funciona sem JavaScript. */}
        <details className="menu menu-celular">
          <summary>Menu</summary>
          <nav aria-label="Menu principal (celular)">
            <Itens />
          </nav>
        </details>
      </div>
    </header>
  );
}
