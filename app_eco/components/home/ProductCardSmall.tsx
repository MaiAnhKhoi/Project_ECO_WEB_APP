import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";

import { useAppColors } from "@/hooks/use-app-colors";
import type { Product } from "@/types/product";
import { ColorSwatches } from "@/components/product/ColorSwatches";
import { HeartButton } from "@/components/product/HeartButton";
import { useWishlistStore } from "@/store/wishlistStore";
import { resolveAssetUrl } from "@/utils/assetUrl";

type Props = {
  product: Product;
  onPress?: () => void;
  variant?: "row" | "grid";
};

export function ProductCardSmall({ product, onPress, variant = "row" }: Props) {
  const router = useRouter();
  const colors = useAppColors();
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product.id));

  const initialColorLabel = useMemo(
    () => product.colors?.[0]?.label ?? "",
    [product.colors]
  );
  const [activeColorLabel, setActiveColorLabel] = useState(initialColorLabel);
  const [currentImage, setCurrentImage] = useState(product.imgSrc);

  const productColors = product.colors ?? [];
  useEffect(() => {
    setActiveColorLabel(product.colors?.[0]?.label ?? "");
    setCurrentImage(product.imgSrc);
  }, [product.id, product.imgSrc, product.colors]);

  const showSale = product.oldPrice && product.oldPrice > product.price;
  const discountPercent =
    showSale && product.oldPrice
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : null;

  return (
    <Pressable
      onPress={() => {
        if (onPress) {
          onPress();
          return;
        }
        router.push(`/product/${product.id}` as any);
      }}
      className={variant === "grid" ? "w-full active:opacity-90" : "mr-3 w-40 active:opacity-90"}
      accessibilityRole="button"
      accessibilityLabel={product.title}
    >
      <View
        style={{
          borderRadius: 14,
          backgroundColor: colors.surfaceMuted,
          overflow: "hidden",
          height: 220,
        }}
      >
        <View style={{ position: "relative" }}>
          <Image
            source={{ uri: resolveAssetUrl(currentImage) ?? currentImage }}
            style={{ width: "100%", height: 136 }}
            contentFit="cover"
            transition={200}
          />
          <View style={{ position: "absolute", top: 8, right: 8 }}>
            <HeartButton
              active={isWishlisted}
              onPress={() => toggleWishlist(product.id)}
            />
          </View>
          {showSale && discountPercent !== null && (
            <View
              style={{
                position: "absolute",
                top: 8,
                left: 8,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 999,
                backgroundColor: colors.tint,
              }}
            >
              <Text
                className="text-[11px] font-semibold"
                style={{ color: "#FFFFFF" }}
              >
                -{discountPercent}%
              </Text>
            </View>
          )}
        </View>

        <View className="px-3 py-3" style={{ flex: 1 }}>
          <View style={{ height: 36 }}>
            <Text
              numberOfLines={2}
              className="text-[13px] font-medium"
              style={{ color: colors.text }}
            >
              {product.title}
            </Text>
          </View>

          <View className="mt-1 flex-row items-baseline">
            <Text
              className="text-sm font-semibold"
              style={{ color: colors.tint }}
            >
              {product.price.toLocaleString("vi-VN")}₫
            </Text>
            {showSale && product.oldPrice && (
              <Text
                className="ml-1 text-[11px] line-through"
                style={{ color: colors.mutedText }}
              >
                {product.oldPrice.toLocaleString("vi-VN")}₫
              </Text>
            )}
          </View>

          {/* {productColors.length > 0 ? (
            <ColorSwatches
              colors={productColors}
              activeLabel={activeColorLabel}
              onSelect={(c) => {
                setActiveColorLabel(c.label);
                setCurrentImage(c.img || product.imgSrc);
              }}
            />
          ) : (
            <View style={{ height: 18 }} />
          )} */}
        </View>
      </View>
    </Pressable>
  );
}

