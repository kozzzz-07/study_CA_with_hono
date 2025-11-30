## 使用技術
- deno
- TypeScript
- hono

## 方針
- クリーンアーキテクチャを意識してください
- class構文は使用しないでください

## プロジェクト構成について

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