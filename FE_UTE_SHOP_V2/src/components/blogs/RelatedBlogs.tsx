"use client";
import { useEffect, useState } from "react";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";
import blogApi, { BlogResponse } from "@/services/blogApi";

interface RelatedBlogsProps {
  categoryId?: number;
  currentBlogId?: number;
}

export default function RelatedBlogs({
  categoryId,
  currentBlogId,
}: RelatedBlogsProps = {}) {
  const [blogs, setBlogs] = useState<BlogResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedBlogs = async () => {
      try {
        setLoading(true);
        const response = await blogApi.getLatestBlogs(12);

        let data: BlogResponse[] = response.data || [];

        if (categoryId) {
          data = data.filter((b) => b.category?.id === categoryId);
        }

        if (currentBlogId) {
          data = data.filter((b) => b.id !== currentBlogId);
        }

        setBlogs(data.slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch related blogs:", error);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedBlogs();
  }, [categoryId, currentBlogId]);

  if (loading || blogs.length === 0) {
    return null;
  }

  const getExcerpt = (post: BlogResponse) => {
    const raw = post.excerpt || "";
    if (!raw) return "";
    return raw.length > 120 ? raw.slice(0, 117) + "..." : raw;
  };

  return (
    <section className="flat-spacing-25">
      <div className="container">
        <div className="flat-title mb_2 wow fadeInUp">
          <h4 className="title">Bài viết liên quan</h4>
        </div>

        <Swiper
          dir="ltr"
          className="swiper tf-swiper"
          {...{
            slidesPerView: 1,
            spaceBetween: 12,
            speed: 800,
            observer: true,
            observeParents: true,
            slidesPerGroup: 1,
            navigation: {
              clickable: true,
              nextEl: ".nav-next-new",
              prevEl: ".nav-prev-new",
            } as any,
            pagination: { el: ".sw-pagination-new", clickable: true },
            breakpoints: {
              577: { slidesPerView: 2, spaceBetween: 12, slidesPerGroup: 2 },
              1200: { slidesPerView: 3, spaceBetween: 24, slidesPerGroup: 3 },
            },
          }}
          modules={[Pagination, Navigation]}
        >
          {blogs.map((post) => (
            <SwiperSlide
              className="swiper-slide"
              key={post.id}
              style={{ height: "100%" }} // cho slide full chiều cao
            >
              <div
                className="blog-item hover-img blog-item-equal"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <div className="entry_image">
                  <Link to={`/blog-single/${post.id}`} className="img-style">
                    <img
                      src={post.featuredImage || "/images/blog/default.jpg"}
                      alt={post.title}
                      className="lazyload"
                      width={928}
                      height={790}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/images/blog/default.jpg";
                      }}
                      style={{
                        width: "100%",
                        height: "240px", // fix chiều cao ảnh cho đều
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  </Link>
                </div>

                <div
                  className="blog-content"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                  }}
                >
                  <div className="entry-tag">
                    <ul className="style-list">
                      {post.category && (
                        <li>
                          <Link
                            to={`/blog-category/${post.category.slug}`}
                            className="tag-line"
                          >
                            {post.category.name}
                          </Link>
                        </li>
                      )}
                    </ul>
                  </div>

                  <Link
                    to={`/blog-single/${post.id}`}
                    className="entry_title d-block text-xl fw-medium link text-line-clamp-2"
                  >
                    {post.title}
                  </Link>

                  {getExcerpt(post) && (
                    <p className="entry_sub text-md text-main text-line-clamp-3">
                      {getExcerpt(post)}
                    </p>
                  )}

                  <ul
                    className="entry-meta"
                    style={{
                      marginTop: "auto", // đẩy meta xuống đáy card
                    }}
                  >
                    <li className="entry_author">
                      <div className="avatar">
                        <img
                          src={
                            post.author.avatar || "/images/avatar/default.png"
                          }
                          alt={post.author.name}
                          className="lazyload"
                          width={100}
                          height={100}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/images/avatar/default.png";
                          }}
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                      <p className="entry_name">
                        Bởi{" "}
                        <span className="fw-medium">{post.author.name}</span>
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
                      <p className="text-md">
                        {post.viewCount ?? 0} lượt xem
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </SwiperSlide>
          ))}

          <div className="d-flex d-xl-none sw-dot-default sw-pagination-new justify-content-center" />
        </Swiper>
      </div>
    </section>
  );
}
