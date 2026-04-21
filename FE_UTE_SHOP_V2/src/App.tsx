import { useEffect, useState } from "react";
import "../public/scss/main.scss";
import "photoswipe/dist/photoswipe.css";
import "rc-slider/assets/index.css";
import Compare from "@/components/modals/Compare";
import DemoModal from "@/components/modals/DemoModal";
import Login from "@/components/modals/Login";
import MobileMenu from "@/components/modals/MobileMenu";
import SearchModal from "@/components/modals/SearchModal";
import Toolbar from "@/components/modals/Toolbar";
import Context from "@/context/Context";
import ScrollTop from "@/components/common/ScrollTop";
import { setLastPath } from "@/utlis/lastPath";

import SizeGuide from "@/components/modals/SizeGuide";
import QuestionModal from "@/components/modals/QuestionModal";
import ShareModal from "@/components/modals/ShareModal";
import WOW from "@/utlis/wow";
import CartComponent from "@/components/modals/CartComponent";
import DbSidebar from "@/components/modals/DbSidebar";
import { Route, Routes, useLocation } from "react-router-dom";
import ScrollTopBehaviour from "./components/common/ScrollToTopBehaviour";
import HomePage from "./pages";
import ProductPageDefault from "./pages/products/shop-default";
import AccountPage from "./pages/dashboard/account-page";
import ProductDetailPage from "./pages/product-details/product-detail";
import AboutUsPage from "./pages/otherPages/about-us";
import ContactusPage from "./pages/otherPages/contact-us";
import StoreLocationPage from "./pages/otherPages/store-location";
import FaqPage from "./pages/otherPages/faq";
import CartEmptyPage from "./pages/otherPages/cart-empty";
import CartDrawerPage2 from "./pages/otherPages/cart-drawer-v2";
import ViewCartPage from "./pages/otherPages/view-cart";
import BeforeYouLeavePage from "./pages/otherPages/before-you-leave";
import CookiesPage from "./pages/otherPages/cookies";
import NotFoundPage from "./pages/not-found";
import CommingSoonPage from "./pages/otherPages/coming-soon";
import BlogListPage1 from "./pages/blogs/blog-list-01";
import BlogGridPage1 from "./pages/blogs/blog-grid-01";
import BlogDetailsPage1 from "./pages/blogs/blog-single";
import BlogCategoryPage from "./pages/blogs/blog-category";
import AccountOrderPage from "./pages/dashboard/account-orders";
import WishlistPage from "./pages/otherPages/wish-list";
import AccountAddressPage from "./pages/dashboard/account-addresses";
import CheckoutPage from "./pages/otherPages/checkout";
import ComparePage from "./pages/otherPages/compare";
import PrivacyPolicyPage from "./pages/otherPages/privacy-policy";
import OrderSuccessPage from "./pages/otherPages/order-success";
import RtlToggler from "./components/common/RtlToggler";
import Register from "./components/modals/Register";
import ResetPass from "./components/modals/ResetPass";
import { AuthProvider } from "@/context/authContext";
import PrivateRoute from "@/PrivateRoute";
import AccountChangePass from "./pages/dashboard/account-changepass";
import ResetPasswordConfirm from "./components/modals/ResetPasswordConfirm";
import AccountSettingsPage from "./pages/dashboard/account-settings";
import AccountReviewsPage from "./pages/dashboard/account-reviews";
import ReviewDetailPage from "./pages/reviews/review-detail";
import VerifyEmail from "./components/modals/VerifyEmail";

function App(): React.JSX.Element {
  const { pathname } = useLocation();
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Import the script only on the client side
      import("bootstrap/dist/js/bootstrap.esm").then(() => {
        // Module is imported, you can access any exported functionality if
      });
    }
  }, []);
  const privatePaths = [
  "/account-page",
  "/account-orders",
  "/account-addresses",
  "/account-settings",
  "/account-changepass",
  "/wish-list",
  "/checkout",
  "/order-success",
];

