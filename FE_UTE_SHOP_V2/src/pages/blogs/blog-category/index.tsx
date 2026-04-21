import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Footer from "@/components/footers/Footer";
import Header from "@/components/headers/Header";
import MetaComponent from "@/components/common/MetaComponent";
import Breadcumb from "@/components/common/Breadcumb";
import { createPageMetadata } from "@/config/shop";
import BlogSidebar from "@/components/blogs/BlogSidebar";
import blogApi, { BlogResponse, BlogCategory } from "@/services/blogApi";

const metadata = createPageMetadata("Blog theo danh mục");

export default function BlogCategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  
  const [blogs, setBlogs] = useState<BlogResponse[]>([]);
  const [category, setCategory] = useState<BlogCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (slug) {
      fetchCategory();
      setCurrentPage(0); // Reset về trang đầu khi đổi category
    }
  }, [slug]);

  useEffect(() => {
    if (slug) {
      fetchBlogs(currentPage);
    }
  }, [currentPage, slug]);

  const fetchCategory = async () => {
    try {
      const response = await blogApi.getCategoryBySlug(slug!);
      setCategory(response.data);
    } catch (error) {
      console.error("Failed to fetch category:", error);
    }
  };

  const fetchBlogs = async (page: number) => {
    try {
      setLoading(true);
      const response = await blogApi.getBlogsByCategory(slug!, page, 10);
      setBlogs(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MetaComponent meta={metadata} />
      <Header />
      <Breadcumb 
        pageName={category?.name || "Danh mục blog"} 
        pageTitle={category?.name || "Danh mục blog"} 
      />

      <div className="btn-sidebar-mb d-lg-none right">
        <button data-bs-toggle="offcanvas" data-bs-target="#mbAccount">
          <i className="icon icon-sidebar" />
        </button>
      </div>

      <section className="s-blog-list-v1 sec-blog space-blog">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Đang tải...</span>
                  </div>
                </div>
              ) : blogs.length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-muted">Chưa có bài viết nào trong danh mục này</p>
                </div>
              ) : (
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
                              {blog.category && (
                                <Link to={`/blog-category/${blog.category.slug}`} className="tag-line">
                                  {blog.category.name}
                                </Link>
                              )}
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
              )}
            </div>

            <div className="col-lg-4">
              <BlogSidebar />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

