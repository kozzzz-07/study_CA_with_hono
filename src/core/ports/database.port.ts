import { Book, CreateBookInput } from "../entities/book.entity.ts";
import {
  CreateUserInput,
  ExistingUser,
  FindUserInput,
} from "../entities/user.entity.ts";

// 公開する
export interface BookRepository {
  create(book: CreateBookInput): Promise<Book>;
  findById(id: string): Promise<Book | null>;
  list(): Promise<Book[]>;
  delete(id: string): Promise<void>;
}

export interface UserRepository {
  create(args: CreateUserInput): Promise<ExistingUser | "USER_ALREADY_EXISTS">;
  findByLoginAndPassword(args: FindUserInput): Promise<ExistingUser | null>;
  findById(id: string): Promise<ExistingUser | null>;
}
