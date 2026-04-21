import { Show } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import type { HttpError } from "@refinedev/core";
import { Descriptions, Tag } from "antd";
import type { Coupon } from "../../type/coupon";

export const CouponShow = () => {
  const { query } = useShow<Coupon, HttpError>({
    resource: "coupons",
  });

  const { data, isLoading } = query;
  const record = data?.data;

  const renderType = (type?: Coupon["type"]) => {
    if (!type) return "-";
    if (type === "PERCENT") return "Phần trăm (%)";
    if (type === "FIXED") return "Số tiền";
    return type;
  };

  const formatMoney = (value?: number | null) =>
    value != null ? `${value.toLocaleString("vi-VN")} đ` : "-";

  const formatDateTime = (value?: string | null) =>
    value ? new Date(value).toLocaleString("vi-VN") : "-";

  const renderStatus = (status?: string) => {
    if (!status) return <Tag>-</Tag>;

    const lower = status.toLowerCase();
    if (lower === "active") return <Tag color="green">Active</Tag>;
    if (lower === "inactive") return <Tag color="orange">Inactive</Tag>;
    if (lower === "expired") return <Tag color="red">Expired</Tag>;
    if (lower === "deleted") return <Tag color="default">Deleted</Tag>;

    return <Tag>{status}</Tag>;
  };

  const used = record?.usedCount ?? 0;
  const limit = record?.usageLimit;

  return (
    <Show title={`Coupon #${record?.id ?? ""}`} isLoading={isLoading}>
      <Descriptions bordered column={1}>
        <Descriptions.Item label="ID">{record?.id}</Descriptions.Item>

        <Descriptions.Item label="Code">{record?.code}</Descriptions.Item>

        <Descriptions.Item label="Type">
          {renderType(record?.type)}
        </Descriptions.Item>

        <Descriptions.Item label="Value">
          {record
            ? record.type === "PERCENT"
              ? `${record.value}%`
              : formatMoney(record.value)
            : "-"}
        </Descriptions.Item>

        <Descriptions.Item label="Min Order">
          {formatMoney(record?.minOrder)}
        </Descriptions.Item>

        <Descriptions.Item label="Max Discount">
          {formatMoney(record?.maxDiscount)}
        </Descriptions.Item>

        <Descriptions.Item label="Start At">
          {formatDateTime(record?.startAt)}
        </Descriptions.Item>

        <Descriptions.Item label="End At">
          {formatDateTime(record?.endAt)}
        </Descriptions.Item>

        <Descriptions.Item label="Usage Limit">
          {record?.usageLimit != null ? record.usageLimit : "-"}
        </Descriptions.Item>

        <Descriptions.Item label="Used Count">
          {limit != null ? `${used} / ${limit}` : used}
        </Descriptions.Item>

        <Descriptions.Item label="Status">
          {renderStatus(record?.status)}
        </Descriptions.Item>

        <Descriptions.Item label="Created At">
          {formatDateTime(record?.createdAt)}
        </Descriptions.Item>
      </Descriptions>
    </Show>
  );
};
