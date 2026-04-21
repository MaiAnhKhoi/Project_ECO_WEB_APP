import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Modal, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppIcon } from "@/components/ui/AppIcon";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomIconButton } from "@/components/ui/CustomIconButton";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useAppColors } from "@/hooks/use-app-colors";
import {
  formatVirtualTryOnError,
  isTryOnAbortError,
  virtualTryOnApi,
} from "@/services/virtualTryOnApi";
import type { Product, ProductColor } from "@/types/product";
import type { TryOnCategory, TryOnHistoryItem, TryOnVariantOption } from "@/types/virtualTryOn";
import { resolveAssetUrl, resolveGarmentImageForTryOn } from "@/utils/assetUrl";
import {
  detectTryOnCategoryFromTitle,
  isVirtualTryOnSetProduct,
} from "@/utils/virtualTryOnRules";
import { cn } from "@/utils/cn";
import { prepareModelImageForTryOn } from "@/utils/tryOnModelImage";

type Props = {
  visible: boolean;
  onClose: () => void;
  product: Product;
  token: string;
  mappedColors: ProductColor[];
  activeColorLabel: string | null;
  selectedSize: string | null;
  currentVariantId: number | null;
  isSupported: boolean;
};

function buildVariants(
  product: Product,
  colors: ProductColor[],
  category: TryOnCategory
): TryOnVariantOption[] {
  if (!colors.length) {
    return [
      {
        variantId: null,
        imageUrl: product.imgSrc,
        label: "Mặc định",
        category,
      },
    ];
  }
  return colors.flatMap((c) => {
    const sizes = c.sizes?.length
      ? c.sizes
      : [
          {
            size: "—",
            inStock: true,
            variantId: 0,
            stockQuantity: 0,
          },
        ];
    return sizes.map((s) => ({
      variantId: s.variantId > 0 ? s.variantId : null,
      imageUrl: c.img || product.imgSrc,
      label: `${c.label} · ${s.size}`,
      category,
    }));
  });
}

function pickInitialIndex(
  variants: TryOnVariantOption[],
  currentVariantId: number | null,
  activeColorLabel: string | null,
  selectedSize: string | null
): number {
  if (currentVariantId != null && currentVariantId > 0) {
    const i = variants.findIndex((v) => v.variantId === currentVariantId);
    if (i >= 0) return i;
  }
  if (activeColorLabel) {
    const i = variants.findIndex(
      (v) =>
        v.label.includes(activeColorLabel) &&
        (!selectedSize || v.label.includes(selectedSize))
    );
    if (i >= 0) return i;
  }
  return 0;
}

