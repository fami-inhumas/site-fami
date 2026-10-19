// Onde a FAMI atua — dados do mapa (desenho técnico, seção 1; pedido da Fase 1).
//
// REGRA DE PROTEÇÃO (ECA art. 143 e acolhimento):
// acolhimento institucional e atendimento socioeducativo aparecem SÓ pela cidade.
// O tipo abaixo impede, na compilação, que uma cidade "so-cidade" receba endereço:
// o campo `endereco` simplesmente não existe nessa variante.
//
// Não há latitude/longitude neste repositório. `x` e `y` são posições num desenho
// esquemático sem escala (calculadas uma vez a partir do centro da CIDADE e
// arredondadas de 5 em 5), nunca a posição de uma unidade.

export type Programa =
  | "Caminhar"
  | "Jovem Aprendiz"
  | "FAMI Service"
  | "Casa da Acolhida"
  | "CASER";

type Base = {
  id: string;
  cidade: string;
  uf: "GO" | "TO";
  programas: Programa[];
  /** Posição esquemática no desenho do mapa. */
  x: number;
  y: number;
  observacao?: string;
};

export type CidadeComEndereco = Base & {
  tipo: "endereco-publico";
  /** Qual unidade este endereço identifica (sede ou unidade de Palmas). */
  unidadeDoEndereco: string;
  endereco: string;
};

export type CidadeSemEndereco = Base & {
  tipo: "so-cidade";
};

export type Cidade = CidadeComEndereco | CidadeSemEndereco;

export const cidades: Cidade[] = [
  {
    id: "inhumas",
    tipo: "endereco-publico",
    cidade: "Inhumas",
    uf: "GO",
    unidadeDoEndereco: "Sede administrativa",
    endereco: "Rua da Saudade, Qd. 135, Lt. 19, Centro",
    programas: ["Caminhar", "Jovem Aprendiz", "FAMI Service", "Casa da Acolhida"],
    observacao:
      "O endereço é o da sede administrativa. Os programas de acolhimento não têm endereço divulgado. A unidade de Inhumas atende também o Jovem Aprendiz de Goianira e Itauçu.",
    x: 225,
    y: 595,
  },
  {
    id: "goianira",
    tipo: "so-cidade",
    cidade: "Goianira",
    uf: "GO",
    programas: ["Jovem Aprendiz"],
    observacao: "Atendimento pela unidade de Inhumas.",
    // Esquemático: a sudeste de Inhumas, afastado o bastante para os marcadores não se tocarem.
    x: 255,
    y: 625,
  },
  {
    id: "itaucu",
    tipo: "so-cidade",
    cidade: "Itauçu",
    uf: "GO",
    programas: ["Jovem Aprendiz"],
    observacao: "Atendimento pela unidade de Inhumas.",
    // Esquemático: a noroeste de Inhumas.
    x: 195,
    y: 565,
  },
  {
    id: "rio-verde",
    tipo: "so-cidade",
    cidade: "Rio Verde",
    uf: "GO",
    programas: ["CASER"],
    x: 155,
    y: 665,
  },
  {
    id: "palmas",
    tipo: "endereco-publico",
    cidade: "Palmas",
    uf: "TO",
    unidadeDoEndereco: "Unidade de Palmas",
    endereco: "204 Sul, Av. NS 4, Centro, Espaço 21, Sala 09",
    programas: ["Jovem Aprendiz"],
    observacao: "Contrato de gestão com a UNITINS.",
    x: 285,
    y: 285,
  },
  {
    id: "araguatins",
    tipo: "so-cidade",
    cidade: "Araguatins",
    uf: "TO",
    programas: ["Jovem Aprendiz"],
    observacao: "Atendimento pela unidade de Palmas.",
    x: 282,
    y: 78,
  },
  {
    id: "augustinopolis",
    tipo: "so-cidade",
    cidade: "Augustinópolis",
    uf: "TO",
    programas: ["Jovem Aprendiz"],
    observacao: "Atendimento pela unidade de Palmas.",
    x: 310,
    y: 58,
  },
  {
    id: "dianopolis",
    tipo: "so-cidade",
    cidade: "Dianópolis",
    uf: "TO",
    programas: ["Jovem Aprendiz"],
    observacao: "Atendimento pela unidade de Palmas.",
    x: 360,
    y: 355,
  },
  {
    id: "paraiso",
    tipo: "so-cidade",
    cidade: "Paraíso do Tocantins",
    uf: "TO",
    programas: ["Jovem Aprendiz"],
    observacao: "Atendimento pela unidade de Palmas.",
    x: 255,
    y: 285,
  },
];

// Contornos esquemáticos dos estados (simplificados, sem escala).
export const contornoTocantins =
  "280,35 330,50 320,100 335,140 375,175 400,225 410,290 385,315 410,350 395,395 380,420 325,425 275,435 230,420 190,415 180,350 170,275 190,225 225,175 240,125 265,75";
export const contornoGoias =
  "190,415 230,420 275,435 325,425 380,420 395,445 405,500 370,535 335,550 335,575 335,625 310,655 285,690 240,700 190,720 155,740 125,735 85,710 50,685 40,645 70,600 90,555 135,510 160,465";
