import React from "react";
import { Text, View } from "react-native";

import { CustomButton } from "@/components/ui/CustomButton";
import { useAppColors } from "@/hooks/use-app-colors";

type Props = {
  /** Đang tìm kiếm hay lọc? */
  isFiltered?: boolean;
  onClearFilter?: () => void;
};

export function ShopEmptyState({ isFiltered = false, onClearFilter }: Props) {
  const colors = useAppColors();

  return (
    <View className="flex-1 justify-center px-8 pb-24">
      <View className="items-center">
        <View className="mb-8 h-[1px] w-16 bg-neutral-300 dark:bg-neutral-600" />
        <Text className="text-center text-[11px] font-semibold uppercase tracking-[4px] text-neutral-400">
          Cửa hàng
        </Text>
        <Text className="mt-3 text-center text-[22px] font-light tracking-tight text-neutral-900 dark:text-neutral-100">
          {isFiltered ? "Không tìm thấy" : "Chưa có sản phẩm"}
        </Text>
        <Text className="mt-2 max-w-[260px] text-center text-[14px] leading-[22px] text-neutral-500 dark:text-neutral-400">
          {isFiltered
            ? "Thử điều chỉnh bộ lọc hoặc từ khoá tìm kiếm."
            : "Sản phẩm sẽ sớm được cập nhật."}
        </Text>
        {isFiltered && onClearFilter ? (
          <View className="mt-8 w-full max-w-[240px]">
            <CustomButton
              title="Xoá bộ lọc"
              variant="secondary"
              onPress={onClearFilter}
              style={{ borderRadius: 14 }}
            />
          </View>
        ) : null}
      </View>
    </View>
  );
}
