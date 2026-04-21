import BlogsGrid from "@/components/blogs/BlogsGrid";

import Sidebar from "@/components/blogs/Sidebar";
import Footer from "@/components/footers/Footer";
import Header from "@/components/headers/Header";

import MetaComponent from "@/components/common/MetaComponent";
import Breadcumb from "@/components/common/Breadcumb";
import { createPageMetadata } from "@/config/shop";

const metadata = createPageMetadata("Lưới blog");
export default function BlogGridPage1() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <Header />
      <Breadcumb pageName="Blogs" pageTitle="Blogs" />

      <div className="btn-sidebar-mb d-lg-none right">
        <button data-bs-toggle="offcanvas" data-bs-target="#mbAccount">
          <i className="icon icon-sidebar" />
        </button>
      </div>
      <section className="s-blog-grid sec-blog">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <BlogsGrid />
            </div>
            <div className="col-lg-4">
              <Sidebar prentClass="sidebar-blog d-lg-grid d-none sidebar-content-wrap" />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
