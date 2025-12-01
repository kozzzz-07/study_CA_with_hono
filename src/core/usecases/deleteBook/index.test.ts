// src/core/usecases/deleteBook/index.test.ts

import { beforeEach, describe, it } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";
import { stub } from "jsr:@std/testing/mock";

import { makeDeleteBook } from "./index.ts"; // makeDeleteBookはindex.tsからエクスポートされている
import { BookRepository } from "../../ports/database.port.ts";
import { Logger } from "../../ports/logger.port.ts";
import { Book } from "../../entities/book.entity.ts"; // モックの型アサーションに必要

describe("makeDeleteBook usecase", () => {
  let mockBookRepository: BookRepository;
  let mockLogger: Logger;
  let deleteBook: (id: string) => Promise<void>; // makeDeleteBookが返す関数の型

  beforeEach(() => {
    // 各テストケースの前にモック依存性を初期化
    mockBookRepository = {
      list: async () => [],
      findById: async () => null,
      create: async (b) => b as Book,
      delete: async () => {}, // デフォルトの空実装
    };
    mockLogger = {
      info: () => {},
      warn: () => {},
      error: () => {},
      debug: () => {},
    };

    // 新しいモックでユースケースのインスタンスを生成
    deleteBook = makeDeleteBook({
      repository: mockBookRepository,
      logger: mockLogger,
    });
  });

  it("指定されたIDの書籍を正常に削除できる", async () => {
    // Arrange
    const bookIdToDelete = "book-id-123";

    // リポジトリのdeleteメソッドが成功するようにスタブ（voidを返す）
    const deleteStub = stub(mockBookRepository, "delete", async () => {
      return await Promise.resolve();
    });
    // logger.infoメソッドをスタブし、呼び出しを捕捉
    const infoStub = stub(mockLogger, "info");

    // Act
    await deleteBook(bookIdToDelete);

    // Assert
    // リポジトリのdeleteメソッドが正しく呼び出されたことを検証
    expect(deleteStub.calls.length).toBe(1);
    expect(deleteStub.calls[0].args).toEqual([bookIdToDelete]);

    // logger.infoが正しいメッセージで呼び出されたことを検証
    expect(infoStub.calls.length).toBe(2); // 開始ログと成功ログの2回
    expect(infoStub.calls[0].args).toEqual([
      `Deleting book with id: ${bookIdToDelete}`,
    ]);
    expect(infoStub.calls[1].args).toEqual([
      `Deleted book with id: ${bookIdToDelete}`,
    ]);

    deleteStub.restore();
    infoStub.restore();
  });

  it("リポジトリがエラーを投げた場合、usecaseもエラーを伝播する", async () => {
    // Arrange
    const bookIdToDelete = "book-id-with-error";
    const expectedError = new Error("Database error during deletion");

    // リポジトリのdeleteメソッドがエラーを投げるようにスタブ
    const deleteStub = stub(mockBookRepository, "delete", async () => {
      throw expectedError;
    });
    // logger.errorメソッドをスタブし、呼び出しを捕捉（ユースケース内でログされる場合）
    const errorStub = stub(mockLogger, "error");
    const infoStub = stub(mockLogger, "info"); // 開始ログのためにinfoも捕捉

    // Act & Assert
    // ユースケースがエラーを伝播することを確認
    await expect(deleteBook(bookIdToDelete)).rejects.toThrow(expectedError);

    // リポジトリのdeleteメソッドが呼び出されたことを検証
    expect(deleteStub.calls.length).toBe(1);
    expect(deleteStub.calls[0].args).toEqual([bookIdToDelete]);

    // logger.infoが開始ログのために呼び出されたことを検証
    expect(infoStub.calls.length).toBe(1);
    expect(infoStub.calls[0].args).toEqual([
      `Deleting book with id: ${bookIdToDelete}`,
    ]);

    // このusecaseの実装ではエラーをログせずにre-throwするので、errorStubは呼ばれないはず
    expect(errorStub.calls.length).toBe(0);

    deleteStub.restore();
    errorStub.restore();
    infoStub.restore();
  });
});
