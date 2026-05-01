/** Blog — khớp `blogApi` */

export interface BlogAuthor {
  id: number;
  name: string;
  avatar?: string;
}

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  sortOrder: number;
  isActive: boolean;
  blogCount?: number;
}

export interface BlogResponse {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  category: BlogCategory;
  tags?: string;
  status: string;
  viewCount: number;
  commentCount?: number;
  author: BlogAuthor;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface BlogPageResponse {
  content: BlogResponse[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
}

export interface BlogCommentResponse {
  id: number;
  blogId: number;
  userId: number;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
}

export interface BlogCommentPageResponse {
  content: BlogCommentResponse[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
}
