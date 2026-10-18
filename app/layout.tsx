import type { Metadata, Viewport } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import type { ReactNode } from "react";
import { Cabecalho } from "@/components/Cabecalho";
import { Rodape } from "@/components/Rodape";
import { ambiente } from "@/lib/ambiente";
import "./globals.css";

// next/font baixa as fontes NO BUILD e as serve do próprio site.
// O navegador do visitante não faz nenhuma requisição ao Google.
const fonteTitulo = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--fonte-titulo",
});
const fonteTexto = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  variable: "--fonte-texto",
});

export const metadata: Metadata = {
  title: {
    default: "FAMI — Inhumas, Goiás",
    template: "%s · FAMI",
  },
  description:
    "FAMI: organização da sociedade civil fundada em 1993 em Inhumas (GO), com atuação em Goiás e no Tocantins.",
  // Enquanto o site está em pré-visualização, nada é indexado.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#550000",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const emPreview = ambiente() !== "production";
  return (
    <html lang="pt-BR" className={`${fonteTitulo.variable} ${fonteTexto.variable}`}>
      <body>
        <a href="#conteudo" className="pular">
          Pular para o conteúdo
        </a>
        {emPreview && (
          <div className="faixa-preview" role="note">
            Pré-visualização do site novo da FAMI. Os marcadores <strong>PENDENTE</strong> indicam
            dados ainda não confirmados.
          </div>
        )}
        <Cabecalho />
        <main id="conteudo" tabIndex={-1}>
          {children}
        </main>
        <Rodape />
      </body>
    </html>
  );
}
