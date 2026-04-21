// src/pages/categories/list.tsx
import {
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import type { BaseRecord } from "@refinedev/core";
import { Space, Table, Tag, Image } from "antd";

export const CategoryList = () => {
  const { tableProps } = useTable({
    syncWithLocation: true,
  });

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="id" title="ID" />

        {/* 🔥 Cột ảnh */}
        <Table.Column
          dataIndex="imageUrl"
          title="Ảnh"
          render={(value: string | undefined) =>
            value ? (
              <Image
                src={value}
                width={60}
                height={60}
                style={{ objectFit: "cover", borderRadius: 8 }}
              />
            ) : (
              <Tag color="default">No image</Tag>
            )
          }
        />

        <Table.Column dataIndex="name" title="Tên danh mục" />
        <Table.Column dataIndex="slug" title="Slug" />

        <Table.Column
          dataIndex="parentId"
          title="Parent ID"
          render={(value: number | null) =>
            value ? <Tag>{value}</Tag> : <Tag color="default">Root</Tag>
          }
        />

        <Table.Column dataIndex="sortOrder" title="Thứ tự" />

        <Table.Column
          title="Actions"
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <ShowButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
