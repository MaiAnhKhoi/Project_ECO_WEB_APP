import React, { useMemo } from "react";
import { List, useTable } from "@refinedev/antd";
import { Avatar, Button, Rate, Select, Space, Table, Tag } from "antd";
import dayjs from "dayjs";
import type { ReviewAdminDto } from "../../type/review";
import { useNavigation } from "@refinedev/core";

const STATUS_OPTIONS = [
  { label: "Pending", value: "pending", color: "warning" as const },
  { label: "Approved", value: "approved", color: "success" as const },
  { label: "Rejected", value: "rejected", color: "error" as const },
];

export const ReviewList: React.FC = () => {
  const { tableProps, filters, setFilters } = useTable<ReviewAdminDto>({
    resource: "reviews",
    pagination: { pageSize: 10 },
    syncWithLocation: false,
  });
  const { show } = useNavigation();

  const statusFilter = Array.isArray(filters)
    ? filters.find((f: any) => f.field === "status")
    : undefined;
  const currentStatus = (statusFilter as any)?.value;

  const columns = useMemo(
    () => [
      {
        title: "Sản phẩm",
        dataIndex: "productName",
        render: (_: string, record: ReviewAdminDto) => (
          <Space direction="vertical" size={2}>
            <span className="fw-medium">{record.productName}</span>
            <span className="text-muted">#{record.productId}</span>
          </Space>
        ),
      },
      {
        title: "Khách hàng",
        dataIndex: "userName",
        render: (_: string, record: ReviewAdminDto) => (
          <Space>
            <Avatar>{record.userName?.[0]}</Avatar>
            <div>
              <div>{record.userName}</div>
              <Tag>#{record.userId}</Tag>
            </div>
          </Space>
        ),
      },
      {
        title: "Đánh giá",
        dataIndex: "rating",
        render: (value: number) => <Rate disabled defaultValue={value} />,
      },
      {
        title: "Nội dung",
        dataIndex: "content",
        ellipsis: true,
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        render: (value: string) => {
          const option = STATUS_OPTIONS.find((opt) => opt.value === value);
          return (
            <Tag color={option?.color ?? "default"} className="text-uppercase">
              {option?.label ?? value}
            </Tag>
          );
        },
      },
      {
        title: "Ngày tạo",
        dataIndex: "createdAt",
        render: (value: string) => dayjs(value).format("DD/MM/YYYY HH:mm"),
      },
      {
        title: "Thao tác",
        key: "actions",
        render: (_: any, record: ReviewAdminDto) => (
          <Button size="small" onClick={() => show("reviews", record.id)}>
            Xem chi tiết
          </Button>
        ),
      },
    ],
    [show],
  );

  return (
    <List
      title="Đánh giá sản phẩm"
      headerButtons={() => (
        <Space>
          <Select
            allowClear
            placeholder="Lọc trạng thái"
            options={STATUS_OPTIONS}
            value={currentStatus}
            onChange={(value) => {
            setFilters?.([{ field: "status", operator: "eq", value }], "replace");
            }}
            style={{ width: 200 }}
          />
        </Space>
      )}
    >
      <Table<ReviewAdminDto> {...tableProps} rowKey="id" columns={columns} />
    </List>
  );
};

