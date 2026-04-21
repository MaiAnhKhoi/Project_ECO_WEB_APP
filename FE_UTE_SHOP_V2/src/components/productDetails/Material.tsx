// src/components/productDetails/Material.tsx
import type { ProductTabsResponse } from "@/types/product";

type MaterialProps = {
  data: ProductTabsResponse["materials"] | null;
};

export default function Material({ data }: MaterialProps) {
  if (!data) {
    return (
      <div className="item">
        <p className="fw-medium title">Materials Care</p>
        <p>Thông tin chất liệu đang được cập nhật.</p>
      </div>
    );
  }

  return (
    <div className="item">
      <p className="fw-medium title">{data.title}</p>
      <ul>
        {data.items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
