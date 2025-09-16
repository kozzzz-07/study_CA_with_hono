import z from "zod";
import { BookOutputDto } from "./book.ts";

export const GetBookOutputDto = BookOutputDto;
export type GetBookOutputDto = ReturnType<typeof GetBookOutputDto.parse>;

export const GetBooksOutputDto = z.array(BookOutputDto);
export type GetBooksOutputDto = ReturnType<typeof GetBooksOutputDto.parse>;
