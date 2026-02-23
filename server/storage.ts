import { db } from "./db";
import {
  modules,
  questions,
  type Module,
  type InsertModule,
  type Question,
  type InsertQuestion,
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getModules(): Promise<Module[]>;
  getModuleBySlug(slug: string): Promise<Module | undefined>;
  getQuestionsForModule(moduleId: number): Promise<Question[]>;
  createModule(module: InsertModule): Promise<Module>;
  createQuestion(question: InsertQuestion): Promise<Question>;
}

export class DatabaseStorage implements IStorage {
  async getModules(): Promise<Module[]> {
    return await db.select().from(modules).orderBy(modules.order);
  }

  async getModuleBySlug(slug: string): Promise<Module | undefined> {
    const [module] = await db.select().from(modules).where(eq(modules.slug, slug));
    return module;
  }

  async getQuestionsForModule(moduleId: number): Promise<Question[]> {
    return await db.select().from(questions).where(eq(questions.moduleId, moduleId));
  }

  async createModule(insertModule: InsertModule): Promise<Module> {
    const [module] = await db.insert(modules).values(insertModule).returning();
    return module;
  }

  async createQuestion(insertQuestion: InsertQuestion): Promise<Question> {
    const [question] = await db.insert(questions).values(insertQuestion).returning();
    return question;
  }
}

export const storage = new DatabaseStorage();