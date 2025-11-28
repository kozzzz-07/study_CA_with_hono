import { Book } from "../book.interface.ts";

export interface BookRepository {
  findById(id: string): Promise<Book | null>;
}
