import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import blogApi, { BlogResponse } from "@/services/blogApi";

export default function BlogsList() {
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
      const response = await blogApi.getAllBlogs(page, 10);
      console.log("Blog API Response:", response);
      console.log("Response data:", response.data);
      console.log("Content:", response.data?.content);
      
      // Kiểm tra xem response có structure đúng không
      if (response.data && response.data.content) {
        setBlogs(response.data.content);
        setTotalPages(response.data.totalPages);
      } else if (Array.isArray(response.data)) {
        // Nếu response.data là array trực tiếp
        setBlogs(response.data);
        setTotalPages(1);
      } else {
        console.warn("Unexpected response structure:", response.data);
        setBlogs([]);
        setTotalPages(0);
      }
    } catch (error: any) {
      setBlogs([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="s-content">
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="s-content">
        <div className="text-center py-5">
          <p className="text-muted">Chưa có bài viết nào</p>
        </div>
      </div>
    );
  }

  return (
    <div className="s-content">
      {blogs.map((blog) => (
        <div className="blog-item hover-img" key={blog.id}>
          <div className="entry_image">
            <Link to={`/blog-single/${blog.id}`} className="img-style">
              <img
                src={blog.featuredImage || "/images/blog/default.jpg"}
                alt={blog.title}
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
                  <Link to={`/blog-category/${blog.category.slug}`} className="tag-line">
                    {blog.category.name}
                  </Link>
                </li>
              </ul>
            </div>
            <Link
              to={`/blog-single/${blog.id}`}
              className="entry_title d-block text-xl fw-medium link"
            >
              {blog.title}
            </Link>
            <p className="entry_sub text-md text-main">{blog.excerpt}</p>
            <ul className="entry-meta">
              <li className="entry_author">
                <div className="avatar">
                  <img
                    src={blog.author.avatar || "/images/avatar/default.png"}
                    alt={blog.author.name}
                    className="lazyload"
                    width={100}
                    height={100}
                  />
                </div>
                <p className="entry_name">
                  Bởi <span className="fw-medium">{blog.author.name}</span>
                </p>
              </li>
              <li className="br-line" />
              <li className="entry_date">
                <p className="text-md">
                  {new Date(blog.createdAt).toLocaleDateString("vi-VN")}
                </p>
              </li>
              <li className="br-line" />
              <li className="entry_comment">
                <p className="text-md">{blog.viewCount} lượt xem</p>
              </li>
            </ul>
          </div>
        </div>
      ))}

      {/* Pagination */}
      {totalPages > 1 && (
        <ul className="wg-pagination">
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
