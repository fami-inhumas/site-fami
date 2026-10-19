import { pendente, type Talvez } from "./pendente";
import type { Programa } from "./unidades";

export type FichaPrograma = {
  nome: Programa;
  /** Onde o programa acontece, só pela cidade. */
  onde: string;
  /** Um parágrafo (texto) ou vários (lista de textos). */
  resumo: Talvez<string | readonly string[]>;
  /** Proteção de atendidos: exige revisão editorial (ECA art. 143) antes de qualquer foto ou notícia. */
  protegido: boolean;
};

// Só entra texto conferido. O que a equipe ainda não escreveu fica pendente.
export const programasEmAcao: FichaPrograma[] = [
  {
    nome: "Jovem Aprendiz",
    onde: "Goiás: Inhumas, Goianira e Itauçu. Tocantins: Palmas, Araguatins, Augustinópolis, Dianópolis e Paraíso do Tocantins",
    resumo:
      "Aprendizagem profissional para jovens de 14 a 23 anos, sem idade máxima para pessoa com deficiência. No Tocantins, por contrato de gestão com a UNITINS.",
    protegido: false,
  },
  {
    nome: "Caminhar",
    onde: "Inhumas (GO)",
    // Texto conferido pelo Superintendente (Thiago, 19/10/2026).
    // O Caminhar atende só até 14 anos: aqui não se fala em "adolescentes".
    resumo: [
      "O Programa Caminhar atende meninos e meninas de até 14 anos em Inhumas, no contraturno escolar, de terça a sexta-feira, pela manhã e à tarde. As atividades reúnem esporte (vôlei, natação, futsal, futebol society, handebol, judô, atletismo e capoeira), cultura (dança, teatro e xadrez) e acompanhamento educacional, com rodas de conversa e palestras.",
      "O esporte é a ferramenta. Por meio dele, o programa trabalha disciplina, respeito, trabalho em equipe e autoestima, ajuda a prevenir a evasão escolar e o uso de drogas e fortalece os laços com as famílias e a comunidade.",
    ],
    protegido: false,
  },
  {
    nome: "FAMI Service",
    onde: "Inhumas (GO)",
    // Texto conferido pelo Superintendente (Thiago, 19/10/2026).
    resumo: [
      "Criado em 2021, o FAMI Service gera trabalho formal para adultos de Inhumas por meio da prestação de serviços de limpeza e conservação, recepção e limpeza hospitalar a órgãos públicos e empresas. Os trabalhadores são contratados com carteira assinada e todos os direitos trabalhistas, e recebem capacitação e acompanhamento.",
      "Como a FAMI é uma organização sem fins lucrativos, todo o resultado do FAMI Service é revertido para os programas sociais da Fundação.",
    ],
    protegido: false,
  },
  {
    nome: "Casa da Acolhida",
    onde: "Inhumas (GO)",
    resumo: "Acolhimento institucional. Por proteção de quem é acolhido, o endereço não é divulgado.",
    protegido: true,
  },
  {
    nome: "CASER",
    onde: "Rio Verde (GO)",
    resumo:
      "Atendimento socioeducativo. Por proteção dos adolescentes atendidos (ECA, art. 143), o endereço não é divulgado.",
    protegido: true,
  },
];

export const programasRealizados = pendente(
  "Lista dos programas já encerrados, com período e parceiro",
  "Superintendente"
);
