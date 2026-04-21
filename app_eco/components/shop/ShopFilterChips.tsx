import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { AppIcon } from "@/components/ui/AppIcon";
import { useAppColors } from "@/hooks/use-app-colors";
import type { FilterBrand, FilterColor, ShopFilters } from "@/types/filter";

type Chip = {
  key: string;
  label: string;
  onRemove: () => void;
};

type Props = {
  filters: ShopFilters;
  globalMin: number;
  globalMax: number;
  brands: FilterBrand[];
  colors: FilterColor[];
  onPatchFilter: (patch: Partial<ShopFilters>) => void;
  onClearAll: () => void;
};

const SORT_LABELS: Record<string, string> = {
  priceAsc: "Giá tăng dần",
  priceDesc: "Giá giảm dần",
  nameAsc: "Tên A→Z",
  nameDesc: "Tên Z→A",
};

export function ShopFilterChips({
  filters,
  globalMin,
  globalMax,
  brands,
  colors,
  onPatchFilter,
  onClearAll,
}: Props) {
  const appColors = useAppColors();

  const chips: Chip[] = [];

  if (filters.sort !== "default") {
    chips.push({
      key: "sort",
      label: SORT_LABELS[filters.sort] ?? filters.sort,
      onRemove: () => onPatchFilter({ sort: "default" }),
    });
  }
  if (filters.availability === "inStock") {
    chips.push({ key: "availability", label: "Còn hàng", onRemove: () => onPatchFilter({ availability: "all" }) });
  } else if (filters.availability === "outOfStock") {
    chips.push({ key: "availability", label: "Hết hàng", onRemove: () => onPatchFilter({ availability: "all" }) });
  }
  if (filters.color) {
    const c = colors.find((x) => x.name === filters.color);
    chips.push({
      key: "color",
      label: `Màu: ${c?.name ?? filters.color}`,
      onRemove: () => onPatchFilter({ color: null }),
    });
  }
  if (filters.size) {
    chips.push({ key: "size", label: `Size: ${filters.size}`, onRemove: () => onPatchFilter({ size: null }) });
  }
  if (filters.brandId !== null) {
    const b = brands.find((x) => x.id === filters.brandId);
    chips.push({
      key: "brand",
      label: `Thương hiệu: ${b?.name ?? filters.brandId}`,
      onRemove: () => onPatchFilter({ brandId: null }),
    });
  }
  if (filters.categorySlug) {
    chips.push({
      key: "category",
      label: `Danh mục: ${filters.categorySlug}`,
      onRemove: () => onPatchFilter({ categorySlug: null }),
    });
  }
  if (
    (filters.minPrice !== null && filters.minPrice > globalMin) ||
    (filters.maxPrice !== null && filters.maxPrice < globalMax)
  ) {
    const lo = filters.minPrice ?? globalMin;
    const hi = filters.maxPrice ?? globalMax;
    chips.push({
      key: "price",
      label: `${lo.toLocaleString("vi-VN")}₫ – ${hi.toLocaleString("vi-VN")}₫`,
      onRemove: () => onPatchFilter({ minPrice: null, maxPrice: null }),
    });
  }

  if (chips.length === 0) return null;

  return (
    <View
      style={{
        borderBottomWidth: 1,
        borderBottomColor: appColors.border,
        backgroundColor: appColors.background,
        paddingVertical: 8,
      }}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8, flexDirection: "row" }}
      >
        {chips.map((chip) => (
          <View
            key={chip.key}
            className="flex-row items-center gap-1.5 rounded-full px-3 py-1.5"
            style={{
              backgroundColor: `${appColors.tint}14`,
              borderWidth: 1,
              borderColor: `${appColors.tint}44`,
            }}
          >
            <Text
              numberOfLines={1}
              className="max-w-[160px] text-[12px] font-semibold"
              style={{ color: appColors.tint }}
            >
              {chip.label}
            </Text>
            <Pressable onPress={chip.onRemove} hitSlop={8}>
              <AppIcon name="x" size={13} color={appColors.tint} />
            </Pressable>
          </View>
        ))}

        {chips.length > 1 ? (
          <Pressable
            onPress={onClearAll}
            className="flex-row items-center gap-1 rounded-full px-3 py-1.5"
            style={{
              backgroundColor: appColors.surfaceMuted,
              borderWidth: 1,
              borderColor: appColors.border,
            }}
          >
            <AppIcon name="x" size={12} color={appColors.mutedText} />
            <Text className="text-[12px] font-medium" style={{ color: appColors.mutedText }}>
              Xoá tất cả
            </Text>
          </Pressable>
        ) : null}
      </ScrollView>
    </View>
  );
}
