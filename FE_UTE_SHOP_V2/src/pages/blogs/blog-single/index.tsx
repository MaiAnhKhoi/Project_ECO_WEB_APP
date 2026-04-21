import { useEffect, useState } from "react";
import BlogSingle from "@/components/blogs/BlogSingle";
import RelatedBlogs from "@/components/blogs/RelatedBlogs";
import Footer from "@/components/footers/Footer";
import Header from "@/components/headers/Header";
import { useParams } from "react-router-dom";
import blogApi, { BlogResponse } from "@/services/blogApi";

import MetaComponent from "@/components/common/MetaComponent";
import { createPageMetadata } from "@/config/shop";

const metadata = createPageMetadata("Chi tiết blog");

export default function BlogDetailsPage1() {
  const params = useParams();
  const id = params.id ? parseInt(params.id, 10) : undefined;

  const [blog, setBlog] = useState<BlogResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchBlog(id);
    }
  }, [id]);

  const fetchBlog = async (blogId: number) => {
    try {
      setLoading(true);
      const response = await blogApi.getBlogById(blogId);
      setBlog(response.data);
    } catch (error) {
      console.error("Failed to fetch blog:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="container py-5 text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!blog) {
    return (
      <>
        <Header />
        <div className="container py-5 text-center">
          <h3>Không tìm thấy bài viết</h3>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <MetaComponent meta={metadata} />
      <Header />
      <BlogSingle blog={blog} />
      <RelatedBlogs categoryId={blog.category?.id} currentBlogId={blog.id} />
      <Footer />
    </>
  );
}
