import React, { type ReactNode } from "react";
import { View } from "react-native";
import {
  SafeAreaView,
  type Edges,
} from "react-native-safe-area-context";

type Props = {
  children: ReactNode;
  /** Header cố định (đã tự xử lý safe area top) */
  header?: ReactNode;
  /** Khu vực giữa header và vùng nội dung (vd. chip lọc shop) */
  stickyBelowHeader?: ReactNode;
  /** Modal / layer nổi — nằm trong root View, ngoài SafeAreaView nội dung */
  overlay?: ReactNode;
  edges?: Edges;
  rootClassName?: string;
};

/**
 * Layout chung cho các tab có header riêng + nội dung trong SafeArea (trái/phải/dưới).
 */
export function AppScreenShell({
  header,
  stickyBelowHeader,
  children,
  overlay,
  edges = ["left", "right", "bottom"],
  rootClassName = "flex-1 bg-neutral-50 dark:bg-neutral-950",
}: Props) {
  return (
    <View className={rootClassName}>
      {header}
      {stickyBelowHeader}
      <SafeAreaView className="flex-1" edges={edges}>
        {children}
      </SafeAreaView>
      {overlay}
    </View>
  );
}
