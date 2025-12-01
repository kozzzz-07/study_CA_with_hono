import { beforeEach, describe, it } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";
import { spy, stub } from "jsr:@std/testing/mock";

import { makeListBooks, ListBooks } from "./index.ts";
import { BookRepository } from "../../ports/database.port.ts";
import { Logger } from "../../ports/logger.port.ts";
import { Book } from "../../entities/book.entity.ts";

describe("ListBooks usecase", () => {
  let mockBookRepository: BookRepository;
  let mockLogger: Logger;
  let listBooks: ListBooks;

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

  it("リポジトリが書籍データを返す場合、その書籍のリストを返却する", async () => {
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

    // listメソッドを、expectedBooksを返す偽の実装に置き換える
    const listStub = stub(mockBookRepository, "list", async () => {
      return await Promise.resolve(expectedBooks);
    });

    // モックを注入してテスト対象のusecase関数を生成
    listBooks = makeListBooks({
      repository: mockBookRepository,
      logger: mockLogger,
    });

    // Act (実行)
    const actualBooks = await listBooks();

    // Assert (検証)
    expect(actualBooks).toEqual(expectedBooks); // 返り値が期待通りか
    expect(listStub.call.length).toBe(1); // リポジトリのlistメソッドが1回呼ばれたか

    listStub.restore();
  });

  it("リポジトリが空の配列を返す場合、空のリストを返却する", async () => {
    // Arrange (準備)
    const infoStub = stub(mockLogger, "info"); // logger.infoが呼ばれることを確認するためのスパイ

    listBooks = makeListBooks({
      repository: mockBookRepository, // ここではデフォルトの「空配列を返す」挙動を使う
      logger: mockLogger,
    });

    // Act (実行)
    const actualBooks = await listBooks();

    // Assert (検証)
    expect(actualBooks).toEqual([]); // 空の配列が返ってくるか
    expect(infoStub.calls[1].args).toEqual(["Found 0 books"]);
  });
});
