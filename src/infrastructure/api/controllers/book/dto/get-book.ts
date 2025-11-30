import { z } from "@hono/zod-openapi";
import { BookOutputScheme } from "./book.ts";

export const GetBookOutputScheme = BookOutputScheme;
export type GetBookOutputDto = ReturnType<typeof GetBookOutputScheme.parse>;

export const GetBooksOutputScheme = z.array(BookOutputScheme);
// export type GetBooksOutputDto = ReturnType<typeof GetBooksOutputScheme.parse>;

// 汎用的なエラーレスポンスのスキーマ
export const ErrorScheme = z.object({
  message: z.string().openapi({
    example: "Book not found",
  }),
});
export type ErrorDto = ReturnType<typeof ErrorScheme.parse>;

