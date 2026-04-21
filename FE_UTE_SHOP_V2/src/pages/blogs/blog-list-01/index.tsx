import BlogsList from "@/components/blogs/BlogsList";
import BlogSidebar from "@/components/blogs/BlogSidebar";
import Collections from "@/components/blogs/Collections";
import Footer from "@/components/footers/Footer";
import Header from "@/components/headers/Header";
import MetaComponent from "@/components/common/MetaComponent";
import Breadcumb from "@/components/common/Breadcumb";
import { createPageMetadata } from "@/config/shop";

const metadata = createPageMetadata("Danh sách blog");
export default function BlogListPage1() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <Header />
      <Breadcumb pageName="Blogs" pageTitle="Blogs" />

      <Collections />
      <div className="btn-sidebar-mb d-lg-none right">
        <button data-bs-toggle="offcanvas" data-bs-target="#mbAccount">
          <i className="icon icon-sidebar" />
        </button>
      </div>
      <section className="s-blog-list-v1 sec-blog space-blog">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <BlogsList />
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
