// src/core/usecases/createBook/index.test.ts

import { beforeEach, describe, it } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";
import { stub } from "jsr:@std/testing/mock";

import { makeCreateBook } from "./index.ts"; // makeCreateBookはindex.tsからエクスポートされている
import { BookRepository } from "../../ports/database.port.ts";
import { Logger } from "../../ports/logger.port.ts";
import { Book, CreateBookInput } from "../../entities/book.entity.ts"; // モックの型アサーションに必要

describe("makeCreateBook usecase", () => {
  let mockBookRepository: BookRepository;
  let mockLogger: Logger;
  let createBook: (args: CreateBookInput) => Promise<Book>; // CreateBookの型

  beforeEach(() => {
    // 各テストケースの前にモック依存性を初期化
    mockBookRepository = {
      list: async () => [],
      findById: async () => null,
      create: async (b) => b as Book, // 他のメソッドのデフォルトの実装
      delete: async () => {},
    };
    mockLogger = {
      info: () => {},
      warn: () => {},
      error: () => {},
      debug: () => {},
    };

    // 新しいモックでユースケースのインスタンスを生成
    createBook = makeCreateBook({
      repository: mockBookRepository,
      logger: mockLogger,
    });
  });

  it("有効な入力で書籍を正常に作成できる", async () => {
    // Arrange
    const bookInput: CreateBookInput = {
      title: "Clean Code",
      summary: "A handbook of agile software craftsmanship.",
      author: "Robert C. Martin",
      totalPages: 464,
    };
    const expectedBook: Book = {
      id: "generated-book-id-123", // リポジトリがIDを生成すると仮定
      ...bookInput,
    };

    // リポジトリのcreateをスタブし、期待される作成済み書籍を返す
    const createStub = stub(mockBookRepository, "create", async () => {
      return await Promise.resolve(expectedBook);
    });
    // logger.infoをスタブし、呼び出しを捕捉
    const infoStub = stub(mockLogger, "info");

    // Act
    const result = await createBook(bookInput);

    // Assert
    // 返された書籍が期待される書籍と一致することを確認
    expect(result).toEqual(expectedBook);

    // repository.createが正しく呼び出されたことを確認
    expect(createStub.calls.length).toBe(1);
    expect(createStub.calls[0].args).toEqual([bookInput]);

    // logger.infoが正しいメッセージで呼び出されたことを確認
    expect(infoStub.calls.length).toBe(2); // 開始時と成功時の2回
    expect(infoStub.calls[0].args).toEqual([
      `Creating book with title: ${bookInput.title}`,
    ]);
    expect(infoStub.calls[1].args).toEqual([
      `Successfully created book with id: ${expectedBook.id}`,
    ]);

    createStub.restore();
    infoStub.restore();
  });

  it("リポジトリがエラーを投げた場合、usecaseもエラーを伝播する", async () => {
    // Arrange
    const bookInput: CreateBookInput = {
      title: "Failing Book",
      summary: "This book will cause an error.",
      author: "Error Maker",
      totalPages: 10,
    };
    const expectedError = new Error("Database insert failed");

    // リポジトリのcreateをスタブし、エラーを投げる
    const createStub = stub(mockBookRepository, "create", async () => {
      throw expectedError;
    });
    // logger.infoをスタブし、開始ログを捕捉
    const infoStub = stub(mockLogger, "info");

    // Act & Assert
    // ユースケースがエラーをスローすることを確認
    await expect(createBook(bookInput)).rejects.toThrow(expectedError);

    // repository.createが呼び出されたことを確認
    expect(createStub.calls.length).toBe(1);
    expect(createStub.calls[0].args).toEqual([bookInput]);

    // logger.infoが開始時に呼び出されたことを確認
    expect(infoStub.calls.length).toBe(1);
    expect(infoStub.calls[0].args).toEqual([
      `Creating book with title: ${bookInput.title}`,
    ]);

    createStub.restore();
    infoStub.restore();
  });
});
