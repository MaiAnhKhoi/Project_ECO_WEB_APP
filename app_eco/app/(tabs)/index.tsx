import {
  BannerSkeleton,
  BrandSection,
  CategorySection,
  HomeBannerCarousel,
  ProductSection,
  TestimonialSection,
} from "@/components/home";
import "@/global.css";
import React from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useHomeBannersQuery,
  useHomeMetaQuery,
  useHomeProductsQuery,
} from "@/queries/homeQueries";

export default function HomeScreen() {
  const bannersQ = useHomeBannersQuery();
  const metaQ = useHomeMetaQuery();
  const productsQ = useHomeProductsQuery();

  const banners = bannersQ.data ?? [];
  const loadState =
    bannersQ.isPending ? "loading" : bannersQ.isError ? "error" : "success";
  const metaLoading = metaQ.isPending;
  const productsLoading = productsQ.isPending;

  const rootCategories = metaQ.data?.categories ?? [];
  const brands = metaQ.data?.brands ?? [];
  const testimonials = metaQ.data?.testimonials ?? [];

  const newProducts = productsQ.data?.newProducts ?? [];
  const todaysPicks = productsQ.data?.todaysPicks ?? [];
  const bestSellers = productsQ.data?.bestSellers ?? [];
  const bestDeals = productsQ.data?.bestDeals ?? [];
  const popularProducts = productsQ.data?.popularProducts ?? [];

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["left", "right", "bottom"]}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {loadState === "loading" ? (
          <BannerSkeleton />
        ) : loadState === "error" ? (
          <BannerSkeleton showRetryHint onRetry={() => bannersQ.refetch()} />
        ) : banners.length > 0 ? (
          <HomeBannerCarousel items={banners} />
        ) : null}

        <CategorySection
          title="Danh mục"
          subtitle="Khám phá theo nhu cầu"
          categories={rootCategories}
          loading={metaLoading}
        />

        <BrandSection
          title="Thương hiệu"
          subtitle="Các brand nổi bật"
          brands={brands}
          loading={metaLoading}
        />

        <ProductSection
          title="Sản phẩm mới"
          subtitle="Vừa cập nhật"
          products={newProducts}
          loading={productsLoading}
        />
        <ProductSection
          title="Gợi ý hôm nay"
          subtitle="Đề xuất dành cho bạn"
          products={todaysPicks}
          loading={productsLoading}
        />
        <ProductSection
          title="Bán chạy nhất"
          subtitle="Được mua nhiều"
          products={bestSellers}
          loading={productsLoading}
        />
        <ProductSection
          title="Giá tốt nhất"
          subtitle="Tiết kiệm chi phí"
          products={bestDeals}
          loading={productsLoading}
        />
        <ProductSection
          title="Phổ biến nhất"
          subtitle="Được xem nhiều"
          products={popularProducts}
          loading={productsLoading}
        />

        <TestimonialSection
          title="Đánh giá nổi bật"
          subtitle="Khách hàng nói gì"
          items={testimonials}
          loading={metaLoading}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
