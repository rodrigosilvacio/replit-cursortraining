import { z } from 'zod';
import { modules, questions } from './schema';

export const errorSchemas = {
  notFound: z.object({ message: z.string() }),
  internal: z.object({ message: z.string() }),
};

const moduleSchema = z.custom<typeof modules.$inferSelect>();
const questionSchema = z.custom<typeof questions.$inferSelect>();
const moduleWithQuestionsSchema = moduleSchema.and(
  z.object({ questions: z.array(questionSchema) })
);

export const api = {
  modules: {
    list: {
      method: 'GET' as const,
      path: '/api/modules' as const,
      responses: {
        200: z.array(moduleSchema),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/modules/:slug' as const,
      responses: {
        200: moduleWithQuestionsSchema,
        404: errorSchemas.notFound,
      },
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type ModuleListResponse = z.infer<typeof api.modules.list.responses[200]>;
export type ModuleWithQuestionsResponse = z.infer<typeof api.modules.get.responses[200]>;