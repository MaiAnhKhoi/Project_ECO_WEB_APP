// src/components/productDetails/AdditionalInfo.tsx
import type { ProductTabsResponse } from "@/types/product";

type AdditionalInfoProps = {
  items: ProductTabsResponse["additionalInfo"];
};

export default function AdditionalInfo({ items }: AdditionalInfoProps) {
  if (!items || items.length === 0) {
    return <p>Thông tin bổ sung đang được cập nhật.</p>;
  }

  return (
    <table className="tb-info-product text-md">
      <tbody>
        {items.map((item, idx) => (
          <tr className="tb-attr-item" key={idx}>
            <th className="tb-attr-label">{item.label}</th>
            <td className="tb-attr-value">
              <p>{item.value}</p>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
