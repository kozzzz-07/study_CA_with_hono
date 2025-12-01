import { Book } from "../../entities/book.entity.ts";
import { BookRepository } from "../../ports/database.port.ts";
import { Logger } from "../../ports/logger.port.ts";

// Usecaseが必要とする依存関係を定義
export interface ListBooksDeps {
  repository: BookRepository; // TODO: 依存絞ってもいいかも
  logger: Logger;
}

// Usecase本体の型
export type ListBooks = () => Promise<Book[]>;

/**
 * 本を取得するUsecaseを作成するファクトリ関数（DIコンテナの役割）
 */
export const makeListBooks = (deps: ListBooksDeps): ListBooks => {
  // 実際にHonoのハンドラから呼ばれる関数
  return async (): ReturnType<ListBooks> => {
    deps.logger.info(`Fetching books`);
    const books = await deps.repository.list();
    deps.logger.info(`Found ${books.length} books`);
    return books;
  };
};
