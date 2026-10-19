import { pendente } from "./pendente";

// Conteúdo que depende do inventário e da revisão do site atual
// (desenho técnico, seção 7: "nada migra sem revisão").

export const noticias = pendente(
  "Notícias revisadas para migração (CASER e acolhimento passam pela revisão do ECA art. 143)",
  "Superintendente"
);

export const vagas = pendente(
  "Vagas e processos seletivos abertos, e página histórica dos encerrados",
  "Gente e Gestão"
);

export const historias = pendente(
  "Histórias com fotos reais e autorização de uso de imagem",
  "Gente e Gestão"
);

// Texto conferido pelo Superintendente (Thiago, 19/10/2026).
export const textoHistoria: readonly string[] = [
  "A Fundação de Assistência ao Menor Inhumense nasceu em 15 de julho de 1993, com o apoio da comunidade católica de Inhumas, para oferecer a meninos e meninas do município oportunidades de esporte, cultura e convivência que nem todos tinham.",
  "Ainda em 1993, foi declarada de utilidade pública pelo Município (Lei nº 2.225, de 26 de novembro de 1993) e, no ano seguinte, pelo Estado de Goiás (Lei nº 12.343, de 25 de abril de 1994).",
  "Com o tempo, a atuação se ampliou. Hoje a FAMI reúne o Programa Caminhar, a aprendizagem profissional, o acolhimento institucional, o atendimento socioeducativo em parceria com o Governo de Goiás e o FAMI Service, com presença em Goiás e no Tocantins. O propósito continua o mesmo: formar cidadãos conscientes dos seus direitos e preparados para exercê-los.",
];

export const estatuto = pendente("Estatuto vigente em PDF para publicação", "Superintendente");

export const parceiros = pendente(
  "Lista de parceiros autorizados a aparecer no site",
  "Superintendente"
);

export const textoDireitosAprendiz = pendente(
  "Texto dos direitos do aprendiz revisado pelo advogado",
  "Advogado"
);

export const contaDoacao = pendente(
  "Conta de recursos próprios para doação por Pix",
  "Superintendente"
);

export const responsaveisOuvidoria = pendente(
  "Responsáveis de cada rota da ouvidoria e guarda da cópia das chaves",
  "Diretoria"
);

export const encarregadoDados = pendente(
  "Encarregado de dados (LGPD) e canal de contato",
  "Diretoria"
);
