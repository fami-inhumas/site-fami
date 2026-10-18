# Desenho Técnico — Site Novo da FAMI

Oct 17, 2026 · @Thiago Lourenço Côrte

Versão para revisão. Consolida as decisões de 17/10/2026 e a triagem da primeira revisão externa. Nada entra em produção sem APROVADO do Superintendente.

## 1. Escopo e fases

Site institucional novo, construído do zero, substituindo o WordPress atual só depois da aprovação final. Nenhum recurso do site depende do Google Workspace da FAMI.

| Fase | Entrega |
| --- | --- |
| 1 | Site institucional, conteúdo revisado e migrado, mapa, certificados, vagas, ouvidoria e doação por Pix estático |
| 2 | Painel de transparência alimentado por extrato aprovado do GestOSC |
| 3 | Área do Jovem Aprendiz com inscrição de jovens e de empresas |
| 4 | Doação recorrente por intermediador de pagamento |

**Onde a FAMI atua (mapa):** Inhumas (sede, Caminhar, Aprendiz, FAMI Service, Casa da Acolhida) e Rio Verde (CASER) em Goiás; Palmas, Araguatins, Augustinópolis, Dianópolis e Paraíso do Tocantins (Aprendiz, contrato de gestão com a UNITINS) no Tocantins.

**Regra do mapa:** endereço completo só da sede e da unidade de Palmas. Acolhimento institucional e atendimento socioeducativo aparecem só pela cidade. Palmeiras de Goiás e Damolândia são parceiros, não locais de atuação, e não entram no mapa; entram na transparência.

## 2. Arquitetura e requisitos transversais

- **Código:** Next.js, repositório próprio na organização `fami-inhumas` do GitHub, com verificação em duas etapas obrigatória e proteção da branch principal.
- **Hospedagem:** Vercel. Páginas públicas geradas de forma estática. Funções do servidor fixadas na região de São Paulo (`gru1`), para manter o processamento no Brasil.
- **Banco do site:** projeto Supabase **próprio**, na região de São Paulo, sem nenhuma credencial, administrador ou backup compartilhado com o GestOSC, o ERP Aprendiz ou o FAMI Service.
- **Gestão de conteúdo:** escolhida por demonstração com quem vai publicar. Requisitos: campos estruturados, publicação estática, nenhum script arbitrário no conteúdo, uploads restritos, papéis editoriais separados (quem edita notícia não altera dados bancários) e reversão de publicação.
- **Sem terceiros no navegador:** fontes hospedadas no próprio site, nenhum feed de rede social, nenhum mapa ou vídeo externo embutido. O mapa é desenho próprio.
- **Medição de acesso:** só agregada, sem cookies nem identificador persistente, e desligada nas páginas de ouvidoria e de formulários.
- **Acessibilidade:** WCAG 2.2 AA como critério de aceite, avaliada por ferramenta automática e por teste manual com teclado, leitor de tela e celular.
- **Identidade:** bordô `#550000`, fundo creme, títulos com serifa e texto sem serifa, com contraste conferido nos critérios WCAG.

## 3. Ouvidoria com cifra por rota

Objetivo: a FAMI opera o canal inteiro, sem contratar plataforma externa (decisão do Superintendente em 17/10/2026). A garantia oferecida é dupla: o acesso ao banco, por si só, não revela o conteúdo; e qualquer alteração do formulário pela gestão deixa rastro verificável pelo Conselho Fiscal. O desenho não impede que quem publica o site altere o formulário de envio; reduz esse risco e o torna detectável.

**Rotas e chaves.** Três rotas: Gente e Gestão, Controle Interno e Conselho Fiscal (relatos envolvendo a gestão). Cada rota tem um par de chaves gerado pelos próprios responsáveis da rota, fora do site. A chave pública fica publicada no site; a chave privada nunca sai do dispositivo dos responsáveis e é protegida por senha. Cada rota mantém uma cópia de segurança da chave privada com um segundo membro da própria rota, nunca com a gestão.

**Envio.** O relatante escolhe a matéria. O navegador dele cifra o texto e os anexos com a chave pública da rota correspondente, antes de qualquer envio. Os anexos têm metadados removidos no próprio navegador antes da cifra. O servidor recebe e guarda só o conteúdo cifrado, a rota, a data e um protocolo aleatório de 128 bits.

