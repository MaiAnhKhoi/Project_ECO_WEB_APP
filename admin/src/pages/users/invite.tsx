// src/pages/users/invite.tsx
import { Create, useForm } from "@refinedev/antd";
import type { HttpError } from "@refinedev/core";
import { Form, Input, Select, Typography } from "antd";
import type { Role } from "../../type/user";
import { useEffect, useMemo, useState } from "react";
import { userProvider } from "../../provider/userProvider";
import { STAFF_ROLE_CODES, type StaffRoleCode } from "../../constant/staffRoles";

const { Title } = Typography;
const { TextArea } = Input;

export const UserInvite = () => {
  const { formProps, saveButtonProps } = useForm<any, HttpError>({
    resource: "roles/invite",
    redirect: "list",
    successNotification: () => ({
      message: "Lời mời đã được gửi thành công!",
      description: "Nhân viên sẽ nhận email để thiết lập tài khoản.",
      type: "success",
    }),
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
    <Create title="Mời nhân viên" saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Title level={5}>Thông tin lời mời</Title>

        <Form.Item
          label="Email nhân viên"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email" },
            { type: "email", message: "Email không hợp lệ" },
          ]}
        >
          <Input placeholder="staff@example.com" />
        </Form.Item>

        <Form.Item
          label="Vai trò"
          name="roleIds"
          rules={[
            { required: true, message: "Vui lòng chọn ít nhất một vai trò" },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Chọn vai trò cho nhân viên"
            options={staffRoleOptions}
          />
        </Form.Item>

        <Form.Item
          label="Lời nhắn (tùy chọn)"
          name="message"
          tooltip="Lời nhắn này sẽ được gửi kèm trong email mời"
        >
          <TextArea 
            rows={4} 
            placeholder="Chào mừng bạn đến với đội ngũ của chúng tôi! Chúng tôi rất vui mừng được làm việc cùng bạn."
            maxLength={500}
            showCount
          />
        </Form.Item>

        <div style={{ 
          background: '#e3f2fd', 
          padding: '12px', 
          borderRadius: '4px',
          marginTop: '16px'
        }}>
          <p style={{ margin: 0, fontSize: '13px' }}>
            ℹ️ <strong>Lưu ý:</strong> Sau khi gửi lời mời, nhân viên sẽ nhận email với link để thiết lập tài khoản. 
            Lời mời có hiệu lực trong 24 giờ.
          </p>
        </div>
      </Form>
    </Create>
  );
};

