import { pendente } from "./pendente";

// Painel de transparência (desenho técnico, seção 5).
// Na Fase 1 só a ESTRUTURA vai ao ar; os dados vêm na Fase 2, por extrato aprovado
// do GestOSC. O site não se conecta ao banco do GestOSC em nenhuma hipótese.

/** Campos exigidos por parceria — art. 11 da Lei 13.019/2014. */
export const camposArt11: string[] = [
  "Data de assinatura, identificação do instrumento e do órgão",
  "Nome e CNPJ da FAMI",
  "Objeto da parceria",
  "Valor total e valores liberados",
  "Data prevista e data de apresentação da prestação de contas",
  "Prazo de análise e resultado conclusivo da prestação de contas",
  "Valor total da remuneração da equipe paga com a parceria",
  "Funções e remuneração prevista para cada função (sem nomes)",
];

/** Colunas da matriz por parceria. */
export const colunasMatriz: string[] = [
  "Norma aplicável (MROSC, Organização Social estadual, regime federal)",
  "Campos e documentos exigidos",
  "Responsável",
  "Frequência de atualização",
];

export const parcerias = pendente(
  "Parcerias vigentes com os campos do art. 11 (extrato aprovado do GestOSC)",
  "Superintendente"
);

export const documentosInstitucionais = pendente(
  "Estatuto, relação de dirigentes e demonstrações aprovadas para publicação",
  "Superintendente"
);
