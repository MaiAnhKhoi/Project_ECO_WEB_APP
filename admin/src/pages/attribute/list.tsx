// src/pages/attribute/list.tsx
import React, { useEffect, useMemo, useState } from "react";
import { List } from "@refinedev/antd";
import { useNavigation } from "@refinedev/core";
import {
  Button,
  Space,
  Table,
  Tag,
  message,
  Popconfirm,
  Tooltip,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";

import type { AttributeDto } from "../../type/attribute";
import attributeApi from "../../service/attributeApi";

export const AttributeList: React.FC = () => {
  const [data, setData] = useState<AttributeDto[]>([]);
  const [loading, setLoading] = useState(false);
  const { create, edit, show } = useNavigation();

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await attributeApi.getAll();
      const payload = res.data?.data ?? [];
      setData(Array.isArray(payload) ? payload : []);
    } catch (e) {
      console.error(e);
      message.error("Không tải được danh sách thuộc tính");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteAttribute = async (id: number) => {
    try {
      await attributeApi.deleteAttribute(id);
      message.success("Đã xoá thuộc tính");
      fetchData();
    } catch (e) {
      console.error(e);
      message.error("Xoá thuộc tính thất bại");
    }
  };

  const columns: ColumnsType<AttributeDto> = useMemo(
    () => [
      {
        title: "Tên",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Code",
        dataIndex: "code",
        key: "code",
        render: (value: string) => <Tag color="blue">{value}</Tag>,
      },
      {
        title: "Type",
        dataIndex: "type",
        key: "type",
        render: (value: string | null) =>
          value ? <Tag color="geekblue">{value}</Tag> : <Tag>default</Tag>,
      },
      {
        title: "Thứ tự",
        dataIndex: "sortOrder",
        key: "sortOrder",
        align: "center",
        width: 110,
        render: (value: number | null) => value ?? "-",
      },
      {
        title: "Số value",
        key: "valuesCount",
        align: "center",
        width: 120,
        render: (_, record) => record.values?.length ?? 0,
      },
      {
        title: "Actions",
        key: "actions",
        width: 220,
        render: (_, record) => (
          <Space>
            <Button size="small" onClick={() => show("attributes", record.id)}>
              Xem
            </Button>
            <Button size="small" onClick={() => edit("attributes", record.id)}>
              Sửa
            </Button>

            <Popconfirm
              title="Xoá thuộc tính?"
              description="Nếu xoá thuộc tính, toàn bộ value liên quan cũng sẽ bị xoá. Bạn chắc chứ?"
              okText="Xoá"
              cancelText="Huỷ"
              okType="danger"
              onConfirm={() => handleDeleteAttribute(record.id)}
            >
              <Button size="small" danger>
                Xoá
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [edit, show],
  );

  return (
    <List
      title="Quản lý thuộc tính sản phẩm"
      headerButtons={() => (
        <Space>
          <Tooltip title="Tải lại dữ liệu">
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchData}
              loading={loading}
            />
          </Tooltip>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => create("attributes")}
          >
            Thêm thuộc tính
          </Button>
        </Space>
      )}
    >
      <Table<AttributeDto>
        rowKey="id"
        dataSource={data}
        columns={columns}
        loading={loading}
        pagination={false}
      />
    </List>
  );
};
