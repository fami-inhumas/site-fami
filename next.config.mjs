// Configuração do site da FAMI.
//
// O site é gerado como HTML estático puro (output: "export") e servido pela Vercel
// como arquivos estáticos. Motivo: o Next.js coloca scripts inline na página para
// hidratar o React, e uma CSP estrita bloqueia esses scripts. Como a Fase 1 não tem
// nenhuma interação que dependa de JavaScript, scripts/pos-build.mjs retira os
// scripts do HTML e a CSP proíbe qualquer script (script-src 'none').
//
// Cabeçalhos de segurança e CSP: vercel.json (fonte única).
// Servidor local que aplica os mesmos cabeçalhos: scripts/servidor-local.mjs.

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: false,
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    // Sem otimizador remoto: só imagens do próprio repositório.
    unoptimized: true,
  },
};

export default nextConfig;
