import { Book } from "../entities/book.entity.ts";

// 公開する
export interface BookRepository {
  create(book: Book): Promise<void>;
  findById(id: string): Promise<Book | null>;
  // list(): Promise<Book[]>;
  // delete(id: string): Promise<boolean>;
}