useEffect(() => {
  // Nếu KHÔNG phải route private thì lưu lại để quay về
  const isPrivate = privatePaths.some((p) => pathname.startsWith(p));
  if (!isPrivate) {
    setLastPath(pathname);
  }
}, [pathname]);
  useEffect(() => {
    let lastScrollTop = 0;
    const delta = 5;
    let navbarHeight = 0;
    let didScroll = false;
    const header = document.querySelector("header");

    const handleScroll = () => {
      didScroll = true;
    };

    const checkScroll = () => {
      if (didScroll && header) {
        const st = window.scrollY || document.documentElement.scrollTop;
        navbarHeight = header.offsetHeight;

        if (st > navbarHeight) {
          if (st > lastScrollTop + delta) {
            // Scroll down
            header.style.top = `-${navbarHeight}px`;
          } else if (st < lastScrollTop - delta) {
            // Scroll up
            header.style.top = "0";
            header.classList.add("header-bg");
          }
        } else {
          // At top of page
          header.style.top = "";
          header.classList.remove("header-bg");
        }

        lastScrollTop = st;
        didScroll = false;
      }
    };

    // Initial measurement
    if (header) {
      navbarHeight = header.offsetHeight;
    }

    // Set up event listeners
    window.addEventListener("scroll", handleScroll);
    const scrollInterval = setInterval(checkScroll, 250);

    // Cleanup function
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(scrollInterval);
    };
  }, [pathname]); // Empty dependency array means this runs once on mount

  useEffect(() => {
    // Dynamically import Bootstrap
    import("bootstrap")
      .then((bootstrap) => {
        // Close any open modal
        const modalElements = document.querySelectorAll(".modal.show");
        modalElements.forEach((modal) => {
          if (modal instanceof HTMLElement) {
            const modalInstance = bootstrap.Modal.getInstance(modal);
            if (modalInstance) {
              modalInstance.hide();
            }
          }
        });

        // Close any open offcanvas
        const offcanvasElements = document.querySelectorAll(".offcanvas.show");
        offcanvasElements.forEach((offcanvas) => {
          if (offcanvas instanceof HTMLElement) {
            const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvas);
            if (offcanvasInstance) {
              offcanvasInstance.hide();
            }
          }
        });
      })
      .catch((error) => {
        console.error("Error loading Bootstrap:", error);
      });
  }, [pathname]); // Runs every time the route changes

  useEffect(() => {
    const wow = new WOW({
      mobile: false,
      live: false,
    });
    wow.init();
  }, [pathname]);
return (
    <>
      <AuthProvider>
        <Context>
          <Routes>
            <Route path="/">
              <Route index element={<HomePage />} />
              <Route path="shop-default" element={<ProductPageDefault />} />
              <Route
                path="account-page"
                element={
                  <PrivateRoute>
                    <AccountPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="account-orders"
                element={
                  <PrivateRoute>
                    <AccountOrderPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="account-changepass"
                element={
                  <PrivateRoute>
                    <AccountChangePass />
                  </PrivateRoute>
                }
              />
              <Route
                path="account-settings"
                element={
                  <PrivateRoute>
                    <AccountSettingsPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="account-addresses"
                element={
                  <PrivateRoute>
                    <AccountAddressPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="account-reviews"
                element={
                  <PrivateRoute>
                    <AccountReviewsPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="wish-list"
                element={
                  <PrivateRoute>
                    <WishlistPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="checkout"
                element={
                  <PrivateRoute>
                    <CheckoutPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="order-success"
                element={
                  <PrivateRoute>
                    <OrderSuccessPage />
                  </PrivateRoute>
                }
              />
            
              {/* Các route public giữ nguyên */}
              <Route path="product-detail/:id" element={<ProductDetailPage />} />
              <Route path="review/:id" element={<ReviewDetailPage />} />
              <Route path="about-us" element={<AboutUsPage />} />
              <Route path="contact-us" element={<ContactusPage />} />
              <Route path="store-location" element={<StoreLocationPage />} />
              <Route path="faq" element={<FaqPage />} />
              <Route path="cart-empty" element={<CartEmptyPage />} />
              <Route path="cart-drawer-v2" element={<CartDrawerPage2 />} />
              <Route path="view-cart" element={<ViewCartPage />} />
              <Route path="compare" element={<ComparePage />} />
              <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="before-you-leave" element={<BeforeYouLeavePage />} />
              <Route path="cookies" element={<CookiesPage />} />
              <Route path="404" element={<NotFoundPage />} />
              <Route path="coming-soon" element={<CommingSoonPage />} />
              <Route path="blog-list-01" element={<BlogListPage1 />} />
              <Route path="blog-grid-01" element={<BlogGridPage1 />} />
              <Route path="blog-single/:id" element={<BlogDetailsPage1 />} />
              <Route path="blog-category/:slug" element={<BlogCategoryPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
          {/* Modals & components khác giữ nguyên */}
          <DemoModal />
          <CartComponent />
          <Compare />
          <Login />
          <MobileMenu />
          {/* <Quickview /> */}
          <SearchModal />
          <Toolbar />
          <SizeGuide />
          <QuestionModal />
          <ShareModal />
          <DbSidebar />
          <Register />
          <ResetPass />
          <ResetPasswordConfirm/>
          <VerifyEmail/>
        </Context>
      </AuthProvider>

      <ScrollTop />
      <RtlToggler />
      <ScrollTopBehaviour />
    </>
  );
}

export default App;
