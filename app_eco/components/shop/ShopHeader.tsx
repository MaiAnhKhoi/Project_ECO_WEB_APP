import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppIcon } from "@/components/ui/AppIcon";
import { CustomIconButton } from "@/components/ui/CustomIconButton";
import { useAppColors } from "@/hooks/use-app-colors";

type Props = {
  title?: string;
  subtitle?: string;
  onBack: () => void;
  searchActive: boolean;
  searchQuery: string;
  onSearchFocus: () => void;
  onSearchChange: (text: string) => void;
  onSearchClear: () => void;
  onSearchClose: () => void;
  filterActive?: boolean;
  onOpenFilter: () => void;
};

export function ShopHeader({
  title = "Cửa hàng",
  subtitle,
  onBack,
  searchActive,
  searchQuery,
  onSearchFocus,
  onSearchChange,
  onSearchClear,
  onSearchClose,
  filterActive = false,
  onOpenFilter,
}: Props) {
  const colors = useAppColors();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingTop: insets.top + 6,
        paddingBottom: 14,
        paddingHorizontal: 16,
        backgroundColor: colors.background,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        zIndex: 20,
        elevation: 20,
      }}
    >
      {searchActive ? (
        /* ── Chế độ tìm kiếm (có mũi tên giống Yêu thích / iOS) ── */
        <View className="flex-row items-center gap-2">
          <CustomIconButton onPress={onBack} accessibilityLabel="Trở lại">
            <AppIcon name="chevron-left" size={22} color={colors.text} />
          </CustomIconButton>
          <View
            className="min-w-0 flex-1 flex-row items-center gap-2 rounded-2xl px-3"
            style={{
              height: 44,
              backgroundColor: colors.surfaceMuted,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <AppIcon name="search" size={18} color={colors.mutedText} />
            <TextInput
              autoFocus
              value={searchQuery}
              onChangeText={onSearchChange}
              placeholder="Tìm sản phẩm..."
              placeholderTextColor={colors.mutedText}
              returnKeyType="search"
              style={{ flex: 1, color: colors.text, fontSize: 15, paddingVertical: 0 }}
            />
            {searchQuery.length > 0 ? (
              <Pressable onPress={onSearchClear} hitSlop={8}>
                <AppIcon name="x-circle" size={18} color={colors.mutedText} />
              </Pressable>
            ) : null}
          </View>
          <Pressable onPress={onSearchClose} hitSlop={8} className="px-1">
            <Text className="text-[15px] font-semibold" style={{ color: colors.tint }}>
              Huỷ
            </Text>
          </Pressable>
        </View>
      ) : (
        /* ── Chế độ bình thường — giống hệt WishlistHeader ── */
        <View className="flex-row items-center">
          <CustomIconButton onPress={onBack} accessibilityLabel="Trở lại">
            <AppIcon name="chevron-left" size={22} color={colors.text} />
          </CustomIconButton>

          <View className="min-w-0 flex-1 px-2">
            <Text
              className="text-[20px] font-semibold tracking-tight"
              style={{ color: colors.text }}
              numberOfLines={1}
            >
              {title}
            </Text>
            {subtitle ? (
              <Text
                className="mt-0.5 text-[13px]"
                style={{ color: colors.mutedText }}
                numberOfLines={1}
              >
                {subtitle}
              </Text>
            ) : null}
          </View>

          <View className="flex-row items-center gap-1">
            <CustomIconButton onPress={onSearchFocus} accessibilityLabel="Tìm kiếm sản phẩm">
              <AppIcon name="search" size={20} color={colors.text} />
            </CustomIconButton>

            <View className="relative">
              <CustomIconButton
                onPress={onOpenFilter}
                accessibilityLabel="Bộ lọc và sắp xếp"
                style={filterActive ? { backgroundColor: `${colors.tint}18` } : undefined}
              >
                <AppIcon
                  name="sliders"
                  size={20}
                  color={filterActive ? colors.tint : colors.text}
                />
              </CustomIconButton>
              {filterActive ? (
                <View
                  className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2"
                  style={{ borderColor: colors.background, backgroundColor: colors.tint }}
                />
              ) : null}
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
