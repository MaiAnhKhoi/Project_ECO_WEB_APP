import "@/global.css";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Alert, NativeScrollEvent, NativeSyntheticEvent, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";

import {
  CAROUSEL_HEIGHT,
  CompareFloatingBar,
  ProductColorPicker,
  ProductCompareInlineRow,
  ProductDetailBottomBar,
  ProductDetailHeading,
  ProductDetailInfoSections,
  ProductDetailLoading,
  ProductDetailTopBar,
  ProductImageCarousel,
  ProductQuantityRow,
  ProductSizePicker,
  ProductVirtualTryOnRow,
  VirtualTryOnSheet,
  type CarouselSlide,
} from "@/components/productDetail";
import { useProductDetail } from "@/hooks/useProductDetail";
import { useProductVariantSelection } from "@/hooks/useProductVariantSelection";
import { useAppColors } from "@/hooks/use-app-colors";
import { cartApi } from "@/services/cartApi";
import { wishlistApi } from "@/services/wishlistApi";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCompareStore } from "@/store/compareStore";
import { cn } from "@/utils/cn";
import { isVirtualTryOnAccessory } from "@/utils/virtualTryOnRules";

const CARD_CORNER = 28;

export default function ProductDetailScreen() {
  const colors = useAppColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);

  const params = useLocalSearchParams<{ id?: string }>();
  const productId = useMemo(() => {
    const n = Number(params.id);
    return Number.isFinite(n) ? n : null;
  }, [params.id]);

  // Auth + stores
  const token = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);
  const addGuestItem = useCartStore((s) => s.addGuestItem);
  const setServerCart = useCartStore((s) => s.setServerCart);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const wishlistAdd = useWishlistStore((s) => s.add);
  const wishlistRemove = useWishlistStore((s) => s.remove);
  const isWishlisted = useWishlistStore((s) =>
    productId != null ? s.isWishlisted(productId) : false
  );
  const compareToggle = useCompareStore((s) => s.toggle);
  const isCompared = useCompareStore((s) =>
    productId != null ? s.isCompared(productId) : false
  );
  const compareCount = useCompareStore((s) => s.products.length);

  // Data
  const { product, tabs, loading, error, mappedColors, reload } =
    useProductDetail(productId);
  const variant = useProductVariantSelection(mappedColors);
  const [quantity, setQuantity] = useState(1);
  const [tryOnOpen, setTryOnOpen] = useState(false);

  useEffect(() => {
    if (!token) setTryOnOpen(false);
  }, [token]);

  const tryOnAccessory = useMemo(
    () => (product ? isVirtualTryOnAccessory(product.title) : false),
    [product?.title]
  );

  // Topbar solid when scrolled past image
  const [headerSolid, setHeaderSolid] = useState(false);
  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    setHeaderSolid(y > insets.top + CAROUSEL_HEIGHT - 60);
  };

  // Carousel slides — each color → one slide
  const slides: CarouselSlide[] = useMemo(() => {
    if (!product) return [];
    if (mappedColors.length === 0) {
      return [{ key: "main", uri: product.imgSrc }];
    }
    return mappedColors.map((c, i) => ({
      key: `${c.label}-${i}`,
      uri: c.img || product.imgSrc,
      label: c.label,
    }));
  }, [product, mappedColors]);

  // Sync: activeColor → carousel index
  const activeColorIndex = useMemo(() => {
    if (!variant.activeColor || mappedColors.length === 0) return 0;
    const idx = mappedColors.findIndex((c) => c.label === variant.activeColor);
    return idx >= 0 ? idx : 0;
  }, [variant.activeColor, mappedColors]);

  // Sync: carousel swipe → activeColor
  const handleCarouselChange = useCallback(
    (index: number) => {
      const color = mappedColors[index];
      if (color) variant.setActiveColor(color.label);
    },
    [mappedColors, variant.setActiveColor]
  );

  const hasVariants = mappedColors.length > 0;
  const needsVariant = hasVariants && variant.sizesForCurrentColor.length > 0;
  const stock = variant.currentVariant?.stockQuantity ?? 0;
  const maxQty = needsVariant ? stock : product?.inStock ? 99 : 0;
  const outOfStock = !product?.inStock || (needsVariant && stock <= 0);

  useEffect(() => {
    setQuantity(1);
  }, [variant.activeColor, variant.selectedSize]);

  useEffect(() => {
    if (maxQty > 0) setQuantity((q) => Math.min(q, maxQty));
  }, [maxQty]);

  const handleQuantityChange = useCallback(
    (next: number) => {
      if (needsVariant && variant.currentVariant) {
        const cap = variant.currentVariant.stockQuantity ?? 0;
        if (cap <= 0) {
          Alert.alert("Thông báo", "Sản phẩm này hiện đã hết hàng.");
          return;
        }
        if (next > cap) {
          Alert.alert("Thông báo", `Chỉ còn ${cap} sản phẩm trong kho.`);
          setQuantity(cap);
          return;
        }
      }
      setQuantity(Math.max(1, next));
    },
    [needsVariant, variant.currentVariant]
  );

  const validate = useCallback((): boolean => {
    if (!product || productId == null) return false;
    if (hasVariants) {
      if (!variant.activeColor || variant.sizesForCurrentColor.length === 0) {
        Alert.alert("Thông báo", "Vui lòng chọn màu và kích cỡ.");
        return false;
      }
      if (!variant.currentVariant) {
        Alert.alert("Thông báo", "Vui lòng chọn màu và kích cỡ.");
        return false;
      }
      if (variant.currentVariant.stockQuantity <= 0) {
        Alert.alert("Thông báo", "Sản phẩm này hiện đã hết hàng.");
        return false;
      }
    }
    return true;
  }, [product, productId, hasVariants, variant]);

  const handleAddToCart = useCallback(() => {
    if (!validate()) return;
    if (!product || productId == null) return;
    const variantId = variant.currentVariant?.variantId ?? undefined;
    const colorLabel = hasVariants ? variant.activeColor : null;

    if (token) {
      cartApi
        .addToCart(token, { productId, quantity, variantId, color: colorLabel })
        .then((cart) => {
          setServerCart(cart);
          Alert.alert("✓ Đã thêm vào giỏ", product.title);
        })
        .catch(() =>
          Alert.alert("Lỗi", "Không thể thêm vào giỏ hàng. Vui lòng thử lại.")
        );
      return;
    }
    addGuestItem({
      productId,
      quantity,
      variantId,
      color: colorLabel,
      price: product.price,
      productName: product.title,
      imgSrc: product.imgSrc,
    });
    Alert.alert("✓ Đã thêm vào giỏ", "Đăng nhập để đồng bộ lên tài khoản.");
  }, [
    validate,
    product,
    productId,
    quantity,
    variant,
    hasVariants,
    token,
    addGuestItem,
    setServerCart,
  ]);

  const handleBuyNow = useCallback(() => {
    if (!validate()) return;
    if (!product || productId == null) return;
    if (!user || !token) {
      Alert.alert("Cần đăng nhập", "Bạn cần đăng nhập để mua hàng.", [
        { text: "Hủy", style: "cancel" },
        {
          text: "Đăng nhập",
          onPress: () =>
            router.push({
              pathname: "/auth/login",
              params: { next: `/product/${productId}` },
            } as any),
        },
      ]);
      return;
    }
    const colorLabel = hasVariants ? variant.activeColor : null;
    const sizeLabel =
      hasVariants && variant.currentVariant ? variant.currentVariant.size : "";
    const vid = variant.currentVariant?.variantId;
    const variantIdStr =
      vid != null && vid > 0 ? String(vid) : "";

    router.push({
      pathname: "/checkout",
      params: {
        buyNow: "1",
        productId: String(productId),
        quantity: String(quantity),
        variantId: variantIdStr,
        unitPrice: String(product.price),
        productName: product.title,
        imgSrc: product.imgSrc ?? "",
        color: colorLabel ?? "",
        size: sizeLabel,
      },
    } as any);
  }, [
    validate,
    user,
    token,
    product,
    productId,
    quantity,
    variant,
    hasVariants,
    router,
  ]);

  const handleWishlistPress = useCallback(async () => {
    if (productId == null) return;
    if (token) {
      try {
        if (isWishlisted) {
          await wishlistApi.removeFromWishlist(token, productId);
          wishlistRemove(productId);
        } else {
          await wishlistApi.addToWishlist(token, productId);
          wishlistAdd(productId);
        }
      } catch {
        Alert.alert("Lỗi", "Không cập nhật được danh sách yêu thích.");
      }
    } else {
      toggleWishlist(productId);
    }
  }, [productId, token, isWishlisted, wishlistAdd, wishlistRemove, toggleWishlist]);

  const handleCompare = useCallback(() => {
    if (!product) return;
    compareToggle(product);
    if (!isCompared) {
      Alert.alert(
        "Đã thêm vào so sánh",
        `"${product.title}" đã được thêm vào danh sách (${compareCount + 1} sản phẩm).`,
        [
          { text: "Mở so sánh", onPress: () => router.push("/compare" as any) },
          { text: "Đóng", style: "cancel" },
        ]
      );
    }
  }, [product, isCompared, compareToggle, router, compareCount]);

  const addDisabled = useMemo(() => {
    if (!product) return true;
    if (!product.inStock) return true;
    if (hasVariants) {
      if (variant.sizesForCurrentColor.length === 0) return true;
      if (!variant.currentVariant) return true;
      if ((variant.currentVariant.stockQuantity ?? 0) <= 0) return true;
    }
    return false;
  }, [product, hasVariants, variant]);

  const BOTTOM_BAR_H = 62 + (insets.bottom > 0 ? insets.bottom : 10);
  /** Thanh so sánh luôn hiển thị — chừa chỗ scroll */
  const COMPARE_BAR_H = 52;

  if (loading) {
    return <ProductDetailLoading tint={colors.tint} />;
  }

  // ─── Error ─────────────────────────────────────────────────────────────────
  if (error || !product) {
    return (
      <View className="flex-1 bg-app-bg dark:bg-neutral-950">
        <ProductDetailTopBar title="Sản phẩm" solid />
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-4xl">😕</Text>
          <Text className="mt-3 text-center text-[15px] leading-6 text-app-fg dark:text-neutral-100">
            {error || "Không tìm thấy sản phẩm."}
          </Text>
          <Text
            onPress={() => reload()}
            className="mt-5 text-[15px] font-semibold"
            style={{ color: colors.tint }}
          >
            Thử lại
          </Text>
        </View>
      </View>
    );
  }

  // ─── Main ──────────────────────────────────────────────────────────────────
  return (
    <View className="flex-1 bg-neutral-100 dark:bg-neutral-950">
      <ProductDetailTopBar
        title={product.title}
        solid={headerSolid}
        productUrl={`https://uteshop.vn/product-detail/${productId}`}
      />

      {slides.length > 1 ? (
        <View
          className="absolute right-3.5 z-[90] rounded-full bg-black/50 px-2.5 py-1"
          style={{ top: insets.top + 56 }}
          pointerEvents="none"
        >
          <Text className="text-xs font-bold tracking-wide text-white">
            {activeColorIndex + 1} / {slides.length}
          </Text>
        </View>
      ) : null}

      {slides.length > 1 && slides.length <= 8 ? (
        <View
          className="absolute right-3.5 z-[90] flex-col gap-1"
          style={{ top: insets.top + 56 + 24 }}
          pointerEvents="none"
        >
          {slides.map((_, i) => (
            <View
              key={`vdot-${i}`}
              className={cn(
                "rounded-full",
                i === activeColorIndex ? "h-2 w-2 bg-white" : "h-1.5 w-1.5 bg-white/50"
              )}
            />
          ))}
        </View>
      ) : null}

      {/* ── Scrollable content ── */}
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={handleScroll}
        contentContainerStyle={{
          paddingTop: insets.top,
          paddingBottom: BOTTOM_BAR_H + COMPARE_BAR_H + 8,
        }}
      >
        {/* Hero image */}
        <ProductImageCarousel
          slides={slides}
          activeIndex={activeColorIndex}
          onChangeIndex={handleCarouselChange}
        />

        <View
          className="bg-white pt-3.5 dark:bg-neutral-900"
          style={{
            borderTopLeftRadius: CARD_CORNER,
            borderTopRightRadius: CARD_CORNER,
            marginTop: -CARD_CORNER,
          }}
        >
          <View className="mb-3 h-1 w-10 self-center rounded-full bg-black/10 dark:bg-white/20" />

          <ProductDetailHeading product={product} />

          <View className="mx-4 mt-4 h-px bg-black/5 dark:bg-white/10" />

          {/* Variants */}
          {hasVariants ? (
            <>
              <ProductColorPicker
                colors={mappedColors}
                activeLabel={variant.activeColor}
                onSelect={variant.setActiveColor}
              />
              <ProductSizePicker
                sizes={variant.sizesForCurrentColor}
                activeValue={variant.selectedSize}
                onSelect={variant.setSelectedSize}
              />
            </>
          ) : null}

          <ProductQuantityRow
            quantity={quantity}
            max={maxQty}
            onChange={handleQuantityChange}
            disabled={addDisabled}
          />

          {token ? (
            <ProductVirtualTryOnRow
              disabled={tryOnAccessory}
              onPress={() => {
                if (tryOnAccessory) return;
                if (hasVariants && !variant.currentVariant) {
                  Alert.alert("Thông báo", "Vui lòng chọn màu và kích cỡ trước khi thử đồ.");
                  return;
                }
                setTryOnOpen(true);
              }}
            />
          ) : null}

          <ProductCompareInlineRow
            compareCount={compareCount}
            isCurrentCompared={isCompared}
            onToggle={handleCompare}
            onViewCompare={() => router.push("/compare" as any)}
          />

          <View className="mt-5 h-2 bg-neutral-100 dark:bg-neutral-800/80" />

          <ProductDetailInfoSections
            tabs={tabs}
            productId={productId}
            token={token}
            user={user ? { name: user.name, email: user.email } : null}
          />
        </View>
      </ScrollView>

      {/* ── Thanh so sánh nổi ── */}
      <CompareFloatingBar
        compareCount={compareCount}
        isCurrentCompared={isCompared}
        onToggle={handleCompare}
        onViewCompare={() => router.push("/compare" as any)}
        bottomOffset={BOTTOM_BAR_H}
      />

      {/* ── Bottom action bar ── */}
      <ProductDetailBottomBar
        wishlisted={isWishlisted}
        onToggleWishlist={handleWishlistPress}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        addDisabled={addDisabled}
        outOfStock={outOfStock}
      />

      {token ? (
        <VirtualTryOnSheet
          visible={tryOnOpen}
          onClose={() => setTryOnOpen(false)}
          product={product}
          token={token}
          mappedColors={mappedColors}
          activeColorLabel={variant.activeColor}
          selectedSize={variant.selectedSize}
          currentVariantId={variant.currentVariant?.variantId ?? null}
          isSupported={!tryOnAccessory}
        />
      ) : null}
    </View>
  );
}