export function VirtualTryOnSheet({
  visible,
  onClose,
  product,
  token,
  mappedColors,
  activeColorLabel,
  selectedSize,
  currentVariantId,
  isSupported,
}: Props) {
  const colors = useAppColors();
  const insets = useSafeAreaInsets();

  const isSet = useMemo(() => isVirtualTryOnSetProduct(product.title), [product.title]);
  const [setSegment, setSetSegment] = useState<TryOnCategory>("upper_body");

  const baseCategory = useMemo(
    () => detectTryOnCategoryFromTitle(product.title),
    [product.title]
  );

  const effectiveCategory: TryOnCategory = isSet ? setSegment : baseCategory;

  const variants = useMemo(
    () => buildVariants(product, mappedColors, effectiveCategory),
    [product, mappedColors, effectiveCategory]
  );

  const [variantIndex, setVariantIndex] = useState(0);
  const selectedVariant = variants[variantIndex] ?? null;

  const [modelUri, setModelUri] = useState<string | null>(null);
  const [modelMime, setModelMime] = useState("image/jpeg");
  const [modelName, setModelName] = useState("model.jpg");

  const [history, setHistory] = useState<TryOnHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [validating, setValidating] = useState(false);
  const [tryingOn, setTryingOn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) {
      setModelUri(null);
      setError(null);
      return;
    }
    setVariantIndex(
      pickInitialIndex(variants, currentVariantId, activeColorLabel, selectedSize)
    );
  }, [visible, variants, currentVariantId, activeColorLabel, selectedSize, effectiveCategory]);

  useEffect(() => {
    if (!visible || !product?.id || !token) return;
    setLoadingHistory(true);
    virtualTryOnApi
      .getHistory(token, product.id)
      .then(setHistory)
      .catch((err) => {
        if (__DEV__) {
          // eslint-disable-next-line no-console
          console.warn("[virtual-tryon] history", err?.message);
        }
        setHistory([]);
      })
      .finally(() => setLoadingHistory(false));
  }, [visible, product?.id, token]);

  const pickImage = useCallback(async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Quyền truy cập", "Cần quyền thư viện ảnh để chọn hình mẫu.");
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 0.9,
    });
    if (res.canceled || !res.assets?.[0]) return;
    const asset = res.assets[0];
    setError(null);
    setValidating(true);
    try {
      const { uri, mimeType, fileName } = await prepareModelImageForTryOn(asset.uri);
      const ok = await virtualTryOnApi.validateModelImage(
        token,
        uri,
        fileName,
        mimeType,
        product.id
      );
      if (!ok) {
        setModelUri(null);
        throw new Error("Ảnh không phù hợp. Vui lòng chọn ảnh đúng với sản phẩm.");
      }
      setModelUri(uri);
      setModelMime(mimeType);
      setModelName(fileName);
    } catch (e: any) {
      setModelUri(null);
      const raw = e?.message || "Không kiểm tra được ảnh.";
      setError(isTryOnAbortError(e) ? "Hết thời gian chờ. Vui lòng thử lại." : formatVirtualTryOnError(raw));
    } finally {
      setValidating(false);
    }
  }, [token, product.id]);

  const runTryOn = useCallback(async () => {
    if (!selectedVariant) {
      setError("Chưa có biến thể hợp lệ.");
      return;
    }
    if (!modelUri) {
      setError("Vui lòng chọn ảnh của bạn.");
      return;
    }
    setError(null);
    setTryingOn(true);
    try {
      const modelUrl = await virtualTryOnApi.uploadModelImage(
        token,
        modelUri,
        modelName,
        modelMime
      );
      const garmentUrl = resolveGarmentImageForTryOn(selectedVariant.imageUrl);
      if (!garmentUrl) {
        throw new Error("Không xác định được ảnh sản phẩm để thử đồ.");
      }
      const item = await virtualTryOnApi.tryOn(token, {
        productId: product.id,
        variantId: selectedVariant.variantId,
        category: selectedVariant.category,
        modelImageUrl: modelUrl,
        garmentImageUrl: garmentUrl,
      });
      setHistory((h) => [item, ...h].slice(0, 10));
      Alert.alert("Thành công", "Đã tạo ảnh thử đồ. Xem bên dưới.");
    } catch (e: any) {
      const raw = e?.message || "Thử đồ thất bại.";
      const msg = isTryOnAbortError(e)
        ? "Hết thời gian chờ. Vui lòng thử lại."
        : formatVirtualTryOnError(raw);
      setError(msg);
    } finally {
      setTryingOn(false);
    }
  }, [token, modelUri, modelName, modelMime, selectedVariant, product.id]);

  if (!isSupported) return null;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View className="flex-1 bg-neutral-50 dark:bg-neutral-950">
        <View
          className="flex-row items-center justify-between border-b border-black/10 bg-white px-4 dark:border-white/10 dark:bg-neutral-900"
          style={{ paddingTop: insets.top + 8, paddingBottom: 12 }}
        >
          <Text className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Thử đồ ảo
          </Text>
          <CustomIconButton
            onPress={onClose}
            accessibilityLabel="Đóng"
            size={40}
          >
            <AppIcon name="x" size={22} color={colors.text} />
          </CustomIconButton>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 24 }}
          keyboardShouldPersistTaps="handled"
        >
          {isSet ? (
            <View className="mb-4 flex-row gap-2">
              {(
                [
                  { k: "upper_body" as const, label: "Áo / trên" },
                  { k: "lower_body" as const, label: "Quần / dưới" },
                ] as const
              ).map(({ k, label }) => (
                <Pressable
                  key={k}
                  onPress={() => setSetSegment(k)}
                  className={cn(
                    "flex-1 rounded-xl border py-2.5",
                    setSegment === k
                      ? "border-primary bg-primary/10"
                      : "border-black/10 bg-white dark:border-white/15 dark:bg-neutral-900"
                  )}
                >
                  <Text
                    className={cn(
                      "text-center text-[13px] font-semibold",
                      setSegment === k ? "text-primary" : "text-neutral-600 dark:text-neutral-300"
                    )}
                  >
                    {label}
                  </Text>
                </Pressable>
              ))}
            </View>
          ) : null}

          <Text className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-neutral-500">
            Biến thể sản phẩm
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
            <View className="flex-row flex-wrap gap-2">
              {variants.map((v, i) => (
                <Pressable
                  key={`${v.label}-${i}`}
                  onPress={() => setVariantIndex(i)}
                  className={cn(
                    "rounded-xl border px-3 py-2",
                    variantIndex === i
                      ? "border-primary bg-primary/10"
                      : "border-black/10 bg-white dark:border-white/15 dark:bg-neutral-900"
                  )}
                >
                  <Text
                    className={cn(
                      "max-w-[200px] text-[12px] font-medium",
                      variantIndex === i ? "text-primary" : "text-neutral-700 dark:text-neutral-200"
                    )}
                    numberOfLines={2}
                  >
                    {v.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>

          <Text className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-neutral-500">
            Ảnh người mẫu (của bạn)
          </Text>
          <Pressable
            onPress={pickImage}
            disabled={validating}
            className="mb-2 items-center justify-center rounded-2xl border border-dashed border-black/20 bg-white py-8 dark:border-white/20 dark:bg-neutral-900"
          >
            {validating ? (
              <LoadingSpinner visible inline />
            ) : modelUri ? (
              <Image source={{ uri: modelUri }} style={{ width: 160, height: 200, borderRadius: 12 }} contentFit="cover" />
            ) : (
              <>
                <AppIcon name="image" size={36} color={colors.mutedText} />
                <Text className="mt-2 text-[14px] text-neutral-500">Chọn ảnh toàn thân</Text>
              </>
            )}
          </Pressable>

          {error ? (
            <Text className="mb-3 text-[13px] text-red-600 dark:text-red-400">{error}</Text>
          ) : null}

          <View className="mb-6">
            <CustomButton
              title="Thử đồ"
              onPress={runTryOn}
              loading={tryingOn}
              disabled={!modelUri || !selectedVariant}
              variant={!modelUri || !selectedVariant ? "secondary" : "primary"}
              style={{ borderRadius: 16 }}
            />
          </View>

          <Text className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-neutral-500">
            Kết quả gần đây
          </Text>
          {loadingHistory ? (
            <View className="items-center py-4">
              <LoadingSpinner visible inline />
            </View>
          ) : history.length === 0 ? (
            <Text className="text-[13px] text-neutral-500">Chưa có lịch sử cho sản phẩm này.</Text>
          ) : (
            <View className="gap-4">
              {history.map((h) => (
                <View key={h.id} className="overflow-hidden rounded-2xl bg-white dark:bg-neutral-900">
                  <Image
                    source={{ uri: resolveAssetUrl(h.resultImageUrl) ?? h.resultImageUrl }}
                    style={{ width: "100%", aspectRatio: 3 / 4 }}
                    contentFit="contain"
                  />
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}
