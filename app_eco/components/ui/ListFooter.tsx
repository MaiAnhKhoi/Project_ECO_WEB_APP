import React from "react";
import { Text, View } from "react-native";

import { useAppColors } from "@/hooks/use-app-colors";
import { LoadingSpinner } from "./LoadingSpinner";

type Props = {
  loadingMore: boolean;
  hasMore: boolean;
  loadedCount: number;
  totalElements: number;
  /** Đơn vị hiển thị trong dòng "Đã hiển thị X/Y …". Mặc định "mục". */
  unit?: string;
};

/**
 * Footer dùng chung cho FlatList phân trang vô hạn.
 * - Đang tải thêm: spinner nhỏ.
 * - Hết trang: dòng chữ "Đã hiển thị X/Y <unit>".
 * - Còn trang hoặc danh sách rỗng: null.
 */
export function ListFooter({
  loadingMore,
  hasMore,
  loadedCount,
  totalElements,
  unit = "mục",
}: Props) {
  const colors = useAppColors();

  if (loadingMore) {
    return (
      <View style={{ alignItems: "center", paddingVertical: 24 }}>
        <LoadingSpinner visible inline />
      </View>
    );
  }

  if (!hasMore && loadedCount > 0) {
    const label =
      totalElements > 0
        ? `Đã hiển thị ${loadedCount}/${totalElements} ${unit}`
        : `Đã hiển thị ${loadedCount} ${unit}`;
    return (
      <Text
        style={{
          color: colors.mutedText,
          textAlign: "center",
          paddingVertical: 24,
          fontSize: 12,
        }}
      >
        {label}
      </Text>
    );
  }

  return null;
}
