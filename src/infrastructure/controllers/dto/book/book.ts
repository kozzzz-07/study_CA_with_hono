import * as z from "zod";

export const BookOutputDto = z.object({
  id: z.uuid(),
  title: z.string().min(1),
  summary: z.string().min(5),
  author: z.string().min(1),
  totalPages: z.number().min(1),
});
