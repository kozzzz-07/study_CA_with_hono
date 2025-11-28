// コアレベルの要素しか定義しない。createdAtは技術情報とみなし、ビジネス層やフロントエンドに渡さない
export interface Book {
  id: string;
  summary: string;
  author: string;
  totalPages: number;
}
