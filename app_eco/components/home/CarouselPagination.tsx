import React from "react";
import { View } from "react-native";

import { useAppColors } from "@/hooks/use-app-colors";

type Props = {
  count: number;
  activeIndex: number;
};

/** Chấm tròn giống banner tham chiếu: mục đang xem nổi bật theo theme tint */
export function CarouselPagination({ count, activeIndex }: Props) {
  const colors = useAppColors();

  if (count <= 1) return null;

  return (
    <View className="flex-row items-center justify-center py-2">
      {Array.from({ length: count }).map((_, i) => {
        const active = i === activeIndex;
        return (
          <View
            key={i}
            style={{
              marginHorizontal: 4,
              width: active ? 8 : 6,
              height: active ? 8 : 6,
              borderRadius: 99,
              backgroundColor: active ? colors.tint : colors.border,
              opacity: active ? 1 : 0.55,
            }}
          />
        );
      })}
    </View>
  );
}
