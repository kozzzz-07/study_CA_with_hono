import { Book } from "../entities/book.entity.ts";
import { BookRepository } from "../ports/database.port.ts";
import { Logger } from "../ports/logger.port.ts";

// Usecaseが必要とする依存関係を定義
export interface GetBookDeps {
  repository: BookRepository;
  logger: Logger; // todo: loggerはミドルウェアから取得したものを利用すればいいのではないか検討
}

// Usecase本体の型
export type GetBook = (id: string) => Promise<Book | null>;

/**
 * 本を取得するUsecaseを作成するファクトリ関数（DIコンテナの役割）
 */
export const makeGetBook = (deps: GetBookDeps): GetBook => {
  // 実際にHonoのハンドラから呼ばれる関数
  return async (id: string): Promise<Book | null> => {
    deps.logger.info(`Fetching book with id: ${id}`);

    const book = await deps.repository.findById(id);

    if (book) {
      deps.logger.info(`Found book: ${book.summary}`);
    } else {
      deps.logger.warn(`Book with id: ${id} not found`);
    }

    return book;
  };
};
