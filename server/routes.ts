import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get(api.modules.list.path, async (req, res) => {
    try {
      const modules = await storage.getModules();
      res.json(modules);
    } catch (e) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  app.get(api.modules.get.path, async (req, res) => {
    try {
      const module = await storage.getModuleBySlug(req.params.slug);
      if (!module) {
        return res.status(404).json({ message: "Module not found" });
      }
      const moduleQuestions = await storage.getQuestionsForModule(module.id);
      res.json({ ...module, questions: moduleQuestions });
    } catch (e) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  try {
    const existingModules = await storage.getModules();
    if (existingModules.length > 0) return;

    const modulesData = [
      {
        slug: "inicio-rapido",
        title: "Inicio Rapido",
        order: 1,
        content: `# Modulo 1 — Inicio rapido

Baseado em: [Quickstart | Cursor Docs](https://cursor.com/docs/get-started/quickstart)

---

## Objetivo

Ao final deste modulo voce sabera: planejar com o Agent, gerenciar contexto, e iterar no codigo com IA.

[Baixar o Cursor](https://cursor.com/downloads)

---

## 1. Comecar com o Agent

Abra o painel do **Agent** com **Cmd+I** (Mac) ou **Ctrl+I** (Windows/Linux).

O Agent executa tarefas de codigo de forma autonoma: busca no codebase, edita arquivos e roda comandos no terminal.

### Experimente

Pergunte: **"Como este projeto funciona?"**

O Agent explora o codebase, le arquivos relevantes e explica a arquitetura — uma das formas mais rapidas de entender um codigo novo.

---

## 2. Planejar antes de codar

Uma das mudancas mais impactantes e **planejar antes de codar**.

Pressione **Shift+Tab** na entrada do Agent para ativar o **Modo Plano**. Em vez de comecar a escrever codigo, o Agent vai:

1. Esperar sua aprovacao antes de implementar
2. Criar um plano de implementacao detalhado
3. Fazer perguntas para clarificar requisitos
4. Pesquisar o codebase para achar arquivos relevantes

Use **"Save to workspace"** para salvar planos em \`.cursor/plans/\`. Isso gera documentacao para o time e contexto para trabalho futuro.

**Pratica:** Peca ao Agent para "adicionar uma nova feature" no Modo Plano. Revise o plano, ajuste se precisar e depois clique para construir.

---

## 3. Deixar o Agent achar o contexto

Nao e necessario marcar manualmente cada arquivo no prompt.

O Agent tem busca semantica e puxa contexto sob demanda. Se voce perguntar sobre "o fluxo de autenticacao", ele encontra os arquivos certos mesmo sem voce citar nomes exatos.

- **Regra simples:** se voce sabe o arquivo exato, use \`@\` para menciona-lo. Se nao souber, deixe o Agent encontrar. Incluir arquivos irrelevantes pode confundir o Agent.

---

## 4. Escrever prompts especificos

A taxa de sucesso do Agent melhora muito com instrucoes especificas.

| Vago | Especifico |
|------|------------|
| "adicionar testes para auth.ts" | "Escreva um caso de teste para auth.ts cobrindo o edge case de logout, usando os padroes em \`__tests__/\` e evitando mocks" |
| "corrigir o bug" | "O formulario de login envia duas vezes ao clicar no botao. Encontre a causa e corrija" |

Seja explicito, cite padroes existentes e descreva o resultado esperado.

---

## 5. Saber quando comecar de novo

Conversas muito longas podem fazer o Agent perder foco. **Comece uma nova conversa quando:**

- Terminou uma unidade logica de trabalho
- O Agent parece confuso ou repete os mesmos erros
- Voce esta mudando de tarefa ou feature

**Continue a conversa quando:**

- Esta depurando algo que ele acabou de construir
- O Agent precisa de contexto de mensagens anteriores
- Esta iterando na mesma feature

Use **@Past Chats** para referenciar conversas antigas em novas sessoes em vez de colar discussoes inteiras.

---

## 6. Revisar e iterar

Acompanhe o trabalho do Agent. A **visao de diff** mostra as mudancas em tempo real. Se ele estiver indo na direcao errada, pressione **Escape** para interromper e redirecionar.

Depois que o Agent terminar, use **Review -> Find Issues** para uma passada de revisao que analisa as edicoes e aponta possiveis problemas.

Codigo gerado por IA pode parecer correto e ter erros sutis. Leia os diffs com atencao.

---

## 7. Dar metas verificaveis

Agents performam melhor com alvos claros:

- Configure linters para pegar estilo e qualidade automaticamente
- Escreva testes para o Agent rodar e iterar ate passar
- Use linguagens tipadas para feedback imediato do type checker

**Fluxo sugerido:** peca ao Agent para escrever os testes primeiro, confirme que falham, depois peca a implementacao que faca os testes passarem.`,
        questions: [
          {
            questionText: "Qual atalho abre o painel do Agent no Cursor?",
            options: ["Ctrl+P", "Ctrl+I / Cmd+I", "Ctrl+K", "Ctrl+Shift+P"],
            correctOptionIndex: 1,
            explanation: "O Agent e aberto com Cmd+I (Mac) ou Ctrl+I (Windows/Linux). Esse e o atalho principal para interagir com a IA."
          },
          {
            questionText: "Qual atalho ativa o Modo Plano (Plan Mode) no Agent?",
            options: ["Ctrl+P", "Cmd+I / Ctrl+I", "Shift+Tab", "Alt+F4"],
            correctOptionIndex: 2,
            explanation: "Pressione Shift+Tab na entrada do Agent para ativar o Modo Plano, onde ele planeja antes de codar."
          },
          {
            questionText: "Quando e recomendado comecar uma nova conversa com o Agent?",
            options: ["A cada 5 minutos", "Quando voce quiser mudar a cor do editor", "Quando uma unidade logica de trabalho terminou ou o Agent esta confuso", "Apenas no dia seguinte"],
            correctOptionIndex: 2,
            explanation: "Conversas longas podem fazer o Agent perder o foco. Comece uma nova conversa a cada nova feature ou quando ele repetir erros."
          }
        ]
      },
      {
        slug: "agent",
        title: "Cursor Agent",
        order: 2,
        content: `# Modulo 2 — Cursor Agent

Baseado em: [Agent Overview | Cursor Docs](https://cursor.com/docs/agent/overview)

---

## O que e o Agent

O **Agent** e o assistente do Cursor que executa tarefas de codigo de forma autonoma: edita arquivos, roda comandos no terminal e busca no codebase. Acesso pelo painel lateral com **Cmd+I** (Mac) ou **Ctrl+I** (Windows/Linux).

---

## Como o Agent funciona

O agent e baseado em tres componentes:

1. **Mensagens do usuario** — seus prompts e follow-ups que direcionam o trabalho
2. **Ferramentas (Tools)** — edicao de arquivos, busca no codebase, terminal e outras
3. **Instrucoes** — system prompt e regras que guiam o comportamento

O Agent do Cursor orquestra isso para cada modelo suportado, ajustando instrucoes e ferramentas por modelo.

---

## Ferramentas (Tools)

As ferramentas sao os blocos de construcao do Agent:

| Ferramenta | Funcao |
|------------|--------|
| **Semantic search** | Busca por significado no codebase |
| **Search files and folders** | Busca por arquivos e pastas |
| **Web** | Busca na web |
| **Fetch Rules** | Carrega regras do projeto |
| **Read files** | Le arquivos |
| **Edit files** | Edita arquivos |
| **Run shell commands** | Executa comandos no terminal |
| **Browser** | Navegacao em browser |
| **Image generation** | Geracao de imagens |
| **Ask questions** | Faz perguntas ao usuario |

Nao ha limite no numero de chamadas de ferramentas que o Agent pode fazer em uma tarefa.

---

## Quatro Modos do Agent

| Modo | Atalho | Descricao |
|------|--------|-----------|
| **Agent Mode** | Ctrl+I | Modo padrao. Explora o codebase, edita multiplos arquivos, executa comandos no terminal. Ideal para tarefas complexas e refatoracao. |
| **Ask Mode** | Select "Ask" | Somente leitura. Busca no codebase e responde perguntas sem fazer nenhuma alteracao. Perfeito para entender codigo. |
| **Plan Mode** | Shift+Tab | Planejamento estrategico. Cria um plano detalhado revisavel antes de escrever qualquer codigo. Essencial para features grandes. |
| **Debug Mode** | Ctrl+. | Caca-bugs avancada. Gera hipoteses, adiciona logs, analisa execucao em runtime e propoe correcoes. |

---

## Checkpoints

**Checkpoints** sao snapshots automaticos das alteracoes do Agent no codebase, permitindo desfazer mudancas se necessario.

- Restaure pelo botao **"Restore Checkpoint"** em uma requisicao anterior.
- Checkpoints sao locais e separados do Git. Use-os para desfazer alteracoes do Agent; use Git para controle de versao permanente.

---

## Mensagens na fila (Queued messages)

Voce pode enfileirar mensagens de follow-up enquanto o Agent esta trabalhando.

### Atalhos com o Agent trabalhando

| Acao | Atalho |
|------|--------|
| Enviar imediatamente (furar a fila) | **Cmd+Enter** (Mac) / **Ctrl+Enter** (Windows) |
| Enfileirar mensagem | **Enter** (espera o Agent terminar a tarefa atual) |

### Mensagem imediata

Com **Cmd+Enter** / **Ctrl+Enter**, a mensagem e processada na hora, sem esperar na fila. Use quando precisar interromper ou redirecionar o trabalho atual.

---

## Exportar e compartilhar

- **Exportar:** menu de contexto -> "Export Chat" para exportar em markdown.
- **Compartilhar:** envie como link somente leitura; quem recebe pode visualizar e fazer fork.
- Compartilhamento exige plano pago. Segredos sao ofuscados; em Privacy Mode o compartilhamento fica desativado.`,
        questions: [
          {
            questionText: "O que sao Checkpoints no Cursor?",
            options: ["Uma forma de salvar um jogo", "Branches do Git", "Snapshots automaticos das alteracoes do Agent", "Backups externos na nuvem"],
            correctOptionIndex: 2,
            explanation: "Checkpoints permitem desfazer mudancas do Agent. Eles sao locais e separados do Git."
          },
          {
            questionText: "Qual modo do Agent e ideal para entender um codigo sem modifica-lo?",
            options: ["Agent Mode", "Ask Mode", "Plan Mode", "Debug Mode"],
            correctOptionIndex: 1,
            explanation: "O Ask Mode e somente leitura: o Agent busca no codebase e responde perguntas sem fazer nenhuma alteracao."
          },
          {
            questionText: "Qual atalho envia uma mensagem imediatamente, furando a fila do Agent?",
            options: ["Enter", "Shift+Enter", "Ctrl+Enter / Cmd+Enter", "Escape"],
            correctOptionIndex: 2,
            explanation: "Com Ctrl+Enter (Windows) ou Cmd+Enter (Mac), a mensagem e processada na hora sem esperar na fila."
          }
        ]
      },
      {
        slug: "regras-contexto",
        title: "Regras e Contexto",
        order: 3,
        content: `# Modulo 3 — Regras e Contexto

Baseado em: [Rules | Cursor Docs](https://cursor.com/docs/context/rules)

---

## O que sao Rules

**Rules** sao instrucoes em nivel de sistema para o Agent. Elas agrupam prompts, scripts e fluxos, facilitando gerenciar e compartilhar padroes no time.

O Cursor suporta quatro tipos de regras:

| Tipo | Onde ficam | Escopo |
|------|------------|--------|
| **Project Rules** | \`.cursor/rules\` | Codebase (versionado) |
| **User Rules** | Configuracoes do Cursor | Global (seu ambiente) |
| **Team Rules** | Dashboard | Time (planos Team e Enterprise) |
| **AGENTS.md** | Raiz do projeto | Instrucoes em markdown simples |

**Ordem de precedencia:** Team Rules > Project Rules > User Rules

---

## Como as regras funcionam

Modelos de linguagem nao mantem memoria entre completions. As regras fornecem **contexto persistente e reutilizavel** no nivel do prompt.

Quando aplicadas, o conteudo da regra e incluido no inicio do contexto do modelo, dando a IA orientacao consistente.

---

## Project Rules

Ficam em **\`.cursor/rules\`** como arquivos markdown (.md ou .mdc) e sao versionados.

### Tipos de regra

| Tipo | Comportamento |
|------|----------------|
| **Always Apply** | Aplicada em toda sessao de chat |
| **Apply Intelligently** | Quando o Agent achar relevante (baseado na description) |
| **Apply to Specific Files** | Quando o arquivo bate com o padrao (globs) |
| **Apply Manually** | Quando @-mencionada no chat |

### Exemplo de anatomia de regra (.mdc)

\`\`\`yaml
---
globs: ["**/services/*.ts"]
alwaysApply: false
---

- Use nosso padrao RPC interno ao definir servicos
- Use sempre snake_case para nomes de servicos.
\`\`\`

### Criar uma regra

- Comando: **"New Cursor Rule"**
- Ou: **Cursor Settings > Rules, Commands**

---

## Boas praticas para regras

- **Referencie arquivos** em vez de copiar o conteudo.
- Reaproveite regras quando repetir os mesmos prompts no chat.
- Evite orientacoes vagas; escreva como documentacao interna clara.
- Inclua exemplos concretos ou arquivos de referencia.
- Divida regras grandes em varias regras menores e composáveis.
- Mantenha regras com menos de ~500 linhas.
- Versionar regras no Git beneficia todo o time.

---

## AGENTS.md

Arquivo markdown simples na **raiz do projeto** como alternativa leve a \`.cursor/rules\`.

\`\`\`markdown
# Instrucoes do Projeto

## Estilo de codigo
- Use TypeScript em arquivos novos
- Prefira componentes funcionais em React
- snake_case para colunas no banco

## Arquitetura
- Padrao de repositorio
- Logica de negocio em camadas de servico
\`\`\`

---

## User Rules

Definidas em **Cursor Settings > Rules**, aplicam-se em **todos os projetos**. Uteis para estilo de resposta ou convencoes pessoais:

\`\`\`
Responda de forma concisa. Evite repeticao desnecessaria.
\`\`\``,
        questions: [
          {
            questionText: "Onde ficam armazenadas as Project Rules?",
            options: ["No arquivo package.json", "Na pasta .cursor/rules", "Nas configuracoes globais do usuario", "Em um banco de dados externo"],
            correctOptionIndex: 1,
            explanation: "As Project Rules ficam em .cursor/rules e devem ser versionadas com o codigo."
          },
          {
            questionText: "Qual e a ordem de precedencia das regras no Cursor?",
            options: ["User Rules > Project Rules > Team Rules", "Project Rules > Team Rules > User Rules", "Team Rules > Project Rules > User Rules", "Todas tem a mesma prioridade"],
            correctOptionIndex: 2,
            explanation: "Em caso de conflito, a ordem e: Team Rules > Project Rules > User Rules. A fonte que vem primeiro prevalece."
          },
          {
            questionText: "O que e o arquivo AGENTS.md?",
            options: ["Um arquivo de configuracao do Node.js", "Uma alternativa leve as Project Rules, em markdown simples na raiz do projeto", "Um log de erros do Agent", "Um arquivo de testes"],
            correctOptionIndex: 1,
            explanation: "AGENTS.md e um arquivo markdown simples na raiz do projeto como alternativa leve as Project Rules."
          }
        ]
      },
      {
        slug: "contexto-mentions",
        title: "Contexto e @ Mentions",
        order: 4,
        content: `# Modulo 4 — Contexto e @ Mentions

Baseado no Workshop de Cursor e na documentacao oficial.

---

## O Contexto e o Combustivel da IA

O contexto e a informacao que voce fornece ao Agent para que ele entenda o que precisa fazer. Quanto mais preciso o contexto, melhor o resultado.

---

## @ Mentions — Tipos de Referencia

Use **@** no chat para incluir contexto no prompt:

### @Files & Folders

Referencie arquivos inteiros ou pastas completas para dar visibilidade total ao Agent.

\`\`\`
@src/auth.ts
\`\`\`

Voce tambem pode arrastar arquivos da sidebar diretamente para o chat.

### @Code

Referencie trechos especificos de codigo (funcoes, classes) para controle granular.

Selecione o codigo no editor e clique "Add to Chat".

### @Docs

Integre documentacoes oficiais de bibliotecas ou adicione suas proprias docs customizadas.

\`\`\`
@Docs -> "Add new doc" -> Cole a URL
\`\`\`

### @Past Chats

Reutilize o contexto de conversas anteriores para continuar trabalhos em andamento.

Selecione a conversa na lista de chats anteriores.

### @Codebase

Deixe o Agent buscar semanticamente no codebase inteiro.

---

## Regra de Ouro do Contexto

> Se voce **sabe o arquivo exato**, use \`@\` para economizar tempo.
> Se **nao souber**, descreva o que precisa e deixe o Agent encontrar usando busca semantica.
> **Evite** anexar muitos arquivos irrelevantes; isso pode confundir o Agent.

---

## Resumo de mensagens

Quando a conversa fica longa, o Cursor resume e gerencia o contexto automaticamente.

### Comando /summarize

Use o comando **/summarize** no chat para disparar o resumo manualmente e liberar contexto quando a conversa estiver muito longa.

### Comando /compress

Alternativa ao /summarize para comprimir a conversa e liberar espaco no contexto.`,
        questions: [
          {
            questionText: "Qual @ mention voce usaria para referenciar um arquivo especifico no chat?",
            options: ["@Docs", "@Past Chats", "@Files (ex: @src/auth.ts)", "@Codebase"],
            correctOptionIndex: 2,
            explanation: "Use @Files para referenciar arquivos inteiros. Basta digitar @ seguido do caminho do arquivo, como @src/auth.ts."
          },
          {
            questionText: "O que acontece quando voce usa @Codebase no chat?",
            options: ["O Agent apaga o codebase", "O Agent faz uma busca semantica em todo o projeto", "O Agent cria um backup", "O Agent compila o projeto"],
            correctOptionIndex: 1,
            explanation: "@Codebase permite que o Agent busque semanticamente no codebase inteiro para encontrar arquivos e trechos relevantes."
          },
          {
            questionText: "Quando e melhor NAO usar @ mentions?",
            options: ["Quando voce sabe exatamente qual arquivo referenciar", "Quando voce quer incluir muitos arquivos irrelevantes", "Quando voce quer acelerar a resposta", "Quando o arquivo e muito pequeno"],
            correctOptionIndex: 1,
            explanation: "Incluir muitos arquivos irrelevantes pode confundir o Agent. Use @ apenas quando souber o arquivo exato."
          }
        ]
      },
      {
        slug: "modelos",
        title: "Modelos de IA",
        order: 5,
        content: `# Modulo 5 — Modelos de IA

Baseado em: [Models | Cursor Docs](https://cursor.com/docs/models)

---

## Visao geral

O Cursor suporta **modelos de ponta** de todos os principais provedores para codificacao:

- **Claude 4.6** (Opus, Sonnet)
- **GPT-5.2**, **GPT-5.3 Codex**
- **Gemini 3** (Flash, Pro)
- **Grok Code**

Cada modelo tem **contexto padrao** (ex.: ~200k tokens) e, quando disponivel, **modo maximo** (ex.: 1M tokens). As capacidades e precos variam por modelo.

---

## Precos dos modelos

Os planos do Cursor incluem uso cobrado pelas taxas da API de cada modelo. Os limites de uso aparecem no editor. Os precos sao por milhao de tokens (input, cache write, cache read, output).

---

## Modo Auto

Com **Auto** ativado, o Cursor escolhe o modelo mais adequado a tarefa e com maior confiabilidade conforme a demanda.

- Pode detectar degradacao de qualidade e trocar de modelo automaticamente.
- O consumo segue as taxas da API.
- Se preferir, desative Auto e escolha um modelo fixo.

---

## Janela de contexto (Context window)

A **context window** e o numero maximo de tokens (texto e codigo) que o modelo considera de uma vez — prompt + resposta.

Cada chat no Cursor tem sua propria janela de contexto. Quanto mais prompts, arquivos anexados e respostas, mais o contexto e preenchido.

---

## Max Mode

O **Max Mode** estende a janela de contexto ate o **maximo suportado** pelo modelo (ex.: 1M tokens).

- Disponivel em todos os modelos.
- Preco: tarifa da API do modelo + 20% de acrescimo.
- Ative pelo seletor de modelo ou pelo slash command \`/max-mode [on|off]\`.
- Maior impacto nos modelos que tem contexto maior que 200k.

### Para quem e o Max Mode

- Para quem quer a melhor experiencia possivel sem priorizar economia.
- O contexto estendido custa bem mais que o padrao.
- A janela padrao costuma ser suficiente para a maioria das tarefas.`,
        questions: [
          {
            questionText: "O que o Modo Auto faz em relacao aos modelos?",
            options: ["Gera codigo sem voce pedir", "Escolhe o modelo mais adequado e confiavel para a tarefa", "Desliga a IA", "Usa sempre o modelo mais barato"],
            correctOptionIndex: 1,
            explanation: "Com Auto ativado, o Cursor escolhe o modelo mais adequado a tarefa e pode trocar em caso de degradacao."
          },
          {
            questionText: "Qual e o principal beneficio do Max Mode?",
            options: ["Deixa o codigo mais rapido", "Estende a janela de contexto ate o maximo suportado pelo modelo", "Diminui o custo da API", "Desativa o uso da internet"],
            correctOptionIndex: 1,
            explanation: "Com mais contexto, o modelo entende melhor o codebase e tende a errar menos em projetos complexos."
          },
          {
            questionText: "Qual e o custo adicional do Max Mode em relacao a tarifa normal da API?",
            options: ["Nenhum, e gratuito", "10% de acrescimo", "20% de acrescimo", "50% de acrescimo"],
            correctOptionIndex: 2,
            explanation: "O Max Mode cobra a tarifa da API do modelo + 20% de acrescimo pelo contexto estendido."
          }
        ]
      },
      {
        slug: "inline-edit-tab",
        title: "Inline Edit e Tab Completion",
        order: 6,
        content: `# Modulo 6 — Inline Edit e Tab Completion

Baseado no Workshop de Cursor — Do Basico ao Avancado.

---

## Inline Edit — Edicao Cirurgica com Ctrl+K

O Inline Edit permite editar codigo selecionado diretamente no editor usando linguagem natural.

### Como usar

1. **Selecione o codigo** que deseja modificar
2. **Pressione Ctrl+K** (ou Cmd+K no Mac)
3. **Descreva a mudanca** em linguagem natural

### Casos de uso

| Caso | Exemplo de Prompt |
|------|-------------------|
| **Refatoracao** | "Converta esta funcao para usar async/await" |
| **Tratamento de erros** | "Adicione try/catch especifico para erros de rede" |
| **Documentacao** | "Adicione JSDoc completo com exemplos" |
| **Tipagem** | "Adicione tipos TypeScript para todos os parametros" |

### Exemplo pratico

Antes:
\`\`\`javascript
function fetchUserData(userId) {
  return fetch(\\\`/api/users/\\\${userId}\\\`)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      return data;
    });
}
\`\`\`

Prompt: "Converta esta funcao para usar async/await"

Depois:
\`\`\`javascript
async function fetchUserData(userId) {
  const response = await fetch(\\\`/api/users/\\\${userId}\\\`);
  const data = await response.json();
  console.log(data);
  return data;
}
\`\`\`

---

## Tab Completion — Autocompletar Inteligente

O Cursor nao apenas completa palavras. Ele analisa todo o seu arquivo, arquivos relacionados e edicoes recentes para prever sua intencao.

### Contexto Profundo

O Tab analisa:
- O arquivo atual completo
- Arquivos relacionados no projeto
- Edicoes recentes feitas por voce
- Padroes do codebase

### Previsao Multi-linha

Sugere implementacoes completas de funcoes, classes ou testes de uma so vez.

### Como Usar

1. Comece a digitar
2. Veja o texto "fantasma" cinza aparecer
3. Pressione **Tab** para aceitar tudo
4. Pressione **Escape** para rejeitar

### Exemplo

Ao digitar o inicio de uma classe que implementa uma interface, o Tab pode sugerir a implementacao completa de todos os metodos:

\`\`\`typescript
interface UserService {
  getUser(id: string): Promise<User>;
  createUser(data: CreateUserDTO): Promise<User>;
}

class UserServiceImpl implements UserService {
  // Tab sugere a implementacao completa aqui
  async getUser(id: string): Promise<User> {
    return db.users.findUnique({ where: { id } });
  }
  
  async createUser(data: CreateUserDTO): Promise<User> {
    return db.users.create({ data });
  }
}
\`\`\``,
        questions: [
          {
            questionText: "Qual atalho ativa o Inline Edit no Cursor?",
            options: ["Ctrl+I", "Ctrl+K / Cmd+K", "Ctrl+L", "Ctrl+Shift+P"],
            correctOptionIndex: 1,
            explanation: "Ctrl+K (ou Cmd+K no Mac) ativa o Inline Edit, que permite editar codigo selecionado usando linguagem natural."
          },
          {
            questionText: "O que o Tab Completion do Cursor analisa para fazer sugestoes?",
            options: ["Apenas a palavra atual", "Apenas o arquivo atual", "O arquivo atual, arquivos relacionados e edicoes recentes", "Apenas o historico de commits"],
            correctOptionIndex: 2,
            explanation: "O Tab analisa o arquivo atual completo, arquivos relacionados no projeto e edicoes recentes para prever sua intencao."
          },
          {
            questionText: "Qual tecla voce pressiona para aceitar a sugestao do autocompletar?",
            options: ["Enter", "Tab", "Space", "Ctrl+Enter"],
            correctOptionIndex: 1,
            explanation: "Pressione Tab para aceitar a sugestao completa do autocompletar. Use Escape para rejeitar."
          }
        ]
      },
      {
        slug: "comandos-atalhos",
        title: "Comandos e Atalhos",
        order: 7,
        content: `# Modulo 7 — Comandos e Atalhos

Baseado em: [Slash commands | Cursor Docs](https://cursor.com/docs/cli/reference/slash-commands)

---

## Slash commands (comandos de barra)

**Onde usar:** no **chat do Agent** — abra com **Ctrl+I**, depois digite \`/\` e o nome do comando.

**Onde NAO usar:** na **Command Palette** (Ctrl+Shift+P). Essa caixa e para comandos do editor.

### Comandos principais

| Comando | Descricao |
|---------|-----------|
| \`/plan\` | Entrar no Modo Plano |
| \`/ask\` | Modo Ask — apenas leitura/exploracao |
| \`/model [nome]\` | Definir ou listar modelos |
| \`/auto-run [state]\` | Ligar/desligar auto-run |
| \`/max-mode [on|off]\` | Ligar/desligar Max Mode |
| \`/new-chat\` | Iniciar nova sessao de chat |
| \`/summarize\` | Resumir a conversa |
| \`/compress\` | Comprimir a conversa para liberar contexto |
| \`/rules\` | Criar ou editar regras |
| \`/commands\` | Criar ou editar comandos |
| \`/mcp list\` | Listar servidores MCP |

---

## Atalhos principais

### AI & Agent

| Acao | Atalho |
|------|--------|
| Inline Edit | **Ctrl+K** |
| Chat | **Ctrl+L** |
| Agent/Composer | **Ctrl+I** |
| Accept sugestao | **Tab** |
| Debug Mode | **Ctrl+.** |

### Navegacao

| Acao | Atalho |
|------|--------|
| Ir para Arquivo (Quick Open) | **Ctrl+P** |
| Busca Global | **Ctrl+Shift+F** |
| Ir para Definicao | **F12** |
| Voltar navegacao | **Alt+Seta Esquerda** |
| Command Palette | **Ctrl+Shift+P** |

### Geral

| Acao | Atalho |
|------|--------|
| Alternar Sidebar | **Ctrl+B** |
| Alternar Terminal | **Ctrl+\\\`** |
| Comentar/Descomentar | **Ctrl+/** |

---

## Commands — Workflows Reutilizaveis

Commands sao workflows reutilizaveis que voce pode invocar com \`/\` no chat.

### Estrutura

- **Projeto:** \`.cursor/commands/\`
- **Global:** \`~/.cursor/commands/\`
- **Equipe:** Cursor Dashboard

### Exemplo

\`\`\`markdown
// .cursor/commands/code-review.md

Revise o codigo alterado nesta branch seguindo este checklist:
1. Verifique se ha vulnerabilidades
2. Confirme validacao de inputs
3. Verifique tratamento de erros
4. Confirme cobertura de testes
5. Verifique padroes do projeto

Reporte com severidade (Critico/Alto/Medio).
\`\`\`

No chat, use: \`/code-review focando na autenticacao\`

O Agent le o arquivo de comando, executa o checklist passo-a-passo e gera o relatorio.`,
        questions: [
          {
            questionText: "Qual slash command inicia o Modo Plano no chat?",
            options: ["/ask", "/auto-run", "/plan", "/max-mode"],
            correctOptionIndex: 2,
            explanation: "O comando /plan faz o Agent planejar antes de comecar a codar."
          },
          {
            questionText: "Onde ficam armazenados os Commands de projeto?",
            options: ["Na pasta .cursor/commands/", "No arquivo package.json", "Na pasta node_modules/", "No arquivo .gitignore"],
            correctOptionIndex: 0,
            explanation: "Commands de projeto ficam em .cursor/commands/ e podem ser invocados com / no chat."
          },
          {
            questionText: "Qual atalho abre o Command Palette no Cursor?",
            options: ["Ctrl+P", "Ctrl+I", "Ctrl+Shift+P", "Ctrl+K"],
            correctOptionIndex: 2,
            explanation: "Ctrl+Shift+P abre o Command Palette, que da acesso a todos os comandos do editor."
          }
        ]
      },
      {
        slug: "skills-subagents",
        title: "Skills e Subagents",
        order: 8,
        content: `# Modulo 8 — Skills e Subagents

Baseado no Workshop de Cursor — Do Basico ao Avancado.

---

## Skills — Estenda o Agent com Capacidades Especializadas

**Agent Skills** e um padrao aberto para empacotar conhecimento de dominio e workflows que o Agent pode usar para tarefas especificas.

### Estrutura de diretorios

\`\`\`
.cursor/
  skills/
    deploy-app/
      SKILL.md
      scripts/
        deploy.sh
        validate.py
\`\`\`

### Exemplo de SKILL.md

\`\`\`markdown
---
name: deploy-app
description: Deploy da aplicacao para staging ou producao.
---

# Deploy App
Execute o script de deploy:
\\\`scripts/deploy.sh <ambiente>\\\`

Onde <ambiente> e staging ou production.

## Pre-deploy
Antes de deployar, execute:
\\\`python scripts/validate.py\\\`
\`\`\`

Skills sao descobertas automaticamente pelo Cursor ou podem ser invocadas com \`/\` no chat.

---

## Subagents — Orquestre Multiplos Agentes

Delegue tarefas complexas para agentes especializados que operam em janelas de contexto isoladas.

### Subagents Nativos (Built-in)

| Subagent | Funcao |
|----------|--------|
| **Explore** | Busca e analisa codebases usando um modelo mais rapido para processar grandes volumes de dados |
| **Bash** | Executa series de comandos shell, isolando logs verbosos do contexto principal |
| **Browser** | Controla o navegador via MCP, filtrando o ruido de snapshots do DOM |

### Subagents Customizados

Voce pode criar seus proprios subagents em \`.cursor/agents/\`:

\`\`\`markdown
// .cursor/agents/verifier.md

---
name: verifier
description: Valida trabalho completado.
model: inherit
---

Voce e um verificador independente.
Quando invocado:
1. Revise as mudancas feitas
2. Execute os testes relevantes
3. Reporte o que passou vs. incompleto
\`\`\`

### Como invocar subagents

- Use \`/verifier\` no chat
- Ou peca em linguagem natural: "Use o subagent verifier para validar as mudancas"`,
        questions: [
          {
            questionText: "O que sao Agent Skills no Cursor?",
            options: ["Extensoes do VS Code", "Um padrao para empacotar conhecimento de dominio e workflows para o Agent", "Plugins de terceiros pagos", "Atalhos de teclado personalizados"],
            correctOptionIndex: 1,
            explanation: "Agent Skills e um padrao aberto para empacotar conhecimento de dominio e workflows que o Agent pode usar para tarefas especificas."
          },
          {
            questionText: "Qual subagent nativo e usado para buscar e analisar grandes volumes de codigo?",
            options: ["Bash", "Browser", "Explore", "Verifier"],
            correctOptionIndex: 2,
            explanation: "O subagent Explore busca e analisa codebases usando um modelo mais rapido para processar grandes volumes de dados."
          },
          {
            questionText: "Onde ficam armazenados os subagents customizados?",
            options: [".cursor/rules/", ".cursor/agents/", ".cursor/commands/", ".cursor/skills/"],
            correctOptionIndex: 1,
            explanation: "Subagents customizados ficam em .cursor/agents/ como arquivos markdown com metadados."
          }
        ]
      },
      {
        slug: "terminal-review",
        title: "Terminal Inteligente e Review",
        order: 9,
        content: `# Modulo 9 — Terminal Inteligente e Review

Baseado no Workshop de Cursor — Do Basico ao Avancado.

---

## Terminal Inteligente — Seguranca na Execucao

O Cursor possui integracao inteligente com o terminal que permite ao Agent executar e corrigir erros automaticamente.

### Execucao e Auto-Fix

Quando o Agent executa um comando e encontra um erro (por exemplo, um erro de tipagem TypeScript), ele pode detectar e corrigir automaticamente:

\`\`\`
> npm run build
> tsc
src/app.ts(12,5): error TS2322: Type 'string' is not assignable to type 'number'.

AGENT AUTO-FIX:
"Detectei um erro de tipagem. Corrigindo src/app.ts..."
\`\`\`

### Controles de Seguranca

#### Modo de Aprovacao

Exige sua confirmacao explicita antes de executar qualquer comando que possa alterar arquivos ou fazer chamadas de rede.

#### Allowlist de Comandos

Defina comandos seguros que o Agent pode rodar livremente:

\`\`\`
ls  cat  grep  npm test  git status
\`\`\`

#### Comandos destrutivos bloqueados

Comandos como \`rm -rf\` e \`git reset --hard\` sao bloqueados por padrao e exigem aprovacao dupla.

---

## Sandbox

O Cursor oferece um ambiente isolado (sandbox) para executar codigo de forma segura:

- Use o slash command \`/sandbox\` para configurar
- Controle o acesso a rede e ao sistema de arquivos
- Ideal para testar codigo potencialmente inseguro

---

## Review — Revise Cada Linha Antes de Aceitar

O sistema de review do Cursor permite inspecionar todas as mudancas antes de aplica-las.

### Diff View Claro

Visualize exatamente o que sera removido (vermelho) e adicionado (verde) antes de confirmar.

### Aceitacao Seletiva

Nao e tudo ou nada. Aceite blocos especificos de codigo e rejeite outros:

- **Accept (Ctrl+Enter):** Aceita as mudancas
- **Reject:** Rejeita as mudancas
- Voce pode aceitar/rejeitar blocos individuais

### Agent Review

Peca para o Agent revisar o proprio codigo em busca de bugs ou regressoes antes de voce olhar:

1. O Agent termina de fazer as mudancas
2. Clique em **"Review"** -> **"Find Issues"**
3. O Agent analisa as edicoes e aponta possiveis problemas

> Codigo gerado por IA pode parecer correto e ter erros sutis. Leia os diffs com atencao. Quanto mais rapido o Agent trabalha, mais importante e o seu processo de revisao.`,
        questions: [
          {
            questionText: "O que o Auto-Fix do terminal faz quando detecta um erro?",
            options: ["Apaga o arquivo com erro", "Detecta e corrige o erro automaticamente no codigo-fonte", "Ignora o erro", "Desliga o projeto"],
            correctOptionIndex: 1,
            explanation: "O Auto-Fix detecta erros (como erros de tipagem) e corrige automaticamente o codigo-fonte."
          },
          {
            questionText: "Como funciona a aceitacao seletiva no Review?",
            options: ["Voce precisa aceitar todas as mudancas ou rejeitar tudo", "Voce pode aceitar/rejeitar blocos individuais de codigo", "Voce so pode rejeitar mudancas", "O Agent decide o que aceitar"],
            correctOptionIndex: 1,
            explanation: "A aceitacao seletiva permite aceitar blocos especificos de codigo e rejeitar outros, sem ser tudo ou nada."
          },
          {
            questionText: "Quais tipos de comandos sao bloqueados por padrao no terminal do Cursor?",
            options: ["Todos os comandos npm", "Comandos de leitura como ls e cat", "Comandos destrutivos como rm -rf e git reset --hard", "Comandos de instalacao"],
            correctOptionIndex: 2,
            explanation: "Comandos destrutivos como rm -rf e git reset --hard sao bloqueados por padrao e exigem aprovacao dupla."
          }
        ]
      },
      {
        slug: "prompts-eficazes",
        title: "Prompts Eficazes",
        order: 10,
        content: `# Modulo 10 — Prompts Eficazes

Baseado no Workshop de Cursor — Do Basico ao Avancado.

---

## A Diferenca entre Bom e Excelente

A qualidade dos seus prompts determina diretamente a qualidade do codigo gerado.

### Nivel 1: Fraco (Vago)

\`\`\`
"Crie uma pagina de login."
\`\`\`

Resultado: codigo generico, sem considerar seu projeto.

### Nivel 2: Bom (Especifico)

\`\`\`
"Crie um componente React de login com email e senha usando Tailwind CSS e validacao basica."
\`\`\`

Resultado: codigo mais direcionado, mas sem contexto do projeto.

### Nivel 3: Excelente (Contextualizado)

\`\`\`
"@Login.tsx @auth-context.ts Implemente o formulario de login usando react-hook-form e zod.
Valide o email corporativo e integre com o metodo 'login' do contexto.
Use os componentes de UI existentes em @components/ui."
\`\`\`

Resultado: codigo integrado ao projeto, seguindo padroes existentes.

---

## A Formula Magica

> **Contexto** + **Intencao Clara** + **Restricoes**

| Elemento | O que significa | Exemplo |
|----------|----------------|---------|
| **Contexto** | Files, Docs, @ mentions | @Login.tsx @auth-context.ts |
| **Intencao Clara** | Verbo de acao claro | "Implemente o formulario de login" |
| **Restricoes** | Libs, padroes, convencoes | "usando react-hook-form e zod" |

---

## Dicas Avancadas para Produtividade Maxima

### 1. Contexto Limpo

Chats longos degradam a performance e confundem o modelo. Nao tenha medo de comecar do zero.

**Acao recomendada:** Use Ctrl+L para iniciar um novo chat a cada nova tarefa ou feature.

### 2. Validacao Primeiro

Evite o ciclo de "tentativa e erro". Peca para o Agent criar um teste que falha antes de corrigir o codigo.

**Prompt exemplo:** "Crie um script de reproducao para este bug antes de tentar corrigi-lo."

### 3. Seja o Arquiteto

Pare de digitar sintaxe. Foque em descrever a arquitetura, revisar a logica e orquestrar a solucao.

> **Mindset:** Voce e o Diretor Tecnico; o Cursor e o Desenvolvedor Senior.

---

## Workflow Completo — Do Plano a Execucao

### Cenario: Adicionar autenticacao JWT a uma API Express

| Etapa | Acao | Detalhe |
|-------|------|---------|
| 1. Planejar | Shift+Tab | Descreva o objetivo macro |
| 2. Revisar Plano | Save to workspace | Salve em .cursor/plans/ |
| 3. Executar | Aprove o plano | O Agent implementa as mudancas |
| 4. Review | Review -> Find Issues | O Agent revisa o proprio codigo |
| 5. Iterar | Escape + novo prompt | Refine com instrucoes adicionais |`,
        questions: [
          {
            questionText: "Qual e a 'formula magica' para prompts eficazes?",
            options: ["Copiar + Colar + Rezar", "Contexto + Intencao Clara + Restricoes", "Apenas descrever o resultado final", "Escrever o codigo junto com o prompt"],
            correctOptionIndex: 1,
            explanation: "A formula e: Contexto (@ mentions) + Intencao Clara (verbo de acao) + Restricoes (libs, padroes, convencoes)."
          },
          {
            questionText: "Qual e o mindset recomendado ao usar o Cursor?",
            options: ["Voce e o digitador e o Cursor supervisiona", "Voce e o Diretor Tecnico e o Cursor e o Desenvolvedor Senior", "O Cursor faz tudo sozinho sem sua participacao", "Voce deve escrever todo o codigo manualmente"],
            correctOptionIndex: 1,
            explanation: "Voce deve focar em descrever a arquitetura, revisar a logica e orquestrar a solucao, enquanto o Cursor implementa."
          },
          {
            questionText: "Por que e recomendado pedir um teste que falha antes de corrigir um bug?",
            options: ["Para gastar mais tokens da API", "Para evitar o ciclo de tentativa e erro e garantir que o bug foi realmente corrigido", "Para deixar o codigo mais lento", "Nao e recomendado fazer isso"],
            correctOptionIndex: 1,
            explanation: "Criar um teste de reproducao primeiro garante que voce validou o bug e pode verificar que a correcao realmente funciona."
          }
        ]
      },
      {
        slug: "projeto-zero",
        title: "Configurando um Projeto do Zero",
        order: 11,
        content: `# Modulo 11 — Configurando um Projeto do Zero

Baseado no Workshop de Cursor — Do Basico ao Avancado.

---

## Passo a Passo Completo

### Etapa 1: Defina o Cerebro do Projeto (AGENTS.md)

Crie o arquivo mestre na raiz do repositorio. Descreva a missao, a stack tecnologica e as convencoes globais de arquitetura.

\`\`\`markdown
// /AGENTS.md

# Projeto: Meu App

## Stack
- Next.js 14 com App Router
- Tailwind CSS
- Supabase (banco de dados e autenticacao)
- TypeScript strict mode

## Convencoes
- Componentes funcionais com hooks
- PascalCase para componentes
- camelCase para funcoes e variaveis
- snake_case para colunas no banco
\`\`\`

### Etapa 2: Estabeleca as Regras (.cursor/rules/)

Crie regras especificas para contextos diferentes:

\`\`\`yaml
// .cursor/rules/style-guide.mdc
---
globs: "src/**/*.tsx"
description: "Use Tailwind utility classes, avoid inline styles."
alwaysApply: false
---

- Use Tailwind utility classes
- Evite inline styles
- Siga o design system do projeto
\`\`\`

\`\`\`yaml
// .cursor/rules/db-schema.mdc
---
globs: "src/**/*.sql"
description: "Padroes para SQL e banco de dados."
alwaysApply: false
---

- Use snake_case para todas as colunas
- Sempre inclua created_at e updated_at
- Use UUID como primary key
\`\`\`

### Etapa 3: Automatize Workflows (.cursor/commands/)

Padronize tarefas repetitivas:

\`\`\`markdown
// .cursor/commands/test.md

Execute os testes relacionados ao codigo alterado.
Se algum teste falhar:
1. Analise o erro
2. Corrija o codigo
3. Re-execute ate todos os testes passarem
\`\`\`

### Etapa 4: Validacao Inicial

Verifique se o Agent entendeu o contexto:

\`\`\`
@AGENTS.md leia este arquivo e explique a arquitetura do projeto.
\`\`\`

---

## Recapitulacao do Curso

### O Que Dominamos

1. Instalacao e migracao do VS Code
2. Os 4 Modos: Agent, Ask, Plan e Debug
3. Dominio do Contexto com @ Mentions
4. Personalizacao via Rules (.mdc) e Skills
5. Workflow seguro com Review e Sandbox
6. Prompts eficazes e boas praticas

### Sua Missao Agora

1. **Crie seu AGENTS.md** — Defina a "personalidade" e as regras globais do seu projeto.
2. **Configure uma Rule de Projeto** — Crie uma regra em .cursor/rules/ para padronizar seu estilo de codigo.
3. **Use o Plan Mode** — Na sua proxima feature complexa, use Shift+Tab antes de escrever qualquer codigo.`,
        questions: [
          {
            questionText: "Qual e o primeiro passo ao configurar um projeto do zero no Cursor?",
            options: ["Instalar todas as dependencias", "Criar o arquivo AGENTS.md na raiz do projeto", "Escrever todo o codigo primeiro", "Configurar o deploy"],
            correctOptionIndex: 1,
            explanation: "O primeiro passo e criar o AGENTS.md, que define a 'personalidade' do projeto: missao, stack e convencoes."
          },
          {
            questionText: "Para que serve criar regras com globs especificos como 'src/**/*.tsx'?",
            options: ["Para aplicar a regra apenas quando o Agent editar arquivos que batem com esse padrao", "Para apagar todos os arquivos .tsx", "Para compilar o projeto mais rapido", "Para bloquear o acesso a esses arquivos"],
            correctOptionIndex: 0,
            explanation: "Globs permitem que a regra seja aplicada automaticamente apenas quando o Agent estiver trabalhando com arquivos que combinam com o padrao."
          },
          {
            questionText: "Qual e a missao recomendada apos concluir este curso?",
            options: ["Desinstalar o Cursor", "Criar AGENTS.md, configurar Rules e usar Plan Mode na proxima feature", "Continuar usando o VS Code sem IA", "Ignorar as boas praticas aprendidas"],
            correctOptionIndex: 1,
            explanation: "A missao e aplicar o que aprendeu: criar AGENTS.md, configurar Rules e usar Plan Mode em features complexas."
          }
        ]
      }
    ];

    for (const mod of modulesData) {
      const module = await storage.createModule({
        slug: mod.slug,
        title: mod.title,
        content: mod.content,
        order: mod.order,
      });

      for (const q of mod.questions) {
        await storage.createQuestion({
          moduleId: module.id,
          questionText: q.questionText,
          options: q.options,
          correctOptionIndex: q.correctOptionIndex,
          explanation: q.explanation,
        });
      }
    }

    console.log("Database seeded successfully with enriched course content.");
  } catch (err) {
    console.error("Error seeding database:", err);
  }
}