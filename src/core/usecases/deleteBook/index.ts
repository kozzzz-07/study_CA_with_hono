import { BookRepository } from "../../ports/database.port.ts";
import { Logger } from "../../ports/logger.port.ts";

// Usecaseが必要とする依存関係を定義
export interface DeleteBooksDeps {
  repository: BookRepository;
  logger: Logger;
}

// Usecase本体の型
export type DeleteBooks = (id: string) => Promise<void>;

/**
 * 本を取得するUsecaseを作成するファクトリ関数（DIコンテナの役割）
 */
export const makeDeleteBook = (deps: DeleteBooksDeps): DeleteBooks => {
  // 実際にHonoのハンドラから呼ばれる関数
  return async (id: string): ReturnType<DeleteBooks> => {
    deps.logger.info(`Deleting book with id: ${id}`);
    await deps.repository.delete(id);
    deps.logger.info(`Deleted book with id: ${id}`);
  };
};
