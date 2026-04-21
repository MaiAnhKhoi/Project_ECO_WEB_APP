import React, { useMemo } from "react";
import { List, useTable } from "@refinedev/antd";
import { Button, Select, Space, Table, Tag } from "antd";
import type { ContactMessageDto } from "../../type/contactMessage";
import dayjs from "dayjs";
import { useNavigation } from "@refinedev/core";

const STATUS_OPTIONS = [
  { label: "Mới", value: "new", color: "blue" },
  { label: "Đang xử lý", value: "in_progress", color: "orange" },
  { label: "Đã xử lý", value: "resolved", color: "green" },
];

export const ContactMessageList: React.FC = () => {
  const { tableProps, filters, setFilters } = useTable<ContactMessageDto>({
    resource: "contact-messages",
    syncWithLocation: false,
    pagination: { pageSize: 10 },
  });
  const { show } = useNavigation();

  const statusFilter = Array.isArray(filters)
    ? filters.find((f: any) => f.field === "status")
    : undefined;
  const currentStatus = (statusFilter as any)?.value;

  const columns = useMemo(
    () => [
      {
        title: "Khách hàng",
        dataIndex: "name",
        render: (value: string) => <span className="fw-medium">{value}</span>,
      },
      {
        title: "Email",
        dataIndex: "email",
      },
      {
        title: "Tin nhắn",
        dataIndex: "message",
        ellipsis: true,
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        render: (value: string) => {
          const opt = STATUS_OPTIONS.find((item) => item.value === value);
          return <Tag color={opt?.color}>{opt?.label ?? value}</Tag>;
        },
      },
      {
        title: "Người xử lý",
        dataIndex: "handledBy",
        render: (value: string) => value ?? "—",
      },
      {
        title: "Ngày gửi",
        dataIndex: "createdAt",
        render: (value: string) => dayjs(value).format("DD/MM/YYYY HH:mm"),
      },
      {
        title: "Thao tác",
        key: "actions",
        render: (_: any, record: ContactMessageDto) => (
          <Button size="small" onClick={() => show("contact-messages", record.id)}>
            Xem
          </Button>
        ),
      },
    ],
    [show],
  );

  return (
    <List
      title="Liên hệ khách hàng"
      headerButtons={() => (
        <Select
          allowClear
          placeholder="Lọc trạng thái"
          options={STATUS_OPTIONS}
          value={currentStatus}
          style={{ width: 220 }}
          onChange={(value) =>
            setFilters?.([{ field: "status", operator: "eq", value }], "replace")
          }
        />
      )}
    >
      <Table<ContactMessageDto> {...tableProps} rowKey="id" columns={columns} />
    </List>
  );
};

