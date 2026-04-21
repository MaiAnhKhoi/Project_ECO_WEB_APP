import api from "@/config/api";

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

const blogApi = {
  // Lấy tất cả blog (có phân trang)
  getAllBlogs(page = 0, size = 10) {
    return api.get<BlogPageResponse>(`/blogs?page=${page}&size=${size}`);
  },

  // Lấy blog mới nhất
  getLatestBlogs(limit = 5) {
    return api.get<BlogResponse[]>(`/blogs/latest?limit=${limit}`);
  },

  // Lấy blog xem nhiều nhất
  getTopViewedBlogs(limit = 5) {
    return api.get<BlogResponse[]>(`/blogs/top-viewed?limit=${limit}`);
  },

  // Lấy blog theo category slug
  getBlogsByCategory(categorySlug: string, page = 0, size = 10) {
    return api.get<BlogPageResponse>(`/blogs/category/${categorySlug}?page=${page}&size=${size}`);
  },

  // Lấy chi tiết blog theo ID
  getBlogById(id: number) {
    return api.get<BlogResponse>(`/blogs/${id}`);
  },

  // Lấy chi tiết blog theo slug
  getBlogBySlug(slug: string) {
    return api.get<BlogResponse>(`/blogs/slug/${slug}`);
  },

  // Tìm kiếm blog
  searchBlogs(keyword: string, page = 0, size = 10) {
    return api.get<BlogPageResponse>(`/blogs/search?keyword=${keyword}&page=${page}&size=${size}`);
  },

  // ==================== BLOG CATEGORIES ====================

  // Lấy tất cả danh mục
  getAllCategories() {
    return api.get<BlogCategory[]>("/blog-categories");
  },

  // Lấy danh mục đang active
  getActiveCategories() {
    return api.get<BlogCategory[]>("/blog-categories/active");
  },

  // Lấy danh mục theo slug
  getCategoryBySlug(slug: string) {
    return api.get<BlogCategory>(`/blog-categories/slug/${slug}`);
  },

  // ==================== BLOG COMMENTS ====================

  // Lấy comments của một blog
  getBlogComments(blogId: number, page = 0, size = 10) {
    return api.get<BlogCommentPageResponse>(`/blogs/${blogId}/comments?page=${page}&size=${size}`);
  },

  // Thêm comment mới (cần authentication)
  addComment(blogId: number, content: string) {
    return api.post<BlogCommentResponse>(`/blogs/${blogId}/comments`, { content });
  },

  // Xóa comment (cần authentication)
  deleteComment(commentId: number) {
    return api.delete(`/blogs/comments/${commentId}`);
  },
};

export default blogApi;

