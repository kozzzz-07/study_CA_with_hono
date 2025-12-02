## set up
1. `deno task drizzle:generate`
2. `deno task drizzle:push`


## local start
```
deno task start
```


## open api
- json
  - /doc
- swagger ui
  - /ui


## 構成について

src/
├─ core/
│ ├─ entities/
│ ├─ ports/
│ └─ usecases/
├─ infrastructure/
│ ├─ api/
│ └─ adapters/
 
- core
  - インターフェース、エンティティはフロントエンドに送る内容
    - ＝ビジネスロジック
  - entities/
    - ビジネスの本質を表すドメインモデルやDTOなど
  - ports/
    - インフラ層と接点となるインターフェース
  - usecases/
    - ビジネスロジック
      - 名前は具体的にしよう

- infrastructure
  - 技術的な要素を入れる
    - ＝ビジネスとは直接関係ない
  - api/
    - コントローラやミドルウェア
  - adapters/
    - 外部ライブラリやサービスの技術的実装


## Adapter-Portsパターン
- Port
  - 例：LoggerPort
    - メソッド定義のみ、どんなロガーを使うかは関心がない
- Adapter
  - XXXLoggerAdapter
    - LoggerPortを実装。特定のライブラに依存した具体的なコードをここだけに閉じる
- AdapterとPortをDIで結びつける

## memo
- https://hono.dev/docs/guides/best-practices
