import { beforeEach, describe, it } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";
import { spy, stub } from "jsr:@std/testing/mock";

import { makeGetBook, GetBook } from "./index.ts";
import { BookRepository } from "../../ports/database.port.ts";
import { Logger } from "../../ports/logger.port.ts";
import { Book } from "../../entities/book.entity.ts";
import { randomUUID } from "node:crypto";

describe("GetBooks usecase", () => {
  let mockBookRepository: BookRepository;
  let mockLogger: Logger;
  let getBook: GetBook;

  // 依存性のモックを初期化
  beforeEach(() => {
    // Arrange (準備) ①: 依存性のモックオブジェクトを作成
    mockBookRepository = {
      // listメソッドが呼ばれたときの挙動を定義。ここでは一旦空のPromiseを返す。
      list: async () => await Promise.resolve([]),
      // BookRepositoryインターフェースが持つ他のメソッドも、空の関数として定義しておく。
      findById: async () => await Promise.resolve(null),
      create: async (b) => await Promise.resolve(b as Book),
      delete: async () => await Promise.resolve(),
    };

    mockLogger = {
      // Loggerインターフェースが持つメソッドを空の関数として定義。
      info: () => {},
      warn: () => {},
      error: () => {},
      debug: () => {},
    };
  });

  it("リポジトリが書籍データを返す場合、その書籍を返却する", async () => {
    // Arrange (準備) ②: このテストケース専用の準備
    const expectedBooks: Book[] = [
      {
        id: "1",
        title: "Book 1",
        summary: "...",
        author: "A",
        totalPages: 100,
      },
      {
        id: "2",
        title: "Book 2",
        summary: "...",
        author: "B",
        totalPages: 200,
      },
    ];

    const getStub = stub(mockBookRepository, "findById", async () => {
      return await Promise.resolve(expectedBooks[0]);
    });

    // モックを注入してテスト対象のusecase関数を生成
    getBook = makeGetBook({
      repository: mockBookRepository,
      logger: mockLogger,
    });

    // Act (実行)
    const actualBook = await getBook(expectedBooks[0].id);

    // Assert (検証)
    expect(actualBook).toEqual(expectedBooks[0]); // 返り値が期待通りか
    expect(getStub.call.length).toBe(1);

    getStub.restore();
  });

  it("リポジトリが空の配列を返す場合、nullを返す", async () => {
    const id = randomUUID();

    // Arrange (準備)
    const warnStub = stub(mockLogger, "warn");

    getBook = makeGetBook({
      repository: mockBookRepository, // ここではデフォルトの「空配列を返す」挙動を使う
      logger: mockLogger,
    });

    // Act (実行)
    const actualBook = await getBook(id);

    // Assert (検証)
    expect(actualBook).toBeNull();
    expect(warnStub.calls[0].args).toEqual([`Book with id: ${id} not found`]);
  });
});
