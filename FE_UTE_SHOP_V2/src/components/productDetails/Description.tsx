// src/components/productDetails/Description.tsx
import type { ProductTabsResponse } from "@/types/product";

type DescriptionProps = {
  data: ProductTabsResponse["description"] | null;
};

export default function Description({ data }: DescriptionProps) {
  if (!data) {
    return (
      <div className="widget-desc">
        <p>Mô tả sản phẩm đang được cập nhật.</p>
      </div>
    );
  }

  return (
    <div className="widget-desc">
      {data.paragraphs?.map((p, idx) => (
        <p key={idx}>{p}</p>
      ))}

      {data.bulletPoints && data.bulletPoints.length > 0 && (
        <ul>
          {data.bulletPoints.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
