import { pendente, type Talvez } from "./pendente";

export type Certificado = {
  titulo: string;
  ato: Talvez<string>;
  /** Validade ou situação, só quando conferida no documento. */
  situacao?: Talvez<string>;
};

// Dados conferidos nos documentos (pedido da Fase 1, 17/10/2026).
// Não se escreve "vigente" sem conferência: onde o pedido não traz validade,
// o campo fica de fora.
export const certificados: Certificado[] = [
  { titulo: "Utilidade Pública Municipal", ato: "Lei nº 2.225/1993" },
  { titulo: "Utilidade Pública Estadual", ato: "Lei nº 12.343/1994" },
  { titulo: "Organização Social (GO)", ato: "Decreto nº 9.166/2018" },
  {
    titulo: "CMDCA de Inhumas",
    ato: "Certificado de Registro nº 01/2026",
    situacao: "Válido até 05/01/2028",
  },
  {
    titulo: "CMAS de Inhumas",
    ato: "Inscrição nº 013",
    situacao: pendente("Validade da inscrição no CMAS (em renovação)", "Superintendente"),
  },
  {
    titulo: "CNEAS",
    ato: "Cadastro Nacional de Entidades de Assistência Social",
    situacao: "Cadastrada desde 2004",
  },
  {
    titulo: "CEBAS",
    ato: pendente("Número do CEBAS", "Superintendente"),
    situacao: pendente("Validade do CEBAS", "Superintendente"),
  },
];
