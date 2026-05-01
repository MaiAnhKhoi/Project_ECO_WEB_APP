import { httpClient } from "@/lib/httpClient";
import type {
  BlogCommentPageResponse,
  BlogCommentResponse,
  BlogPageResponse,
  BlogResponse,
} from "@/types/blog";

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
