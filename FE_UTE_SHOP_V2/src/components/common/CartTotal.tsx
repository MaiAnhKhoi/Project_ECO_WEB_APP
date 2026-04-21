"use client";

import { useContextElement } from "@/context/Context";
import { formatPrice } from "@/utils/formatPrice";

export default function CartTotal() {
  const { totalPrice } = useContextElement();
  return <>{formatPrice(totalPrice)}</>;
}
