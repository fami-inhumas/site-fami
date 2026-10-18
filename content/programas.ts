import { pendente, type Talvez } from "./pendente";
import type { Programa } from "./unidades";

export type FichaPrograma = {
  nome: Programa;
  /** Onde o programa acontece, só pela cidade. */
  onde: string;
  resumo: Talvez<string>;
  /** Proteção de atendidos: exige revisão editorial (ECA art. 143) antes de qualquer foto ou notícia. */
  protegido: boolean;
};

// Só entra texto conferido. O que a equipe ainda não escreveu fica pendente.
export const programasEmAcao: FichaPrograma[] = [
  {
    nome: "Jovem Aprendiz",
    onde: "Inhumas (GO) e Tocantins: Palmas, Araguatins, Augustinópolis, Dianópolis e Paraíso do Tocantins",
    resumo:
      "Aprendizagem profissional para jovens de 14 a 23 anos, sem idade máxima para pessoa com deficiência. No Tocantins, por contrato de gestão com a UNITINS.",
    protegido: false,
  },
  {
    nome: "Caminhar",
    onde: "Inhumas (GO)",
    resumo: pendente("Descrição do programa Caminhar", "Gente e Gestão"),
    protegido: false,
  },
  {
    nome: "FAMI Service",
    onde: "Inhumas (GO)",
    resumo: pendente("Descrição do FAMI Service", "Superintendente"),
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