**Leitura fora do site.** Os responsáveis decifram os relatos em ferramenta instalada no próprio computador, sem conexão de rede durante a leitura, e nunca em página do site. A chave privada não é carregada por nenhum código servido pelo site. A ferramenta exibe o relato como texto puro, sem interpretar HTML, e abre anexos só em formatos limitados.

**Acompanhamento.** O relatante consulta a situação pelo protocolo e por uma senha que ele mesmo cria. A situação (recebido, em apuração, concluído) é registrada pelos responsáveis em campo não cifrado e não contém conteúdo do relato.

**Numeração sequencial.** Além do protocolo aleatório, cada relato recebe número sequencial. A ferramenta de leitura mostra a sequência completa; um número faltando indica relato apagado.

**Código aberto e conferência.** O repositório do site é público. Cada versão publicada é registrada com a impressão digital dos arquivos do formulário. O Conselho Fiscal usa ferramenta própria, fora do site, para comparar periodicamente o formulário no ar com a versão publicada; qualquer diferença é registrada e comunicada à Diretoria.

**Consulta em horário fixo.** Os responsáveis consultam a caixa em horários fixos, haja relato ou não. Não existe aviso disparado a cada relato.

**Anonimato real.** O site não grava IP junto do relato, não usa cookies nessas páginas e não registra o protocolo em endereço de página. O texto da página explica ao relatante os limites: o próprio conteúdo do relato pode identificá-lo.

**Proteção contra abuso.** No servidor: limites de tamanho, de anexos e de frequência, campo-armadilha acessível e desafio adicional só diante de sinais de abuso, sem exigir conta, telefone ou e-mail.

**Riscos aceitos.** Primeiro: se uma rota perder a chave privada e a cópia, os relatos daquela rota ficam ilegíveis para sempre. Segundo: quem publica o site pode alterar o formulário de envio; a conferência do Conselho Fiscal reduz esse risco e o torna detectável, mas não o elimina. Ambos aceitos pelo Superintendente em 17/10/2026.

## 4. Formulários do Aprendiz e de contato

- **Fluxos separados.** Ouvidoria, Aprendiz e contato não compartilham tabela, acesso nem rotina de descarte.
- **Inscrição do jovem.** Público de 14 a 23 anos, sem idade máxima para pessoa com deficiência. O formulário distingue inscrição de contratação. A base legal é definida por finalidade; a participação do responsável de menor de 18 anos se dá na contratação, por capacidade civil, e não como consentimento universal da LGPD.
- **Empresa interessada.** Formulário simples, sem dado de jovem.
- **Acesso e guarda.** Só a equipe do Aprendiz lê as inscrições, com registro de acesso. Prazo de descarte definido antes de entrar no ar.
- **Integração com o ERP Aprendiz.** Fora desta fase; de início o formulário só recebe e encaminha.
- **Enquadramento no ECA Digital (Lei 15.211/2025).** Verificar com o advogado antes da Fase 3.
- **Direitos do aprendiz.** Texto revisado pelo advogado antes da publicação.

## 5. Painel de transparência

**Campos por parceria (art. 11 da Lei 13.019/2014):** data de assinatura e identificação do instrumento e do órgão; nome e CNPJ da FAMI; objeto; valor total e valores liberados; data prevista e data de apresentação da prestação de contas, prazo de análise e resultado conclusivo; valor total da remuneração da equipe paga com a parceria, funções e remuneração prevista para cada função, sem nomes.

**Matriz por parceria:** cada instrumento registra a norma aplicável (MROSC, Organização Social estadual, regime federal), os campos e documentos exigidos, o responsável e a frequência de atualização. Parcerias federais exigem também estatuto, relação nominal de dirigentes e cópia integral dos instrumentos (Decreto 7.724/2012, art. 63). O rascunho da matriz já existe em documento próprio.

**Extrato do GestOSC:**

1. Lista explícita de campos permitidos; qualquer campo fora dela bloqueia a geração.
2. Validação do arquivo final antes da publicação.
3. Data de referência e histórico de aprovação em cada extrato.
4. Aprovação do Superintendente antes de publicar, e procedimento de correção quando houver erro.
5. O site não se conecta ao banco do GestOSC em nenhuma hipótese.

A peça que gera o extrato é construída no GestOSC pelo rito próprio da casa.

