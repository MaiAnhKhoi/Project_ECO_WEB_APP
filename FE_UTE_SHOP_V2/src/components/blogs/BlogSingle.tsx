import { Link } from "react-router-dom";
import { useState, useEffect, useCallback, useRef } from "react";
import { BlogResponse, BlogCommentResponse } from "@/services/blogApi";
import blogApi from "@/services/blogApi";
import { useAuth } from "@/context/authContext";
import { Offcanvas } from "bootstrap";

export default function BlogSingle({ blog }: { blog: BlogResponse }) {
  const [comments, setComments] = useState<BlogCommentResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const blogIdRef = useRef<number | null>(null);

  const fetchComments = useCallback(
    async (blogId: number, forceRefresh = false) => {
      if (!forceRefresh && blogIdRef.current === blogId) return;

      try {
        setLoading(true);
        blogIdRef.current = blogId;
        const response = await blogApi.getBlogComments(blogId, 0, 50);
        setComments(response.data.content);
      } catch (error) {
        console.error("Không thể tải danh sách bình luận:", error);
        setComments([]);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (blog?.id) {
      fetchComments(blog.id);
    }
    return () => {
      blogIdRef.current = null;
    };
  }, [blog?.id, fetchComments]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!commentContent.trim()) return alert("Vui lòng nhập nội dung bình luận!");
    if (!user) return alert("Vui lòng đăng nhập để bình luận!");

    try {
      setSubmitting(true);
      await blogApi.addComment(blog.id, commentContent.trim());
      setCommentContent("");
      await fetchComments(blog.id, true);
    } catch (error: any) {
      alert(
        error?.response?.data?.message ||
        error?.message ||
        "Không thể đăng bình luận!"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const commentCount =
    comments.length > 0 ? comments.length : blog.commentCount ?? 0;

  return (
    <>
      {/* =======================================
          CSS CHÈN TRỰC TIẾP VÀO COMPONENT
      ======================================== */}
      <style>{`
        .comment-item {
          display: flex;
          gap: 12px;
          padding: 14px 16px;
          border-radius: 10px;
          border: 1px solid #e5e7eb;
          background-color: #fff;
          transition: box-shadow .2s ease, transform .1s ease, border-color .2s ease;
        }
        .comment-item:hover {
          box-shadow: 0 8px 18px rgba(0,0,0,0.08);
          border-color: #d1d5db;
          transform: translateY(-1px);
        }
        .comment-avatar img {
          width: 44px;
          height: 44px;
          border-radius: 999px;
          object-fit: cover;
          border: 2px solid #f3f4f6;
        }
        .comment-author {
          font-size: 15px;
          font-weight: 600;
          margin-bottom: 2px;
          color: #111827;
        }
        .comment-date {
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 6px;
        }
        .comment-text {
          font-size: 14px;
          color: #374151;
          line-height: 1.6;
          white-space: pre-line;
        }
        .leave-comment-wrap .wrap {
          padding: 20px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          background-color: #f9fafb;
        }
        .leave-comment-wrap fieldset {
          border: none;
          flex: 1;
        }
        .leave-comment-wrap input,
        .leave-comment-wrap textarea {
          width: 100%;
          border-radius: 8px;
          border: 1px solid #d1d5db;
          padding: 10px;
          font-size: 14px;
          outline: none;
          transition: .15s ease;
        }
        .leave-comment-wrap input:focus,
        .leave-comment-wrap textarea:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 1px rgba(37,99,235,.2);
        }
      `}</style>

      <section className="s-blog-single line-bottom-container">
        <div className="container">
          {/* HEADER */}
          <div className="heading blog-item">
            <div className="entry-tag">
              <ul className="style-list">
                {blog.category && (
                  <li>
                    <Link
                      to={`/blog-category/${blog.category.slug}`}
                      className="type-life"
                    >
                      {blog.category.name}
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            <p className="entry_title display-sm fw-medium">{blog.title}</p>

            <ul className="entry-meta">
              <li className="entry_author">
                <div className="avatar">
                  <img
                    src={blog.author.avatar || "/images/avatar/default.png"}
                    alt={blog.author.name}
                    width={100}
                    height={100}
                  />
                </div>
                <p className="entry_name">
                  Đăng bởi <span className="fw-medium">{blog.author.name}</span>
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
                <p className="text-md">{commentCount} bình luận</p>
              </li>
            </ul>
          </div>

          {/* CONTENT */}
          <div className="content">
            {blog.featuredImage && (
              <div className="entry_image">
                <img
                  src={blog.featuredImage}
                  alt={blog.title}
                  width={1440}
                  height={501}
                />
              </div>
            )}

            {/* NỘI DUNG BÀI VIẾT */}
            <div
              className="blog-content-html"
              style={{
                whiteSpace: "pre-line",
                lineHeight: "1.7",
                fontSize: "15px",
                color: "#374151",
              }}
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* TAG + SHARE */}
            <div className="bot">
              {blog.tags && (
                <div className="entry-tag">
                  <p>Thẻ :</p>
                  <ul className="style-list">
                    {blog.tags.split(",").map((tag, i) => (
                      <li key={i}>
                        <a href="#">{tag.trim()}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* BÌNH LUẬN */}
          <div className="leave-comment-wrap">
            <p className="title">Bình luận ({commentCount})</p>

            {/* LIST COMMENT */}
            <div className="comments-list mb-4">
              {loading ? (
                <p>Đang tải...</p>
              ) : comments.length === 0 ? (
                <p>Chưa có bình luận nào.</p>
              ) : (
                comments.map((c) => (
                  <div className="comment-item" key={c.id}>
                    <div className="comment-avatar">
                      <img
                        src={c.userAvatar || "/images/avatar/default.png"}
                        alt={c.userName}
                      />
                    </div>
                    <div className="comment-body">
                      <p className="comment-author">{c.userName}</p>
                      <p className="comment-date">
                        {new Date(c.createdAt).toLocaleString("vi-VN")}
                      </p>
                      <p className="comment-text">{c.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* FORM COMMENT */}
            {user ? (
              <form className="form-default" onSubmit={handleSubmitComment}>
                <div className="wrap">
                  <div className="cols" style={{ display: "flex", gap: "16px" }}>
                    <fieldset>
                      <label>Tên của bạn*</label>
                      <input value={user.name} readOnly />
                    </fieldset>
                    <fieldset>
                      <label>Email*</label>
                      <input value={user.email || ""} readOnly />
                    </fieldset>
                  </div>

                  <fieldset className="textarea">
                    <label>Nội dung bình luận*</label>
                    <textarea
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      required
                    />
                  </fieldset>

                  <div className="button-submit" style={{ marginTop: "12px" }}>
                    <button
                      className="tf-btn text-sm animate-btn"
                      type="submit"
                      disabled={submitting}
                    >
                      {submitting ? "Đang đăng..." : "Gửi bình luận"}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <p>
                Vui lòng{" "}
                <button
                  onClick={() => {
                    const loginEl = document.getElementById("login") as HTMLElement | null;
                    if (!loginEl) return;

                    // Ép kiểu rõ ràng cho Offcanvas
                    let bsOffcanvas = Offcanvas.getInstance(loginEl as HTMLElement);
                    if (!bsOffcanvas) {
                      bsOffcanvas = new Offcanvas(loginEl as HTMLElement);
                    }
                    bsOffcanvas.show();
                  }}

                >
                  đăng nhập
                </button>{" "}
                để bình luận.
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
