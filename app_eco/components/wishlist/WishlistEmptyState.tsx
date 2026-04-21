import React from "react";

import { EmptyStateBlock } from "@/components/ui/EmptyStateBlock";

type Props = {
  onExplore: () => void;
};

export function WishlistEmptyState({ onExplore }: Props) {
  return (
    <EmptyStateBlock
      iconName="heart"
      sectionLabel="Yêu thích"
      title="Danh sách trống"
      description="Lưu sản phẩm bạn thích để xem lại sau."
      action={{ label: "Khám phá cửa hàng", onPress: onExplore }}
    />
  );
}
