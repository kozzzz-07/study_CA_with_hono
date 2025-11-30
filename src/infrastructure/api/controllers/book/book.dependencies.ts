// src/infrastructure/api/controllers/book/book.dependencies.ts

// このドメインで利用するusecaseをインポート
import { makeCreateBook } from "../../../../core/usecases/createBook/index.ts";
import { makeDeleteBook } from "../../../../core/usecases/deleteBook/index.ts";
import { makeGetBook } from "../../../../core/usecases/getBook/index.ts";
import { makeListBooks } from "../../../../core/usecases/listBooks/index.ts";

// このドメインで利用する具象実装（アダプタ）を直接インポート
import { drizzleOrmRepository } from "../../../adapters/orm/drizzle/book/book.repository.ts";
import { logger } from "../../../adapters/pino-logger/adapter.ts";

// 依存性を組み立てる
const deps = {
  repository: drizzleOrmRepository,
  logger: logger,
};

// Book関連のusecaseを生成
const getBook = makeGetBook(deps);
const listBooks = makeListBooks(deps);
const deleteBook = makeDeleteBook(deps);
const createBook = makeCreateBook(deps);

// このモジュールが外部（コントローラ）に提供するusecaseをエクスポート
export const bookUseCases = {
  getBook,
  listBooks,
  deleteBook,
  createBook,
};
