export interface ReviewAdminDto {
  id: number;
  productId: number;
  productName: string;
  userId: number;
  userName: string;
  rating: number;
  status: string;
  content?: string | null;
  createdAt: string;
  imageUrls: string[];
}

export interface ReviewAdminPageResponse {
  content: ReviewAdminDto[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

