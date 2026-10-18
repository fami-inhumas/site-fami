export type ItemMenu = { rotulo: string; href: string; filhos?: ItemMenu[] };

export const menuPrincipal: ItemMenu[] = [
  {
    rotulo: "Instituto",
    href: "/instituto",
    filhos: [
      { rotulo: "Quem somos", href: "/instituto/quem-somos" },
      { rotulo: "História", href: "/instituto/historia" },
      { rotulo: "Estatuto", href: "/instituto/estatuto" },
      { rotulo: "Certificados", href: "/instituto/certificados" },
    ],
  },
  {
    rotulo: "Atuação",
    href: "/atuacao",
    filhos: [
      { rotulo: "Programas em ação", href: "/atuacao/programas-em-acao" },
      { rotulo: "Programas realizados", href: "/atuacao/programas-realizados" },
      { rotulo: "Onde atuamos", href: "/atuacao/onde-atuamos" },
    ],
  },
  { rotulo: "Transparência", href: "/transparencia" },
  { rotulo: "Jovem Aprendiz", href: "/jovem-aprendiz" },
  { rotulo: "Notícias", href: "/noticias" },
  { rotulo: "Vagas", href: "/vagas" },
  { rotulo: "Ouvidoria", href: "/ouvidoria" },
];

// Só o que não está na coluna "Navegação" do rodapé.
export const menuRodape: ItemMenu[] = [
  { rotulo: "Privacidade", href: "/privacidade" },
  { rotulo: "Acessibilidade", href: "/acessibilidade" },
  { rotulo: "Doe", href: "/doe" },
];
