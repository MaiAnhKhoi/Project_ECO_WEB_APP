// src/type/category.ts

export interface Category {
  id: number;
  parentId?: number | null;
  name: string;
  slug: string;
  imageUrl?: string | null;
  sortOrder: number;
  description?: string | null;
  createdAt: string;
}

export interface CategoryPage {
  content: Category[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // page index
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
