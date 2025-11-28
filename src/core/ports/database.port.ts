import { Book } from "../domain/book.entity.ts";

// 公開する
export interface BookRepository {
  save(book: Book): Promise<void>;
  findById(id: string): Promise<Book | null>;
  // list(): Promise<Book[]>;
  // delete(id: string): Promise<boolean>;
}
