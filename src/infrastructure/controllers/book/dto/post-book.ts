import { z } from "@hono/zod-openapi";
import { BookOutputScheme } from "./book.ts";

export const PostBookInputScheme = z.object({
  title: z.string().min(1),
  summary: z.string().min(5),
  author: z.string().min(1),
  totalPages: z.number().min(1),
});

export type PostBookInputDto = ReturnType<typeof PostBookInputScheme.parse>;

export const PostBookOutputScheme = BookOutputScheme;
export type PostBookOutputDto = ReturnType<typeof PostBookOutputScheme.parse>;
