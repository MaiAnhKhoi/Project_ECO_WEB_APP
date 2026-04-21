// src/pages/users/assign-roles.tsx
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Typography, Space, Tag, Select, Button, Spin, Divider, message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

import { userProvider } from "../../provider/userProvider";
import type { User, Role } from "../../type/user";
import { STAFF_ROLE_CODES, type StaffRoleCode } from "../../constant/staffRoles";

const { Title, Text } = Typography;

export const UserAssignRoles = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [allRoles, setAllRoles] = useState<Role[]>([]);
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ===========================
  // ALL HOOKS PHẢI LUÔN Ở TRÊN
  // ===========================

  const staffRoleSet = useMemo(
    () => new Set<StaffRoleCode>(STAFF_ROLE_CODES),
    []
  );

  const adminRoleId = useMemo(
    () => allRoles.find((role) => role.code === "ADMIN")?.id,
    [allRoles]
  );

  const staffRoleOptions = useMemo(
    () =>
      allRoles
        .filter(
          (role) =>
            staffRoleSet.has(role.code as StaffRoleCode) &&
            role.code !== "USER" &&
            role.code !== "CUSTOMER"
        )
        .map((role) => ({
          label: `${role.name} (${role.code})`,
          value: role.id
        })),
    [allRoles, staffRoleSet]
  );

  // ===========================
  // FETCH DATA
  // ===========================
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setLoading(true);

        const userRes = await userProvider.getOne({ id: Number(id) });
        const u = userRes.data as User;
        setUser(u);
        setSelectedRoleIds(u.roles?.map((r) => r.id) ?? []);

        const roles = await userProvider.getRoles();
        setAllRoles(roles);
      } catch (e) {
        console.error("Failed to load user or roles", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // ===========================
  // RETURN CONDITION
  // ===========================

  if (loading) {
    return (
      <Card>
        <Spin />
      </Card>
    );
  }

  if (!user) {
    return (
      <Card>
        <Text>Không tìm thấy người dùng.</Text>
      </Card>
    );
  }

  // ===========================
  // HANDLERS
  // ===========================
  const handleRoleSelection = (values: number[]) => {
    if (
      adminRoleId &&
      user?.roles?.some((role) => role.id === adminRoleId) &&
      !values.includes(adminRoleId)
    ) {
      message.warning("Không thể bỏ vai trò ADMIN");
      return;
    }
    setSelectedRoleIds(values);
  };
const handleSave = async () => {
    if (!id) return;
    try {
      setSaving(true);
      await userProvider.assignRoles(Number(id), selectedRoleIds);
      navigate("/users");
    } catch (e) {
      console.error("Failed to assign roles", e);
    } finally {
      setSaving(false);
    }
  };

  // ===========================
  // MAIN RENDER
  // ===========================
  return (
    <Card
      title={
        <Space>
          <Button
            icon={<ArrowLeftOutlined />}
            type="link"
            onClick={() => navigate(-1)}
          />
          <span>Gán vai trò cho: {user.name}</span>
        </Space>
      }
    >
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        <div>
          <Title level={5}>Thông tin tài khoản</Title>
          <Text><b>ID:</b> {user.id}</Text><br />
          <Text><b>Email:</b> {user.email}</Text><br />
          <Text><b>Số điện thoại:</b> {user.phone || "-"}</Text>
        </div>

        <Divider />

        <div>
          <Title level={5}>Vai trò hiện tại</Title>
          {!user.roles?.length ? (
            <Text>-</Text>
          ) : (
            <Space size={[4, 4]} wrap>
              {user.roles.map((role) => (
                <Tag color="geekblue" key={role.id}>
                  {role.name || role.code}
                </Tag>
              ))}
            </Space>
          )}
        </div>

        <div>
          <Title level={5}>Chọn vai trò</Title>
          <Select
            mode="multiple"
            style={{ width: "100%" }}
            placeholder="Chọn vai trò"
            value={selectedRoleIds}
            onChange={handleRoleSelection}
            options={staffRoleOptions}
          />
        </div>

        <div>
          <Button type="primary" loading={saving} onClick={handleSave}>
            Lưu vai trò
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={() => navigate(-1)}>
            Hủy
          </Button>
        </div>
      </Space>
    </Card>
  );
};