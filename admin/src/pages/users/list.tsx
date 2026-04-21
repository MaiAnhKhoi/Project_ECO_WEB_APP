// src/pages/users/UserList.tsx
import {
  List,
  DateField,
  EditButton,
  ShowButton,
  DeleteButton,
} from "@refinedev/antd";
import { useTable } from "@refinedev/antd";
import type { BaseRecord } from "@refinedev/core";
import { Table, Space, Tag, Button, Tabs, TabsProps, Alert } from "antd";
import { UserSwitchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

const USER_TABS: TabsProps["items"] = [
  { key: "staff", label: "Nhân viên" },
  { key: "customer", label: "Khách hàng" },
];

export const UserList = () => {
  const [activeTab, setActiveTab] = useState<"staff" | "customer">("staff");
  const { tableProps, setFilters } = useTable({
    resource: "users",
    syncWithLocation: false,
    pagination: { pageSize: 10 },
  });

  const navigate = useNavigate();

  useEffect(() => {
    setFilters?.(
      [{ field: "category", operator: "eq", value: activeTab }],
      "replace"
    );
  }, [activeTab, setFilters]);

  const actionColumn = useMemo(
    () => ({
      title: "Actions",
      dataIndex: "actions",
      fixed: "right" as const,
      width: activeTab === "staff" ? 200 : 80,
      render: (_: any, record: BaseRecord) =>
        activeTab === "customer" ? (
          <ShowButton hideText size="small" recordItemId={record.id} />
        ) : (
          <Space>
            <EditButton hideText size="small" recordItemId={record.id} />
            <ShowButton hideText size="small" recordItemId={record.id} />
            <DeleteButton hideText size="small" recordItemId={record.id} />
            <Button
              icon={<UserSwitchOutlined />}
              size="small"
              type="default"
              onClick={() => navigate(`/users/assign-roles/${record.id}`)}
            />
          </Space>
        ),
    }),
    [activeTab, navigate],
  );

  return (
    <List
      title="Quản lý người dùng"
      headerButtons={({ defaultButtons }) =>
        activeTab === "staff" ? defaultButtons : null
      }
    >
      <Tabs
        items={USER_TABS}
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key as "staff" | "customer")}
        style={{ marginBottom: 16 }}
      />
      {activeTab === "customer" && (
        <Alert
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
          message="Danh sách khách hàng chỉ cho phép xem thông tin."
        />
      )}
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="id" title="ID" width={70} />
        <Table.Column dataIndex="name" title="Tên" />
        <Table.Column dataIndex="email" title="Email" />

        <Table.Column
          dataIndex="phone"
          title="Số điện thoại"
          render={(value: string | null) => value || "-"}
        />

        <Table.Column
          dataIndex="status"
          title="Trạng thái"
          render={(value: string) => {
            const isActive = value === "ACTIVE";
            return (
              <Tag color={isActive ? "green" : "red"}>
                {isActive ? "Active" : value}
              </Tag>
            );
          }}
        />

        <Table.Column
          dataIndex="emailVerified"
          title="Email"
          render={(value: boolean) =>
            value ? <Tag color="green">Đã xác thực</Tag> : <Tag>Chưa</Tag>
          }
        />

        <Table.Column
          dataIndex="phoneVerified"
          title="SĐT"
          render={(value: boolean) =>
            value ? <Tag color="green">Đã xác thực</Tag> : <Tag>Chưa</Tag>
          }
        />

        <Table.Column
          dataIndex="twoFactorEnabled"
          title="2FA"
          render={(value: boolean) =>
            value ? <Tag color="blue">Bật</Tag> : <Tag>Tắt</Tag>
          }
        />

        {/* 🔥 Cột hiển thị roles */}
        <Table.Column
          dataIndex="roles"
          title="Vai trò"
          render={(roles: any[]) =>
            !roles?.length ? (
              "-"
            ) : (
              <Space size={[4, 4]} wrap>
                {roles.map((role) => (
                  <Tag color="geekblue" key={role.id}>
                    {role.name || role.code}
                  </Tag>
                ))}
              </Space>
            )
          }
        />

        <Table.Column
          dataIndex="lastLoginAt"
          title="Lần đăng nhập cuối"
          render={(value: any) =>
            value ? <DateField value={value} format="YYYY-MM-DD HH:mm" /> : "-"
          }
        />

        <Table.Column
          dataIndex="createdAt"
          title="Ngày tạo"
          render={(value: any) => <DateField value={value} />}
        />

        {/* ========================= */}
        {/* 🔥 Actions */}
        {/* ========================= */}
        <Table.Column {...actionColumn} />
      </Table>
    </List>
  );
};
