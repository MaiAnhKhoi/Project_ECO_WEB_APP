// App.tsx
import { Authenticated, GitHubBanner, Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import { RequireRoles } from "./components/RequireRoles";
import { NavigateToDefaultResource } from "./components/NavigateToDefaultResource";
import { AdminChat } from "./pages/chat/list";

import {
  ErrorComponent,
  ThemedLayout,
  ThemedSider,
  useNotificationProvider,
} from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

import routerProvider, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";

import { dataProvider } from "./provider/dataProvider";
import { App as AntdApp } from "antd";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { authProvider } from "./contexts/authProvider";
import { Header } from "./components/header";
import { ColorModeContextProvider } from "./contexts/color-mode";

import {
  BlogPostCreate,
  BlogPostEdit,
  BlogPostList,
  BlogPostShow,
} from "./pages/blog-posts";
import {
  CategoryCreate,
  CategoryEdit,
  CategoryList,
  CategoryShow,
} from "./pages/categories";
import { ForgotPassword } from "./pages/forgotPassword";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { UserList } from "./pages/users/list";
import { UserEdit } from "./pages/users/edit";
import { UserShow } from "./pages/users/show";
import { UserCreate } from "./pages/users/create";
import { UserAssignRoles } from "./pages/users/assignRoles";
// TODO: Enable invitation feature later
// import { UserInvite } from "./pages/users/invite";
// import { InvitationList } from "./pages/users/invitations";
import { BrandList } from "./pages/brand/list";
import { BrandCreate } from "./pages/brand/create";
import { BrandEdit } from "./pages/brand/edit";
import { BrandShow } from "./pages/brand/show";

import { ProductList } from "./pages/product/list";
import { ProductCreate } from "./pages/product/create";
import { ProductEdit } from "./pages/product/edit";
import { ProductShow } from "./pages/product/show";

import { CouponList } from "./pages/coupon/list";
import { CouponCreate } from "./pages/coupon/create";
import { CouponEdit } from "./pages/coupon/edit";
import { CouponShow } from "./pages/coupon/show";

import { BannerList } from "./pages/banner/list";
import { BannerCreate } from "./pages/banner/create";
import { BannerEdit } from "./pages/banner/edit";
import { BannerShow } from "./pages/banner/show";
import { OrderList } from "./pages/order/list";
import { OrderShow } from "./pages/order/show";

import { AttributeList } from "./pages/attribute/list";
import { AttributeCreate } from "./pages/attribute/create";
import { AttributeEdit } from "./pages/attribute/edit";
import { AttributeShow } from "./pages/attribute/show";
import { StatisticsPage } from "./pages/statistics";
import { ReviewList } from "./pages/reviews/list";
import { ReviewShow } from "./pages/reviews/show";
import { ContactMessageList } from "./pages/contactMessages/list";
import { ContactMessageShow } from "./pages/contactMessages/show";

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <AntdApp>
            <DevtoolsProvider>
              <Refine
                dataProvider={dataProvider}
                notificationProvider={useNotificationProvider}
                routerProvider={routerProvider}
                authProvider={authProvider}
                resources={[
                    // ===========================
                    // 1. DASHBOARD
                    // ===========================
                    {
                      name: "statistics",
                      list: "/statistics",
                      meta: {
                        label: "Thống kê",
                        icon: <i className="fa-solid fa-chart-column" />,
                      },
                    },

                    // ===========================
                    // 2. SALES / ORDER MANAGEMENT
                    // ===========================
                    {
                      name: "orders",
                      list: "/orders",
                      show: "/orders/show/:id",
                      meta: {
                        label: "Đơn hàng",
                        icon: <i className="fa-solid fa-receipt" />,
                      },
                    },
                    {
                      name: "coupons",
                      list: "/coupons",
                      create: "/coupons/create",
                      edit: "/coupons/edit/:id",
                      show: "/coupons/show/:id",
                      meta: {
                        label: "Mã giảm giá",
                        icon: <i className="fa-solid fa-ticket" />,
                      },
                    },
                    {
                      name: "banners",
                      list: "/banners",
                      create: "/banners/create",
                      edit: "/banners/edit/:id",
                      show: "/banners/show/:id",
                      meta: {
                        label: "Banner quảng cáo",
                        icon: <i className="fa-regular fa-image" />,
                      },
                    },

                    // ===========================
                    // 3. PRODUCT MANAGEMENT
                    // ===========================
                    {
                      name: "products",
                      list: "/products",
                      create: "/products/create",
                      edit: "/products/edit/:id",
                      show: "/products/show/:id",
                      meta: {
                        label: "Sản phẩm",
                        icon: <i className="fa-solid fa-shirt" />,
                      },
                    },
                    {
                      name: "reviews",
                      list: "/reviews",
                      show: "/reviews/show/:id",
                      meta: {
                        label: "Đánh giá sản phẩm",
                        icon: <i className="fa-solid fa-star-half-stroke" />, // ⭐
                      },
                    },
                    {
                      name: "attributes",
                      list: "/attributes",
                      show: "/attributes/show/:id",
                      edit: "/attributes/edit/:id",
                      create: "/attributes/create",
                      meta: {
                        label: "Thuộc tính sản phẩm",
                        icon: <i className="fa-solid fa-sliders" />,
                      },
                    },
                    {
                      name: "categories",
                      list: "/categories",
                      create: "/categories/create",
                      edit: "/categories/edit/:id",
                      show: "/categories/show/:id",
                      meta: {
                        label: "Danh mục",
                        icon: <i className="fa-solid fa-list" />,
                        canDelete: true,
                      },
                    },
                    {
                      name: "brands",
                      list: "/brands",
                      create: "/brands/create",
                      edit: "/brands/edit/:id",
                      show: "/brands/show/:id",
                      meta: {
                        label: "Thương hiệu",
                        icon: <i className="fa-solid fa-tags" />,
                      },
                    },

                    // ===========================
                    // 4. CONTENT MANAGEMENT
                    // ===========================
                    {
                      name: "blog_posts",
                      list: "/blog-posts",
                      create: "/blog-posts/create",
                      edit: "/blog-posts/edit/:id",
                      show: "/blog-posts/show/:id",
                      meta: {
                        label: "Bài viết",
                        icon: <i className="fa-regular fa-newspaper" />,
                        canDelete: true,
                      },
                    },

                    // ===========================
                    // 5. USERS & SUPPORT
                    // ===========================
                    {
                      name: "users",
                      list: "/users",
                      create: "/users/create",
                      edit: "/users/edit/:id",
                      show: "/users/show/:id",
                      meta: {
                        label: "Người dùng",
                        icon: <i className="fa-solid fa-users" />,
                      },
                    },
                    // TODO: Enable invitation feature later
                    // {
                    //   name: "roles/invite",
                    //   list: "/users/invitations",
                    //   create: "/users/invite",
                    //   meta: {
                    //     label: "Mời nhân viên",
                    //     parent: "users",
                    //     icon: <i className="fa-solid fa-user-plus" />,
                    //   },
                    // },
                    {
                      name: "chats",
                      list: "/chats",
                      meta: {
                        label: "Chat / Hỗ trợ",
                        icon: <i className="fa-regular fa-comments" />,
                      },
                    },
                    {
                      name: "contacts",
                      list: "/contacts",
                      show: "/contacts/show/:id",
                      meta: {
                        label: "Liên hệ / Góp ý",
                        icon: <i className="fa-regular fa-envelope" />, // ✉️
                      },
                    },
                  ]}
                  options={{
                    syncWithLocation: true,
                    warnWhenUnsavedChanges: true,
                    projectId: "aPy7Pj-vpHEcJ-ApXB7i",
                  }}
                >
                <Routes>
                  <Route
                    element={
                      <Authenticated
                        fallback={<CatchAllNavigate to="/login" />}
                        key="authenticated-layout"
                      >
                        <ThemedLayout Header={Header} Sider={ThemedSider}>
                          <Outlet />
                        </ThemedLayout>
                      </Authenticated>
                    }
                  >
                    {/* Trang mặc định → điều hướng sang statistics */}
                    <Route index element={<NavigateToDefaultResource />} />

                    {/* STATISTICS: chỉ ADMIN */}
                    <Route
                      element={
                        <RequireRoles allowedRoles={["ADMIN"]}>
                          <Outlet />
                        </RequireRoles>
                      }
                    >
                      <Route path="/statistics" element={<StatisticsPage />} />
                    </Route>

                    {/* USERS: chỉ ADMIN */}
                    <Route
                      element={
                        <RequireRoles allowedRoles={["ADMIN"]}>
                          <Outlet />
                        </RequireRoles>
                      }
                    >
                      <Route path="/users">
                        <Route index element={<UserList />} />
                        <Route path="create" element={<UserCreate />} />
                        <Route path="edit/:id" element={<UserEdit />} />
                        <Route path="show/:id" element={<UserShow />} />
                        <Route
                          path="assign-roles/:id"
                          element={<UserAssignRoles />}
                        />
                        {/* TODO: Enable invitation routes later */}
                        {/* <Route path="invite" element={<UserInvite />} /> */}
                        {/* <Route path="invitations" element={<InvitationList />} /> */}
                      </Route>
                    </Route>

                    {/* BRANDS: ADMIN + PRODUCT_MANAGER */}
                    <Route
                      element={
                        <RequireRoles allowedRoles={["ADMIN", "PRODUCT_MANAGER"]}>
                          <Outlet />
                        </RequireRoles>
                      }
                    >
                      <Route path="/brands">
                        <Route index element={<BrandList />} />
                        <Route path="create" element={<BrandCreate />} />
                        <Route path="edit/:id" element={<BrandEdit />} />
                        <Route path="show/:id" element={<BrandShow />} />
                      </Route>
                    </Route>

                    {/* BLOG POSTS: ADMIN */}
                    <Route
                      element={
                        <RequireRoles allowedRoles={["ADMIN"]}>
                          <Outlet />
                        </RequireRoles>
                      }
                    >
                      <Route path="/blog-posts">
                        <Route index element={<BlogPostList />} />
                        <Route path="create" element={<BlogPostCreate />} />
                        <Route path="edit/:id" element={<BlogPostEdit />} />
                        <Route path="show/:id" element={<BlogPostShow />} />
                      </Route>
                    </Route>

                    {/* CATEGORIES: ADMIN + PRODUCT_MANAGER */}
                    <Route
                      element={
                        <RequireRoles allowedRoles={["ADMIN", "PRODUCT_MANAGER"]}>
                          <Outlet />
                        </RequireRoles>
                      }
                    >
                      <Route path="/categories">
                        <Route index element={<CategoryList />} />
                        <Route path="create" element={<CategoryCreate />} />
                        <Route path="edit/:id" element={<CategoryEdit />} />
                        <Route path="show/:id" element={<CategoryShow />} />
                      </Route>
                    </Route>

                    {/* ✅ PRODUCTS: ADMIN + PRODUCT_MANAGER */}
                    <Route
                      element={
                        <RequireRoles allowedRoles={["ADMIN", "PRODUCT_MANAGER"]}>
                          <Outlet />
                        </RequireRoles>
                      }
                    >
                      <Route path="/products">
                        <Route index element={<ProductList />} />
                        <Route path="create" element={<ProductCreate />} />
                        <Route path="edit/:id" element={<ProductEdit />} />
                        <Route path="show/:id" element={<ProductShow />} />
                      </Route>
                    </Route>


                                        <Route
                      element={
                        <RequireRoles allowedRoles={["ADMIN", "PRODUCT_MANAGER"]}>
                          <Outlet />
                        </RequireRoles>
                      }
                    >
                      <Route path="/attributes">
                        <Route index element={<AttributeList />} />
                        <Route path="create" element={<AttributeCreate />} />
                        <Route path="edit/:id" element={<AttributeEdit />} />
                        <Route path="show/:id" element={<AttributeShow />} />
                      </Route>
                    </Route>
                    

                                                              {/* ✅ COUPONS: ADMIN + MARKETING_STAFF */}
                    <Route
                      element={
                        <RequireRoles allowedRoles={["ADMIN", "MARKETING_STAFF"]}>
                          <Outlet />
                        </RequireRoles>
                      }
                    >
                      <Route path="/coupons">
                        <Route index element={<CouponList />} />
                        <Route path="create" element={<CouponCreate />} />
                        <Route path="edit/:id" element={<CouponEdit />} />
                        <Route path="show/:id" element={<CouponShow />} />
                      </Route>
                    </Route>
                      
                    <Route
                      element={
                        <RequireRoles allowedRoles={["ADMIN", "ORDER_MANAGER"]}>
                          <Outlet />
                        </RequireRoles>
                      }
                    >
                      <Route path="/orders">
                        <Route index element={<OrderList />} />
                        <Route path="show/:id" element={<OrderShow/>} />
                      </Route>
                    </Route>


                    {/* ✅ BANNERS: ADMIN + MARKETING_STAFF */}
                    <Route
                      element={
                        <RequireRoles allowedRoles={["ADMIN", "MARKETING_STAFF"]}>
                          <Outlet />
                        </RequireRoles>
                      }
                    >
                      <Route path="/banners">
                        <Route index element={<BannerList />} />
                        <Route path="create" element={<BannerCreate />} />
                        <Route path="edit/:id" element={<BannerEdit />} />
                        <Route path="show/:id" element={<BannerShow />} />
                      </Route>
                    </Route>

                    <Route
                      element={
                        <RequireRoles allowedRoles={["ADMIN", "CUSTOMER_SERVICE"]}>
                          <Outlet />
                        </RequireRoles>
                      }
                    >
                      <Route path="/reviews">
                        <Route index element={<ReviewList />} />
                        <Route path="show/:id" element={<ReviewShow />} />
                      </Route>
                    </Route>


                    <Route
                      element={
                        <RequireRoles allowedRoles={["ADMIN", "CUSTOMER_SERVICE"]}>
                          <Outlet />
                        </RequireRoles>
                      }
                    >
                      <Route path="/contacts">
                        <Route index element={<ContactMessageList />} />
                        <Route path="show/:id" element={<ContactMessageShow />} />
                      </Route>
                    </Route>

                    {/* ✅ CHAT: tất cả staff (trừ USER) */}
                    <Route
                      element={
                        <RequireRoles
                          allowedRoles={[
                            "ADMIN",
                            "CUSTOMER_SERVICE",
                            "PRODUCT_MANAGER",
                            "ORDER_MANAGER",
                            "MARKETING_STAFF",
                            "ACCOUNTANT",
                          ]}
                        >
                          <Outlet />
                        </RequireRoles>
                      }
                    >
                      <Route path="/chats">
                        <Route index element={<AdminChat />} />
                      </Route>
                    </Route>

                  </Route>

                  {/* Auth routes */}
                  <Route
                    element={
                      <Authenticated
                        fallback={<Outlet />}
                        key="authenticated-layout"
                      >
                        <CatchAllNavigate to="/" />
                      </Authenticated>
                    }
                  >
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                      path="/forgot-password"
                      element={<ForgotPassword />}
                    />
                  </Route>

                  {/* 404 */}
                  <Route path="*" element={<ErrorComponent />} />
                </Routes>

                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler />
              </Refine>

              <DevtoolsPanel />
            </DevtoolsProvider>
          </AntdApp>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
