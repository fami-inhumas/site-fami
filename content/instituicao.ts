import type { Talvez } from "./pendente";

// Dados conferidos nos documentos (pedido da Fase 1, 17/10/2026).
export const instituicao = {
  sigla: "FAMI",
  // Conferida no Cartão CNPJ, no CNEAS e nos alvarás (Thiago, 18/10/2026).
  razaoSocial: "Fundação de Assistência ao Menor Inhumense" as Talvez<string>,
  nomeFantasia: "FAMI",
  cnpj: "73.573.297/0001-58",
  fundacao: "15/07/1993",
  cidadeSede: "Inhumas",
  uf: "GO",
  // Endereço completo SÓ da sede e da unidade de Palmas (desenho técnico, seção 1).
  enderecoSede: "Rua da Saudade, Qd. 135, Lt. 19, Centro, Inhumas – GO",
  enderecoPalmas: "204 Sul, Av. NS 4, Centro, Espaço 21, Sala 09, Palmas – TO",
  dominioOficial: "fami.org.br",
  // Contato público da sede (Thiago, 19/10/2026):
  // telefone conferido na Inscrição nº 013 e no Atestado de Funcionalidade do CMAS de
  // Inhumas (23/10/2025); e-mail confirmado pelo Superintendente. O e-mail que consta
  // no CNEAS está desatualizado e NÃO deve ser usado.
  telefone: "(62) 3514-1743",
  telefoneLink: "tel:+556235141743",
  email: "fundacaofami2014@gmail.com",
} as const;
