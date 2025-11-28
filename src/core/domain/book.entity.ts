import { randomUUID } from "node:crypto";

// Bookエンティティの形状を定義するインターフェース
export interface Book {
  readonly id: string;
  readonly summary: string;
  readonly author: string | null;
  readonly totalPages: number;
}

/**
 * 新しいBookエンティティを生成するためのファクトリ関数。
 * ここでビジネスルールを検証する。例えばsummaryは50文字制限とか
 */
export const createBook = (props: {
  summary: string;
  author: string | null;
  totalPages: number;
}): Book => {
  // --- ビジネスロジックがあればここに ---
  return { id: randomUUID(), ...props };
};

/**
 * DBなどから取得したデータを元にドメインオブジェクトを復元するためのファクトリ関数。
 */
export const hydrateBook = (props: {
  id: string;
  summary: string;
  author: string | null;
  totalPages: number;
}): Book => {
  return { ...props };
};
