import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import blogApi, { BlogResponse } from "@/services/blogApi";

export default function BlogsGrid() {
  const [blogs, setBlogs] = useState<BlogResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchBlogs(currentPage);
  }, [currentPage]);

  const fetchBlogs = async (page: number) => {
    try {
      setLoading(true);
      const response = await blogApi.getAllBlogs(page, 12);
      setBlogs(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="s-blog-list-grid grid-2">
        <div className="text-center py-5 col-span-2">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="s-blog-list-grid grid-2">
        <div className="text-center py-5 col-span-2">
          <p className="text-muted">Chưa có bài viết nào</p>
        </div>
      </div>
    );
  }

  return (
    <div className="s-blog-list-grid grid-2">
      {blogs.map((post) => (
        <div className="blog-item hover-img" key={post.id}>
          <div className="entry_image">
            <Link to={`/blog-single/${post.id}`} className="img-style">
              <img
                src={post.featuredImage || "/images/blog/default.jpg"}
                alt={post.title}
                className="lazyload"
                width={952}
                height={496}
              />
            </Link>
          </div>
          <div className="blog-content">
            <div className="entry-tag">
              <ul className="style-list">
                <li>
                  {post.category && (
                    <Link to={`/blog-category/${post.category.slug}`} className="tag-line">
                      {post.category.name}
                    </Link>
                  )}
                </li>
              </ul>
            </div>
            <Link
              to={`/blog-single/${post.id}`}
              className="entry_title d-block text-xl fw-medium link"
            >
              {post.title}
            </Link>
            <p className="entry_sub text-md text-main">{post.excerpt}</p>
            <ul className="entry-meta">
              <li className="entry_author">
                <div className="avatar">
                  <img
                    src={post.author.avatar || "/images/avatar/default.png"}
                    alt={post.author.name}
                    className="lazyload"
                    width={100}
                    height={100}
                  />
                </div>
                <p className="entry_name">
                  Bởi <span className="fw-medium">{post.author.name}</span>
                </p>
              </li>
              <li className="br-line" />
              <li className="entry_date">
                <p className="text-md">
                  {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                </p>
              </li>
              <li className="br-line" />
              <li className="entry_comment">
                <p className="text-md">{post.viewCount} lượt xem</p>
              </li>
            </ul>
          </div>
        </div>
      ))}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <ul className="wg-pagination" style={{ gridColumn: '1 / -1' }}>
          {Array.from({ length: totalPages }, (_, i) => (
            <li key={i} className={currentPage === i ? "active" : ""}>
              <button
                onClick={() => setCurrentPage(i)}
                className="pagination-item"
              >
                {i + 1}
              </button>
            </li>
          ))}
          {currentPage < totalPages - 1 && (
            <li>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                className="pagination-item"
              >
                <i className="icon-arr-right2" />
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
