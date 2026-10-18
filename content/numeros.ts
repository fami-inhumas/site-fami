import { pendente, type Talvez } from "./pendente";
import type { Programa } from "./unidades";

// Números de impacto (desenho técnico, seção 7):
// publicados POR PROGRAMA, cada um com período, definição, fonte e responsável;
// o total é a soma dos programas. Nenhum número entra antes de fechar.
//
// Quando o número for confirmado, troca-se o `pendente(...)` por um objeto
// NumeroConfirmado completo — o tipo obriga a informar fonte e período.

export type NumeroConfirmado = {
  valor: number;
  definicao: string;
  periodo: string;
  fonte: string;
  responsavel: string;
};

export type NumeroDePrograma = {
  programa: Programa;
  numero: Talvez<NumeroConfirmado>;
};

export const numerosDeImpacto: NumeroDePrograma[] = [
  { programa: "Jovem Aprendiz", numero: pendente("Jovens atendidos no Jovem Aprendiz (com período e fonte)", "Gente e Gestão") },
  { programa: "Caminhar", numero: pendente("Atendidos no Caminhar (com período e fonte)", "Gente e Gestão") },
  { programa: "FAMI Service", numero: pendente("Atendidos no FAMI Service (com período e fonte)", "Gente e Gestão") },
  { programa: "Casa da Acolhida", numero: pendente("Acolhidos na Casa da Acolhida (com período e fonte)", "Gente e Gestão") },
  { programa: "CASER", numero: pendente("Adolescentes atendidos no CASER (com período e fonte)", "Gente e Gestão") },
];
