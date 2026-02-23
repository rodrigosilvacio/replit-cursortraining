import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import fs from 'fs/promises';
import path from 'path';

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

  // Seed data function
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  try {
    const existingModules = await storage.getModules();
    if (existingModules.length > 0) return;

    const assetsDir = path.join(process.cwd(), 'attached_assets');
    const files = await fs.readdir(assetsDir);
    const mdFiles = files.filter(f => f.endsWith('.md') && /^\d{2}-/.test(f)).sort();

    let order = 1;
    for (const file of mdFiles) {
      const content = await fs.readFile(path.join(assetsDir, file), 'utf-8');
      
      const titleMatch = content.match(/^# (.*?)$/m);
      const title = titleMatch ? titleMatch[1] : file.replace('.md', '');
      const slug = file.replace(/_.*\.md$/, '').replace(/^\d{2}-/, '');

      const module = await storage.createModule({
        slug,
        title,
        content,
        order
      });

      let questionText = `Qual é o tema principal abordado em ${title}?`;
      let options = ["Funcionalidades específicas", "Conceitos gerais", "Fatos aleatórios da internet", "Como instalar o Windows"];
      let correctOptionIndex = 0;
      let explanation = `Este módulo introduz o tema de ${title} no Cursor.`;

      if (slug.includes('indice')) {
        questionText = "Sobre o que é este curso?";
        options = ["VSCode", "IntelliJ", "Cursor", "Eclipse"];
        correctOptionIndex = 2;
        explanation = "O curso é focado em ensinar o uso do Cursor, um editor de código com IA.";
      } else if (slug.includes('inicio-rapido')) {
        questionText = "Qual atalho ativa o Modo Plano (Plan Mode) no Agent?";
        options = ["Ctrl+P", "Cmd+I / Ctrl+I", "Shift+Tab", "Alt+F4"];
        correctOptionIndex = 2;
        explanation = "Pressione Shift+Tab na entrada do Agent para ativar o Modo Plano, onde ele planeja antes de codar.";
      } else if (slug.includes('agent')) {
        questionText = "O que são Checkpoints no Cursor?";
        options = ["Uma forma de salvar um jogo", "Branches do Git", "Snapshots automáticos das alterações do Agent", "Backups externos na nuvem"];
        correctOptionIndex = 2;
        explanation = "Checkpoints permitem desfazer mudanças do Agent. Eles são locais e separados do Git.";
      } else if (slug.includes('regras')) {
        questionText = "Onde ficam armazenadas as Project Rules?";
        options = ["No arquivo package.json", "Na pasta .cursor/rules", "Nas configurações globais do usuário", "Em um banco de dados externo"];
        correctOptionIndex = 1;
        explanation = "As Project Rules ficam em .cursor/rules e devem ser versionadas com o código.";
      } else if (slug.includes('modelos')) {
        questionText = "O que o Modo Auto faz em relação aos modelos?";
        options = ["Gera código sem você pedir", "Escolhe o modelo mais adequado e confiável para a tarefa", "Desliga a IA", "Usa sempre o modelo mais barato"];
        correctOptionIndex = 1;
        explanation = "Com Auto ativado, o Cursor escolhe o modelo mais adequado à tarefa e pode trocar em caso de degradação.";
      } else if (slug.includes('comandos-atalhos')) {
        questionText = "Qual slash command inicia o Modo Plano no chat?";
        options = ["/ask", "/auto-run", "/plan", "/max-mode"];
        correctOptionIndex = 2;
        explanation = "O comando /plan faz o Agent planejar antes de começar a codar.";
      } else if (slug.includes('max-mode')) {
        questionText = "Qual é o principal benefício do Max Mode?";
        options = ["Deixa o código mais rápido", "Estende a janela de contexto até o máximo suportado pelo modelo", "Diminui o custo da API", "Desativa o uso da internet"];
        correctOptionIndex = 1;
        explanation = "Com mais contexto, o modelo entende melhor o codebase e tende a errar menos em projetos complexos.";
      } else if (slug.includes('boas-praticas')) {
        questionText = "Quando é recomendado começar uma nova conversa com o Agent?";
        options = ["A cada 5 minutos", "Quando você quiser mudar a cor do editor", "Quando uma unidade lógica de trabalho terminou ou o Agent está confuso", "Apenas no dia seguinte"];
        correctOptionIndex = 2;
        explanation = "Conversas longas podem fazer o Agent perder o foco, por isso é melhor iniciar uma nova conversa a cada nova feature ou quando ele repetir erros.";
      }

      await storage.createQuestion({
        moduleId: module.id,
        questionText,
        options,
        correctOptionIndex,
        explanation
      });

      order++;
    }
  } catch (err) {
    console.error("Error seeding database:", err);
  }
}