import { CreateBookInput, Book } from "../../entities/book.entity.ts";
import { BookRepository } from "../../ports/database.port.ts";
import { Logger } from "../../ports/logger.port.ts";

// Usecaseが必要とする依存関係を定義
export interface CreateBookDeps {
  repository: BookRepository;
  logger: Logger;
}

// Usecase本体の型
export type CreateBook = (args: CreateBookInput) => Promise<Book>;

/**
 * 本を作成するUsecaseを作成するファクトリ関数
 */
export const makeCreateBook = (deps: CreateBookDeps): CreateBook => {
  return async (args: CreateBookInput): Promise<Book> => {
    deps.logger.info(`Creating book with title: ${args.title}`);

    // ここに将来的にドメイン固有のバリデーションなどを追加できる

    const createdBook = await deps.repository.create(args);

    deps.logger.info(`Successfully created book with id: ${createdBook.id}`);

    return createdBook;
  };
};
