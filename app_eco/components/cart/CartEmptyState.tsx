import React from "react";

import { EmptyStateBlock } from "@/components/ui/EmptyStateBlock";

type CartEmptyStateProps = {
  onShop: () => void;
};

export function CartEmptyState({ onShop }: CartEmptyStateProps) {
  return (
    <EmptyStateBlock
      iconName="shopping-cart"
      sectionLabel="Giỏ hàng"
      title="Chưa có sản phẩm"
      description="Thêm món bạn yêu thích để tiếp tục mua sắm."
      action={{ label: "Mua sắm ngay", onPress: onShop }}
    />
  );
}
