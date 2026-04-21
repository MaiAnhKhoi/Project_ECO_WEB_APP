// src/pages/attribute/show.tsx
import React, { useEffect, useState } from "react";
import { Show } from "@refinedev/antd";
import { Descriptions, Space, Table, Tag, message } from "antd";
import { useParams } from "react-router-dom";

import type { AttributeDto, AttributeValueDto } from "../../type/attribute";
import attributeApi from "../../service/attributeApi";

export const AttributeShow: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const attrId = Number(id);

  const [data, setData] = useState<AttributeDto | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    if (!attrId) return;
    try {
      setLoading(true);
      const res = await attributeApi.getById(attrId);
      setData(res.data.data);
    } catch (e) {
      console.error(e);
      message.error("Không tải được thuộc tính");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [attrId]);

  return (
    <Show
      title="Chi tiết thuộc tính"
      isLoading={loading}
      // ❌ bỏ goBack, vì bạn không dùng useNavigation nữa, và goBack không nhận function
    >
      {data && (
        <>
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="ID">{data.id}</Descriptions.Item>
            <Descriptions.Item label="Tên">{data.name}</Descriptions.Item>
            <Descriptions.Item label="Code">
              <Tag color="blue">{data.code}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Type">
              {data.type ? (
                <Tag color="geekblue">{data.type}</Tag>
              ) : (
                <Tag>default</Tag>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Thứ tự">
              {data.sortOrder ?? "-"}
            </Descriptions.Item>
          </Descriptions>

          <h3 style={{ marginTop: 16 }}>Giá trị</h3>
          <Table<AttributeValueDto>
            rowKey="id"
            dataSource={data.values || []}
            pagination={false}
            size="small"
            columns={[
              {
                title: "ID",
                dataIndex: "id",
              },
              {
                title: "Giá trị",
                dataIndex: "value",
              },
              {
                title: "Code",
                dataIndex: "code",
                render: (value: string | null) =>
                  value ? <Tag>{value}</Tag> : "-",
              },
              {
                title: "Thứ tự",
                dataIndex: "sortOrder",
                render: (value: number | null) => value ?? "-",
              },
              {
                title: "Mã màu",
                dataIndex: "colorHex",
                render: (value: string | null) =>
                  value ? (
                    <Space>
                      <span
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: "50%",
                          border: "1px solid #ddd",
                          backgroundColor: value,
                          display: "inline-block",
                        }}
                      />
                      <span>{value}</span>
                    </Space>
                  ) : (
                    "-"
                  ),
              },
            ]}
          />
        </>
      )}
    </Show>
  );
};
