import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import blogApi, { BlogResponse, BlogCategory } from "@/services/blogApi";

export default function BlogSidebar() {
  const [recentPosts, setRecentPosts] = useState<BlogResponse[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [recentRes, categoriesRes] = await Promise.all([
        blogApi.getLatestBlogs(5),
        blogApi.getActiveCategories(),
      ]);
      setRecentPosts(recentRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error("Failed to fetch sidebar data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sidebar-blog d-lg-grid d-none sidebar-content-wrap">
      <div className="sb-item">
        <p className="sb-title text-xl fw-medium">Bài viết gần đây</p>
        <div className="sb-content">
          {loading ? (
            <div className="text-center py-3">
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Đang tải...</span>
              </div>
            </div>
          ) : (
            <ul className="recent-blog-list">
              {recentPosts.map((post) => (
                <li className="hover-img" key={post.id}>
                  <div className="image">
                    <Link
                      to={`/blog-single/${post.id}`}
                      className="img-style d-block"
                    >
                      <img
                        src={post.featuredImage || "/images/blog/default.jpg"}
                        alt={post.title}
                        className="lazyload"
                        width={148}
                        height={148}
                      />
                    </Link>
                  </div>
                  <div className="post-content">
                    <Link
                      to={`/blog-single/${post.id}`}
                      className="link text-md fw-medium"
                    >
                      {post.title}
                    </Link>
                    <p className="entry_date">
                      {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="sb-item">
        <p className="sb-title text-xl fw-medium">Danh mục</p>
        <div className="sb-content entry-tag">
          {loading ? (
            <div className="text-center py-3">
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Đang tải...</span>
              </div>
            </div>
          ) : (
            <ul className="tag-blog-list style-list">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link to={`/blog-category/${category.slug}`}>
                    {category.name} ({category.blogCount || 0})
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="sb-item">
        <div className="sb-banner hover-img">
          <div className="image img-style">
            <img
              src="/images/blog/sb-banner.jpg"
              alt="banner"
              className="lazyload"
              width={732}
              height={1036}
            />
          </div>
          <div className="banner-content">
            <p className="title">
              Elevate <br />
              Your Style
            </p>
            <a href="#" className="tf-btn btn-white hover-primary">
              Shop Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
