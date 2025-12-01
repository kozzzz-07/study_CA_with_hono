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

## テスト方針
- AAAパターンで実装してください
- テスト設計については、一般的な視点に加えて、t_wadaのTDD視点も含めて
- 具体的な実装方法は以下のドキュメントを適宜参照して
  - https://docs.deno.com/examples/writing_tests/
  - https://docs.deno.com/examples/testing_tutorial/
  - https://docs.deno.com/examples/mocking_tutorial/
  - https://docs.deno.com/examples/stubbing_tutorial/
  - https://docs.deno.com/examples/snapshot_tutorial/
  - https://docs.deno.com/examples/spy_functions/
  - https://docs.deno.com/examples/deno_test/
  - https://docs.deno.com/examples/deno_coverage/
  - https://docs.deno.com/examples/web_testing_tutorial/
  - https://docs.deno.com/examples/bdd_tutorial/