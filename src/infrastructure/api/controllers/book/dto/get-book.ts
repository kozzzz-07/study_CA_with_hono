import { z } from "@hono/zod-openapi";
import { BookOutputScheme } from "./book.ts";

export const GetBookOutputScheme = BookOutputScheme;
export type GetBookOutputDto = ReturnType<typeof GetBookOutputScheme.parse>;

export const GetBooksOutputScheme = z.array(BookOutputScheme);
// export type GetBooksOutputDto = ReturnType<typeof GetBooksOutputScheme.parse>;
