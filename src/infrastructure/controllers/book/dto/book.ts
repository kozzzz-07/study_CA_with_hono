import { z } from "@hono/zod-openapi";

export const BookOutputScheme = z.object({
  id: z.uuid(),
  title: z.string().min(1),
  summary: z.string().min(5),
  author: z.string().min(1),
  totalPages: z.number().min(1),
});

export const BookIdScheme = z.object({
  id: z.uuid(),
});
