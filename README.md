# Cursor Mastery

Plataforma de aprendizado interativo passo a passo para o Cursor (editor de código com IA). Os alunos navegam por módulos sequenciais com conteúdo em markdown e perguntas de assimilação ao final de cada módulo.

## Funcionalidades

- 11 módulos cobrindo Cursor do básico ao avançado
- 3 perguntas de assimilação por módulo
- Sistema de progresso com localStorage (módulo bloqueado até completar o anterior)
- Interface traduzida para português
- Tela de conclusão com confetti

## Stack Tecnológica

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Shadcn UI (Radix UI)
- Wouter (roteamento)
- TanStack React Query
- react-markdown + remark-gfm
- Framer Motion + canvas-confetti (animações)

### Backend
- Node.js
- Express.js 5
- PostgreSQL
- Drizzle ORM

### Build & Dev
- Vite
- tsx

## Estrutura de Pastas

```
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/     # AppSidebar
│   │   │   ├── module/     # MarkdownRenderer, QuizSection
│   │   │   └── ui/         # Componentes Shadcn UI
│   │   ├── hooks/          # Custom hooks
│   │   ├── lib/            # Utilitários e configurações
│   │   ├── pages/          # Home, ModulePage, Completion
│   │   └── App.tsx
│   └── index.html
├── server/                 # Backend Express
│   ├── db.ts               # Conexão PostgreSQL
│   ├── index.ts            # Servidor Express
│   ├── routes.ts           # Rotas da API + seed do banco
│   ├── storage.ts          # Camada de acesso ao banco
│   ├── static.ts           # Servir arquivos estáticos (produção)
│   └── vite.ts             # Configuração Vite (desenvolvimento)
├── shared/                 # Código compartilhado
│   ├── schema.ts           # Tabelas: modules, questions
│   └── routes.ts           # Contrato de API
├── script/
│   └── build.ts            # Script de build
├── attached_assets/        # Arquivos markdown de documentação
├── drizzle.config.ts       # Configuração Drizzle
├── tailwind.config.ts      # Configuração Tailwind
├── vite.config.ts          # Configuração Vite
├── tsconfig.json           # Configuração TypeScript
└── package.json
```

## Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd rest-express
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente (veja seção abaixo).

4. Sincronize o schema do banco de dados:
```bash
npm run db:push
```

## Variáveis de Ambiente

| Variável | Descrição |
|----------|-----------|
| `DATABASE_URL` | URL de conexão PostgreSQL |
| `PORT` | Porta do servidor (padrão: 5000) |
| `NODE_ENV` | Ambiente (`development` ou `production`) |

## Executando

### Desenvolvimento

```bash
npm run dev
```

O servidor inicia em modo de desenvolvimento com hot reload via Vite.

### Produção

```bash
npm run build
npm start
```

### Outros Comandos

| Comando | Descrição |
|---------|-----------|
| `npm run check` | Verificação de tipos TypeScript |
| `npm run db:push` | Sincroniza schema com o banco de dados |

## API

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/modules` | Lista todos os módulos |
| GET | `/api/modules/:slug` | Retorna um módulo com suas perguntas |

## Licença

MIT
