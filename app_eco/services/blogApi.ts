import { httpClient } from "@/lib/httpClient";

export type BlogAuthor = {
  id: number;
  name: string;
  avatar?: string;
};

export type BlogCategory = {
  id: number;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  sortOrder: number;
  isActive: boolean;
  blogCount?: number;
};

export type BlogResponse = {
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
};

export type BlogPageResponse = {
  content: BlogResponse[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
};

export type BlogCommentResponse = {
  id: number;
  blogId: number;
  userId: number;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
};

export type BlogCommentPageResponse = {
  content: BlogCommentResponse[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
};

export const blogApi = {
  getAllBlogs: (page = 0, size = 10) =>
    httpClient.get<BlogPageResponse>(`/blogs?page=${page}&size=${size}`),
  getBlogById: (id: number) => httpClient.get<BlogResponse>(`/blogs/${id}`),
  getBlogBySlug: (slug: string) =>
    httpClient.get<BlogResponse>(`/blogs/slug/${slug}`),
  getBlogComments: (blogId: number, page = 0, size = 10) =>
    httpClient.get<BlogCommentPageResponse>(
      `/blogs/${blogId}/comments?page=${page}&size=${size}`
    ),
  addComment: (token: string, blogId: number, content: string) =>
    httpClient.post<BlogCommentResponse>(
      `/blogs/${blogId}/comments`,
      { content },
      { token }
    ),
};

