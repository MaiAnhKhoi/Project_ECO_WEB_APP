// src/pages/users/show.tsx
import { Show, TextField, DateField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography, Space, Tag, Divider } from "antd";

const { Title } = Typography;

export const UserShow = () => {
  const {
    query: { data, isLoading },
  } = useShow();

  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Title level={5}>ID</Title>
      <TextField value={record?.id ?? "-"} />

      <Title level={5}>Tên</Title>
      <TextField value={record?.name ?? "-"} />

      <Title level={5}>Email</Title>
      <TextField value={record?.email ?? "-"} />

      <Title level={5}>Số điện thoại</Title>
      <TextField value={record?.phone ?? "-"} />

      <Title level={5}>Trạng thái</Title>
      <TextField value={record?.status ?? "-"} />

      <Divider />

      <Title level={5}>Xác thực Email</Title>
      <TextField value={record?.emailVerified ? "Đã xác thực" : "Chưa"} />

      <Title level={5}>Xác thực SĐT</Title>
      <TextField value={record?.phoneVerified ? "Đã xác thực" : "Chưa"} />

      <Title level={5}>2FA</Title>
      <TextField value={record?.twoFactorEnabled ? "Bật" : "Tắt"} />

      <Divider />

      <Title level={5}>Vai trò</Title>
      {!record?.roles?.length ? (
        <TextField value="-" />
      ) : (
        <Space size={[4, 4]} wrap>
          {record.roles.map((role: any) => (
            <Tag color="geekblue" key={role.id}>
              {role.name || role.code}
            </Tag>
          ))}
        </Space>
      )}

      <Divider />

      <Title level={5}>Ngày tạo</Title>
      <DateField value={record?.createdAt} />

      <Title level={5}>Cập nhật lần cuối</Title>
      <DateField value={record?.updatedAt} />

      <Title level={5}>Lần đăng nhập cuối</Title>
      {record?.lastLoginAt ? (
        <DateField value={record?.lastLoginAt} format="YYYY-MM-DD HH:mm" />
      ) : (
        <TextField value="-" />
      )}
    </Show>
  );
};
