import React from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppIcon } from "@/components/ui/AppIcon";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomIconButton } from "@/components/ui/CustomIconButton";
import { useAppColors } from "@/hooks/use-app-colors";

export type WishlistSort = "default" | "priceAsc" | "priceDesc" | "nameAsc";
export type WishlistStockFilter = "all" | "inStock" | "outOfStock";
export type WishlistSaleFilter = "all" | "onSale";

export type WishlistFilters = {
  sort: WishlistSort;
  stock: WishlistStockFilter;
  sale: WishlistSaleFilter;
};

export const WISHLIST_DEFAULT_FILTERS: WishlistFilters = {
  sort: "default",
  stock: "all",
  sale: "all",
};

const SORT_OPTIONS: { key: WishlistSort; label: string }[] = [
  { key: "default", label: "Mặc định" },
  { key: "priceAsc", label: "Giá tăng dần" },
  { key: "priceDesc", label: "Giá giảm dần" },
  { key: "nameAsc", label: "Tên A → Z" },
];

const STOCK_OPTIONS: { key: WishlistStockFilter; label: string }[] = [
  { key: "all", label: "Tất cả" },
  { key: "inStock", label: "Còn hàng" },
  { key: "outOfStock", label: "Hết hàng" },
];

const SALE_OPTIONS: { key: WishlistSaleFilter; label: string }[] = [
  { key: "all", label: "Tất cả" },
  { key: "onSale", label: "Đang giảm giá" },
];

function OptionRow({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  const colors = useAppColors();
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center justify-between py-3.5 active:opacity-80"
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      <Text
        className="flex-1 pr-3 text-[15px]"
        style={{
          color: selected ? colors.tint : colors.text,
          fontWeight: selected ? "600" : "500",
        }}
      >
        {label}
      </Text>
      {selected ? (
        <AppIcon name="check" size={20} color={colors.tint} />
      ) : (
        <View className="h-5 w-5 rounded-full border" style={{ borderColor: colors.border }} />
      )}
    </Pressable>
  );
}

type Props = {
  visible: boolean;
  onClose: () => void;
  filters: WishlistFilters;
  onChange: (next: WishlistFilters) => void;
  onReset: () => void;
};

export function WishlistFilterModal({
  visible,
  onClose,
  filters,
  onChange,
  onReset,
}: Props) {
  const colors = useAppColors();
  const insets = useSafeAreaInsets();
  const { height: winH } = useWindowDimensions();
  const maxSheet = Math.min(winH * 0.72, 520);

  const patch = (partial: Partial<WishlistFilters>) => {
    onChange({ ...filters, ...partial });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.wrap}>
        <Pressable
          onPress={onClose}
          style={StyleSheet.absoluteFill}
          accessibilityLabel="Đóng bộ lọc"
        />
        <View
          style={{
            maxHeight: maxSheet,
            backgroundColor: colors.background,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingBottom: Math.max(insets.bottom, 16),
            paddingHorizontal: 20,
            borderTopWidth: 1,
            borderColor: colors.border,
          }}
        >
          <View className="mb-2 mt-3 flex-row items-center justify-between">
            <Text className="text-[18px] font-bold" style={{ color: colors.text }}>
              Lọc & sắp xếp
            </Text>
            <CustomIconButton onPress={onClose} accessibilityLabel="Đóng">
              <AppIcon name="x" size={22} color={colors.text} />
            </CustomIconButton>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 8 }}
          >
            <Text
              className="mb-1 mt-2 text-[11px] font-bold uppercase tracking-wider"
              style={{ color: colors.mutedText }}
            >
              Sắp xếp
            </Text>
            <View
              className="rounded-2xl px-3"
              style={{ backgroundColor: colors.surfaceMuted, borderWidth: 1, borderColor: colors.border }}
            >
              {SORT_OPTIONS.map((o, i) => (
                <View key={o.key}>
                  <OptionRow
                    label={o.label}
                    selected={filters.sort === o.key}
                    onPress={() => patch({ sort: o.key })}
                  />
                  {i < SORT_OPTIONS.length - 1 ? (
                    <View style={{ height: 1, backgroundColor: colors.divider }} />
                  ) : null}
                </View>
              ))}
            </View>

            <Text
              className="mb-1 mt-5 text-[11px] font-bold uppercase tracking-wider"
              style={{ color: colors.mutedText }}
            >
              Tình trạng
            </Text>
            <View
              className="rounded-2xl px-3"
              style={{ backgroundColor: colors.surfaceMuted, borderWidth: 1, borderColor: colors.border }}
            >
              {STOCK_OPTIONS.map((o, i) => (
                <View key={o.key}>
                  <OptionRow
                    label={o.label}
                    selected={filters.stock === o.key}
                    onPress={() => patch({ stock: o.key })}
                  />
                  {i < STOCK_OPTIONS.length - 1 ? (
                    <View style={{ height: 1, backgroundColor: colors.divider }} />
                  ) : null}
                </View>
              ))}
            </View>

            <Text
              className="mb-1 mt-5 text-[11px] font-bold uppercase tracking-wider"
              style={{ color: colors.mutedText }}
            >
              Khuyến mãi
            </Text>
            <View
              className="rounded-2xl px-3"
              style={{ backgroundColor: colors.surfaceMuted, borderWidth: 1, borderColor: colors.border }}
            >
              {SALE_OPTIONS.map((o, i) => (
                <View key={o.key}>
                  <OptionRow
                    label={o.label}
                    selected={filters.sale === o.key}
                    onPress={() => patch({ sale: o.key })}
                  />
                  {i < SALE_OPTIONS.length - 1 ? (
                    <View style={{ height: 1, backgroundColor: colors.divider }} />
                  ) : null}
                </View>
              ))}
            </View>
          </ScrollView>

          <View className="mt-2 flex-row gap-3">
            <View className="flex-1">
              <CustomButton
                title="Đặt lại"
                variant="secondary"
                onPress={() => {
                  onReset();
                }}
                style={{ paddingVertical: 14, borderRadius: 14 }}
              />
            </View>
            <View className="flex-1">
              <CustomButton
                title="Xong"
                onPress={onClose}
                style={{ paddingVertical: 14, borderRadius: 14 }}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.45)",
  },
});

export function wishlistFiltersActive(f: WishlistFilters): boolean {
  return (
    f.sort !== WISHLIST_DEFAULT_FILTERS.sort ||
    f.stock !== WISHLIST_DEFAULT_FILTERS.stock ||
    f.sale !== WISHLIST_DEFAULT_FILTERS.sale
  );
}
