// src/pages/users/create.tsx
import { Create, useForm } from "@refinedev/antd";
import type { HttpError } from "@refinedev/core";
import { Form, Input, Select, Switch, Typography } from "antd";
import type { User, Role } from "../../type/user";
import { useEffect, useMemo, useState } from "react";
import { userProvider } from "../../provider/userProvider";
import { STAFF_ROLE_CODES, type StaffRoleCode } from "../../constant/staffRoles";

const { Title } = Typography;

export const UserCreate = () => {
  const { formProps, saveButtonProps } = useForm<User, HttpError>({
    resource: "users",
  });

  const [allRoles, setAllRoles] = useState<Role[]>([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const roles = await userProvider.getRoles();
        setAllRoles(roles);
      } catch (e) {
        console.error("Failed to load roles", e);
      }
    };
    fetchRoles();
  }, []);

  const staffRoleSet = useMemo(
    () => new Set<StaffRoleCode>(STAFF_ROLE_CODES),
    [],
  );

  const staffRoleOptions = useMemo(
    () =>
      allRoles
        .filter(
          (role) =>
            staffRoleSet.has(role.code as StaffRoleCode) &&
            role.code !== "USER" &&
            role.code !== "CUSTOMER",
        )
        .map((role) => ({
          label: `${role.name} (${role.code})`,
          value: role.id,
        })),
    [allRoles, staffRoleSet],
  );

  return (
    <Create title="Tạo người dùng" saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Title level={5}>Thông tin tài khoản</Title>

        <Form.Item
          label="Tên"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email" },
            { type: "email", message: "Email không hợp lệ" },
          ]}
        >
          <Input />
        </Form.Item>

        {/* Nếu backend yêu cầu password khi tạo staff */}
        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item label="Số điện thoại" name="phone">
          <Input />
        </Form.Item>

        <Form.Item label="Trạng thái" name="status" initialValue="ACTIVE">
          <Select
            options={[
              { label: "Active", value: "ACTIVE" },
              { label: "Inactive", value: "INACTIVE" },
              { label: "Suspended", value: "SUSPENDED" },
            ]}
          />
        </Form.Item>

        <Form.Item
          label="Bật 2FA"
          name="twoFactorEnabled"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="Vai trò nhân viên"
          name="roleIds"
          rules={[
            { required: true, message: "Vui lòng chọn ít nhất một vai trò" },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Chọn quyền cho nhân viên"
            options={staffRoleOptions}
          />
        </Form.Item>
      </Form>
    </Create>
  );
};
