// src/pages/users/UserEdit.tsx
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { Edit, useForm } from "@refinedev/antd";
import type { HttpError } from "@refinedev/core";

import {
    Form,
    Input,
    Select,
    Switch,
    Typography,
    Divider,
    Space,
    Button,
    Spin,
    Tag,
    message,
} from "antd";

import { userProvider } from "../../provider/userProvider";
import type { User, Role } from "../../type/user";
import { STAFF_ROLE_CODES, type StaffRoleCode } from "../../constant/staffRoles";

const { Title, Text } = Typography;
const STAFF_ROLE_SET = new Set<StaffRoleCode>(STAFF_ROLE_CODES);

export const UserEdit = () => {
    const { id } = useParams<{ id: string }>();

    const { formProps, saveButtonProps } = useForm<User, HttpError>({
        resource: "users",
        id,
    });

    const [allRoles, setAllRoles] = useState<Role[]>([]);
    const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);
    const [loadingRoles, setLoadingRoles] = useState(false);
    const [savingRoles, setSavingRoles] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    // Load user để hiển thị "thông tin hệ thống" & list roles hiện tại
    useEffect(() => {
        const fetchUser = async () => {
            if (!id) return;
            try {
                const res = await userProvider.getOne({ id: Number(id) });
                const u = res.data as User;
                setUser(u);
                setSelectedRoleIds(u.roles?.map((r) => r.id) ?? []);
            } catch (error) {
                console.error("Failed to load user", error);
            }
        };

        fetchUser();
    }, [id]);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                setLoadingRoles(true);

                const roles = await userProvider.getRoles(); // Role[]
                setAllRoles(Array.isArray(roles) ? roles : []);
            } catch (error) {
                setAllRoles([]);
            } finally {
                setLoadingRoles(false);
            }
        };

        fetchRoles();
    }, []);

const staffRoleOptions = useMemo(
    () =>
        allRoles
            .filter(
                (role) =>
                    STAFF_ROLE_SET.has(role.code as StaffRoleCode) &&
                    role.code !== "USER" &&
                    role.code !== "CUSTOMER",
            )
            .map((role) => ({
                label: `${role.name} (${role.code})`,
                value: role.id,
            })),
    [allRoles],
);

const adminRoleId = useMemo(
    () => allRoles.find((role) => role.code === "ADMIN")?.id,
    [allRoles],
);

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

const handleSaveRoles = async () => {
    if (!id) return;
    try {
        setSavingRoles(true);
        await userProvider.assignRoles(Number(id), selectedRoleIds);

        const res = await userProvider.getOne({ id: Number(id) });
        setUser(res.data as User);

    } catch (error) {
        console.error("Failed to assign roles", error);
    } finally {
        setSavingRoles(false);
    }
};


    return (
        <Edit title="Chỉnh sửa người dùng" saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout="vertical">
                {/* Thông tin chung */}
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

                <Form.Item label="Số điện thoại" name="phone">
                    <Input />
                </Form.Item>

                <Form.Item label="Trạng thái" name="status">
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

                {/* Thông tin hệ thống */}
                <Divider />
                <Title level={5}>Thông tin hệ thống</Title>
                <Space direction="vertical" size={4}>
                    <Text>
                        <b>Lần đăng nhập cuối:</b>{" "}
                        {user?.lastLoginAt || "-"}
                    </Text>
                    <Text>
                        <b>Ngày tạo:</b> {user?.createdAt ?? "-"}
                    </Text>
                    <Text>
                        <b>Ngày cập nhật:</b> {user?.updatedAt ?? "-"}
                    </Text>
                </Space>

                {/* Vai trò */}
                <Divider />
                <Title level={5}>Vai trò</Title>

                {loadingRoles ? (
                    <Spin />
                ) : (
                    <>
                        <Form.Item label="Danh sách vai trò">
                            <Select
                                mode="multiple"
                                placeholder="Chọn vai trò"
                                value={selectedRoleIds}
                                onChange={handleRoleSelection}
                                style={{ width: "100%" }}
                                options={staffRoleOptions}
                            />
                        </Form.Item>

                        <Form.Item label="Vai trò hiện tại">
                            {!user?.roles?.length ? (
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
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="default"
                                loading={savingRoles}
                                onClick={handleSaveRoles}
                            >
                                Lưu vai trò
                            </Button>
                        </Form.Item>
                    </>
                )}
            </Form>
        </Edit>
    );
};
