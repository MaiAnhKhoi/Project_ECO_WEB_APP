// src/pages/users/invitations.tsx
import { List, useTable, DateField } from "@refinedev/antd";
import { Table, Space, Button, Tag, Popconfirm, message } from "antd";
import type { HttpError } from "@refinedev/core";
import { useCustom } from "@refinedev/core";
import { MailOutlined, ReloadOutlined, CloseOutlined } from "@ant-design/icons";
import { useState } from "react";

interface Invitation {
  id: number;
  email: string;
  status: string;
  invitedBy: {
    name: string;
    email: string;
  };
  presetRoleIds: string;
  expiresAt: string;
  createdAt: string;
  acceptedAt: string | null;
}

export const InvitationList = () => {
  const { tableProps } = useTable<Invitation, HttpError>({
    resource: "roles/invitations",
    sorters: {
      initial: [{ field: "createdAt", order: "desc" }],
    },
  });

  const [loading, setLoading] = useState<Record<number, boolean>>({});

  const handleResend = async (id: number) => {
    setLoading((prev) => ({ ...prev, [id]: true }));
    try {
      const response = await fetch(
        `http://localhost:8080/api/roles/invitations/${id}/resend`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (response.ok) {
        message.success("Đã gửi lại email mời!");
        window.location.reload();
      } else {
        const error = await response.json();
        message.error(error.message || "Gửi lại email thất bại");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi gửi email");
      console.error(error);
    } finally {
      setLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleCancel = async (id: number) => {
    setLoading((prev) => ({ ...prev, [id]: true }));
    try {
      const response = await fetch(
        `http://localhost:8080/api/roles/invitations/${id}/cancel`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (response.ok) {
        message.success("Đã hủy lời mời!");
        window.location.reload();
      } else {
        const error = await response.json();
        message.error(error.message || "Hủy lời mời thất bại");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra");
      console.error(error);
    } finally {
      setLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const getStatusTag = (status: string) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      PENDING: { color: "orange", text: "Chờ xác nhận" },
      ACCEPTED: { color: "green", text: "Đã chấp nhận" },
      CANCELLED: { color: "red", text: "Đã hủy" },
      EXPIRED: { color: "default", text: "Hết hạn" },
    };
    const config = statusMap[status] || { color: "default", text: status };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  return (
    <List
      title="Danh sách lời mời nhân viên"
      headerButtons={({ defaultButtons }) => (
        <>
          {defaultButtons}
          <Button
            type="primary"
            icon={<MailOutlined />}
            href="/#/users/invite"
          >
            Mời nhân viên mới
          </Button>
        </>
      )}
    >
      <Table {...tableProps} rowKey="id">
        <Table.Column
          dataIndex="email"
          title="Email"
          sorter
        />
        
        <Table.Column
          dataIndex="status"
          title="Trạng thái"
          render={(status: string, record: Invitation) => (
            <Space direction="vertical" size={0}>
              {getStatusTag(status)}
              {status === "PENDING" && isExpired(record.expiresAt) && (
                <Tag color="red" style={{ marginTop: 4 }}>Đã hết hạn</Tag>
              )}
            </Space>
          )}
        />

        <Table.Column
          dataIndex={["invitedBy", "name"]}
          title="Người mời"
          render={(name: string, record: Invitation) => (
            <div>
              <div>{name}</div>
              <div style={{ fontSize: 12, color: "#999" }}>
                {record.invitedBy?.email}
              </div>
            </div>
          )}
        />

        <Table.Column
          dataIndex="createdAt"
          title="Ngày mời"
          render={(value) => <DateField value={value} format="DD/MM/YYYY HH:mm" />}
          sorter
        />

        <Table.Column
          dataIndex="expiresAt"
          title="Hết hạn"
          render={(value: string) => {
            const expired = isExpired(value);
            return (
              <div>
                <DateField value={value} format="DD/MM/YYYY HH:mm" />
                {expired && <Tag color="red" style={{ marginLeft: 8 }}>Hết hạn</Tag>}
              </div>
            );
          }}
        />

        <Table.Column
          dataIndex="acceptedAt"
          title="Đã chấp nhận"
          render={(value) => 
            value ? <DateField value={value} format="DD/MM/YYYY HH:mm" /> : "-"
          }
        />

        <Table.Column<Invitation>
          title="Thao tác"
          dataIndex="actions"
          render={(_, record) => (
            <Space>
              {record.status === "PENDING" && !isExpired(record.expiresAt) && (
                <>
                  <Button
                    type="link"
                    icon={<ReloadOutlined />}
                    size="small"
                    loading={loading[record.id]}
                    onClick={() => handleResend(record.id)}
                  >
                    Gửi lại
                  </Button>

                  <Popconfirm
                    title="Hủy lời mời"
                    description="Bạn có chắc muốn hủy lời mời này?"
                    onConfirm={() => handleCancel(record.id)}
                    okText="Hủy"
                    cancelText="Không"
                  >
                    <Button
                      type="link"
                      danger
                      icon={<CloseOutlined />}
                      size="small"
                      loading={loading[record.id]}
                    >
                      Hủy
                    </Button>
                  </Popconfirm>
                </>
              )}

              {record.status === "PENDING" && isExpired(record.expiresAt) && (
                <Button
                  type="link"
                  icon={<ReloadOutlined />}
                  size="small"
                  loading={loading[record.id]}
                  onClick={() => handleResend(record.id)}
                >
                  Gửi lại (Gia hạn)
                </Button>
              )}

              {(record.status === "ACCEPTED" || record.status === "CANCELLED") && (
                <span style={{ color: "#999" }}>-</span>
              )}
            </Space>
          )}
        />
      </Table>
    </List>
  );
};

