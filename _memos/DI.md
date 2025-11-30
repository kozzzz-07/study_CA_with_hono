## 1　Composition Rootパターン

最初案。
一元管理ができるけど、依存の隠蔽に不安。
dependencies.useCases.getBookのように必要なusecaseを選ぶ必要あり。
つまり、Service Locatorパターンに近いので、再検討。

src/infrastructure/api/
 ├─ controllers/
 │  ├─ book/
 │  │  ├─ books.ts
 │  │  └─ book.dependencies.ts  <-- Book関連のusecaseを組み立てる
 │  └─ user/
 │     ├─ users.ts
 │     └─ user.dependencies.ts    <-- User関連のusecaseを組み立てる
 │
 ├─ shared.dependencies.ts      <-- DB接続やLoggerなど共有の依存性を定義
 └─ dependencies.ts             <-- ★ すべての依存性をここから集約・エクスポート

## 2　ローカルComposition Rootパターン

main.ts で結果的に組み立ててるので、グローバルなComposition Rootはmain.tsとみなせる

src/
├── core/
│   ├── entities/
│   │   └── book.entity.ts              # Bookエンティティの定義、hydrateBook関数
│   ├── ports/
│   │   ├── database.port.ts            # BookRepositoryインターフェース（抽象）
│   │   └── logger.port.ts              # Loggerインターフェース（抽象）
│   └── usecases/
│       └── get-book.usecase.ts         # makeGetBook usecaseファクトリ関数（portに依存）
│
└── infrastructure/
    ├── adapters/
    │   ├── orm/
    │   │   └── drizzle/
    │   │       └── book/
    │   │           └── book.repository.ts  # drizzleOrmRepository（BookRepositoryの実装）
    │   └── pino-logger/
    │       └── adapter.ts                  # logger（Loggerインターフェースの実装）
    │
    └── api/
        └── controllers/
            └── book/
                ├── books.ts                # Honoコントローラ（book.dependencies.tsからusecaseをインポート）
                └── book.dependencies.ts    # 【★ ここがポイント】BookドメインのDIコンテナ
                                            #   - adapters層の具象実装（drizzleOrmRepository, logger）をインポート
                                            #   - core層のusecaseファクトリ（makeGetBook）をインポート
                                            #   - 両者を結合してusecaseを生成し、books.tsにエクスポート

説明
  * `core/`:
    ビジネスロジックとインターフェース（抽象）を定義します。具体的な実装（データベースの種類やロガーライブラリなど）に
    は依存しません。
  * `infrastructure/adapters/`:
    core/portsで定義されたインターフェースの具体的な実装（具象）を提供します。ここがDrizzleやPinoなどの外部ライブラリと
    直接連携します。
  * `infrastructure/api/controllers/book/book.dependencies.ts`:
      * これがBookドメインのローカルなComposition Rootの役割を果たします。
      * adapters層から具象実装（drizzleOrmRepository、logger）を直接インポートします。
      * core/usecases層からusecaseファクトリ（makeGetBook）をインポートします。
      * それらを組み合わせて（DIして）、実際に使用するusecase関数（getBookなど）を生成し、books.tsにエクスポートします
        。
  * `infrastructure/api/controllers/book/books.ts`:
      * このコントローラは、隣接するbook.dependencies.tsから、すでに組み立てられDIされたusecase関数をインポートして利用
        します。
      * コントローラ自身は、usecaseがどのように構築されたか、どのような具象実装に依存しているかを知る必要がありません。