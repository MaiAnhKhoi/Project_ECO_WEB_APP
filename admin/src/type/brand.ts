// src/type/brand.ts

export interface Brand {
  id: number;
  name: string;
  slug: string;
  imageUrl?: string | null;
  createdAt?: string;
}

export interface BrandPage {
  content: Brand[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
