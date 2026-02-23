# Cursor Mastery — Curso Interativo

## Sobre o Projeto

Plataforma de aprendizado interativo passo a passo para o Cursor (editor de codigo com IA). Os alunos navegam por modulos sequenciais com conteudo em markdown e perguntas de assimilacao ao final de cada modulo.

## Stack

- **Frontend:** React + TypeScript + Tailwind CSS + Shadcn UI
- **Backend:** Express.js + Node.js
- **Banco de Dados:** PostgreSQL com Drizzle ORM
- **Roteamento:** Wouter
- **Markdown:** react-markdown + remark-gfm
- **Animacoes:** framer-motion + canvas-confetti

## Estrutura

- `shared/schema.ts` — Tabelas: modules, questions
- `shared/routes.ts` — Contrato de API (GET /api/modules, GET /api/modules/:slug)
- `server/routes.ts` — Rotas Express + funcao de seed com conteudo completo do curso
- `server/storage.ts` — Camada de acesso ao banco (DatabaseStorage)
- `server/db.ts` — Conexao com PostgreSQL
- `client/src/pages/` — Home, ModulePage, Completion
- `client/src/components/` — AppSidebar, MarkdownRenderer, QuizSection

## Funcionalidades

- 11 modulos cobrindo Cursor do basico ao avancado
- 3 perguntas de assimilacao por modulo
- Sistema de progresso com localStorage (modulo bloqueado ate completar o anterior)
- Interface traduzida para portugues
- Tela de conclusao com confetti
- Conteudo baseado na documentacao oficial + Workshop do Rodrigo Silva

## Fontes de Conteudo

- Markdown files da documentacao oficial do Cursor (7 modulos originais)
- PDF "Workshop de Cursor — Do Basico ao Avancado" por Rodrigo Silva (4 modulos adicionais)
