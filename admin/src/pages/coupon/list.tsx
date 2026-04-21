// src/pages/coupons/list.tsx
import {
  List,
  EditButton,
  ShowButton,
  DeleteButton,
  useTable,
} from "@refinedev/antd";
import type { BaseRecord } from "@refinedev/core";
import { Table, Space, Tag } from "antd";
import type { Coupon } from "../../type/coupon";

export const CouponList = () => {
  const { tableProps } = useTable<Coupon>({
    resource: "coupons",
    syncWithLocation: true,
  });

  const renderType = (type: Coupon["type"]) => {
    if (!type) return "-";
    if (type === "PERCENT") return "Phần trăm (%)";
    if (type === "FIXED") return "Số tiền";
    return type;
  };

  const renderStatus = (status?: string) => {
    if (!status) return <Tag>-</Tag>;

    const lower = status.toLowerCase();
    if (lower === "active") return <Tag color="green">Active</Tag>;
    if (lower === "inactive") return <Tag color="orange">Inactive</Tag>;
    if (lower === "expired") return <Tag color="red">Expired</Tag>;
    if (lower === "deleted") return <Tag color="default">Deleted</Tag>;

    return <Tag>{status}</Tag>;
  };

  const formatMoney = (value?: number | null) =>
    value != null ? `${value.toLocaleString("vi-VN")} đ` : "-";

  const formatDateTime = (value?: string | null) =>
    value ? new Date(value).toLocaleString("vi-VN") : "-";

  return (
    <List title="Coupons">
      <Table {...tableProps} rowKey="id">
        <Table.Column<Coupon> dataIndex="id" title="ID" width={70} />

        <Table.Column<Coupon> dataIndex="code" title="Mã giảm giá" />

        <Table.Column<Coupon>
          dataIndex="type"
          title="Loại"
          render={renderType}
        />

        <Table.Column<Coupon>
          dataIndex="value"
          title="Giá trị"
          render={(value: number, record) =>
            record.type === "PERCENT"
              ? `${value}%`
              : formatMoney(value)
          }
        />

        <Table.Column<Coupon>
          dataIndex="minOrder"
          title="Đơn tối thiểu"
          render={formatMoney}
        />

        <Table.Column<Coupon>
          dataIndex="maxDiscount"
          title="Giảm tối đa"
          render={formatMoney}
        />

        {/* Thời gian hiệu lực */}
        <Table.Column<Coupon>
          dataIndex="startAt"
          title="Bắt đầu"
          render={formatDateTime}
        />

        <Table.Column<Coupon>
          dataIndex="endAt"
          title="Kết thúc"
          render={formatDateTime}
        />

        <Table.Column<Coupon>
          dataIndex="usageLimit"
          title="Giới hạn lượt dùng"
          render={(value?: number | null) => (value != null ? value : "-")}
        />

        {/* ĐÃ DÙNG / GIỚI HẠN */}
        <Table.Column<Coupon>
          dataIndex="usedCount"
          title="Đã dùng"
          render={(_, record) => {
            const used = record.usedCount ?? 0;
            const limit = record.usageLimit;
            if (limit != null) {
              return (
                <span>
                  {used} / {limit}
                </span>
              );
            }
            return used;
          }}
        />

        <Table.Column<Coupon>
          dataIndex="status"
          title="Trạng thái"
          render={renderStatus}
        />

        <Table.Column<Coupon>
          dataIndex="createdAt"
          title="Ngày tạo"
          render={formatDateTime}
        />

        <Table.Column
          title="Actions"
          dataIndex="actions"
          fixed="right"
          width={150}
          render={(_, record: BaseRecord) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <ShowButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
