import { Book, CreateBookInput } from "../entities/book.entity.ts";

// 公開する
export interface BookRepository {
  create(book: CreateBookInput): Promise<void>;
  findById(id: string): Promise<Book | null>;
  list(): Promise<Book[]>;
  delete(id: string): Promise<void>;
}