**Obrigação atual:** o art. 11 já vale hoje, no site e em local visível da sede. Não espera a Fase 2.

## 6. Doação por Pix

- **Conta:** conta bancária de recursos próprios da FAMI, separada de qualquer conta de parceria [conta a definir pelo Superintendente].
- **Na página:** QR Code estático, chave em texto para copiar (o Pix não depende só da imagem), razão social, CNPJ e banco recebedor, com orientação para o doador conferir o recebedor no aplicativo do banco.
- **Alteração dos dados bancários:** papel editorial próprio, com revisão por duas pessoas antes de publicar.
- **Monitoramento:** verificação automática diária de que a chave e o QR Code publicados continuam iguais aos aprovados, com alerta em caso de mudança.
- **Página clonada:** o domínio oficial é divulgado de forma consistente em todos os materiais, com procedimento para denunciar e retirar páginas falsas.
- **Conciliação e recibo:** todo crédito é conciliado no GestOSC antes da emissão de recibo; o recibo se vincula à transação. O site não promete dedução fiscal.

## 7. Conteúdo, migração e proteção de atendidos

- **Inventário antes de migrar:** todas as páginas, PDFs, imagens e endereços antigos do site atual, com destino definido para cada um. Conteúdo equivalente recebe redirecionamento permanente (301); nada é redirecionado em massa para a página inicial.
- **Nada migra sem revisão.** Saem números inconsistentes, editais revogados, links quebrados e erros de digitação.
- **Números de impacto:** publicados por programa, cada um com período, definição, fonte e responsável; o total é a soma dos programas. Nenhum número entra antes de fechar.
- **Processos seletivos encerrados:** página histórica com os atos e a situação final; documentos com nome de candidatos só enquanto a publicação for necessária, em versão minimizada. Originais ficam guardados internamente.
- **Socioeducação (ECA, art. 143) e acolhimento:** revisão editorial de segurança antes de publicar qualquer foto, legenda, notícia ou documento dessas unidades. Rosto coberto não basta; fachada, uniforme, legenda e contexto também identificam. Metadados de localização são removidos de todas as imagens.
- **Documentos que não vão ao site:** relatório do CNEAS (traz endereço do acolhimento) e alvarás (trazem dados do representante legal).
- **Fotos:** reais, com autorização de uso de imagem; nunca imagem gerada por IA representando atendidos.

## 8. Operação, DNS e incidente anterior

- **Troca do DNS:** o domínio `fami.org.br` também atende o e-mail institucional. Antes de apontar o site para a Vercel: inventário de todos os registros (e-mail, verificações, subdomínios, certificados), mudança só do registro do site e plano de retorno testado.
- **Incidente do site antigo:** resgatar os logs da hospedagem e as evidências antes de qualquer cancelamento; abrir o registro interno do incidente, guardado por 5 anos; avaliar se houve dado pessoal afetado. A limpeza do spam não encerra o incidente.
- **Fornecedores:** Vercel, Supabase e o serviço de gestão de conteúdo listados com papel, subprocessadores, região dos dados, exclusão e exportação. Havendo dado fora do Brasil, mecanismo da Resolução ANPD 19/2024.
- **Manutenção:** responsável nomeado pela publicação e pelas atualizações; dependências com versão fixa e revisadas; verificação em duas etapas em todas as contas administrativas.
- **Resposta a incidente:** procedimento escrito para incidente com dado pessoal, com avaliação de comunicação à ANPD e aos titulares.

## 9. Decisões em aberto

| Decisão | Quem decide | Bloqueia |
| --- | --- | --- |
| Responsáveis de cada rota da ouvidoria e quem guarda a cópia de cada chave | Diretoria | Fase 1 (ouvidoria) |
| Canal do aviso de novo relato (e-mail ou WhatsApp, sempre sem conteúdo) | Superintendente | Fase 1 (ouvidoria) |
| Conta de recursos próprios para doação | Superintendente | Fase 1 (Pix) |
| Ferramenta de gestão de conteúdo, após demonstração | Superintendente e quem publica | Fase 1 |
| Números de atendidos por programa | Gente e Gestão | Página inicial |
| CEBAS: número e validade | Superintendente | Faixa de certificados |
| Prazo de descarte das inscrições do Aprendiz | Superintendente e advogado | Fase 3 |
| Enquadramento no ECA Digital | Advogado | Fase 3 |
