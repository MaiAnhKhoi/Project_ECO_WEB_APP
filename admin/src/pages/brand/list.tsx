// src/pages/brands/BrandList.tsx
import {
  List,
  EditButton,
  ShowButton,
  DeleteButton,
} from "@refinedev/antd";
import { useTable } from "@refinedev/antd";
import type { BaseRecord } from "@refinedev/core";
import { Table, Space, Image, Tag } from "antd";

export const BrandList = () => {
  const { tableProps } = useTable({
    syncWithLocation: true,
  });

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="id" title="ID" width={70} />

        <Table.Column dataIndex="name" title="Tên thương hiệu" />

        <Table.Column dataIndex="slug" title="Slug" />

        <Table.Column
          dataIndex="imageUrl"
          title="Logo"
          width={120}
          render={(value: string | null | undefined) =>
            value ? (
              <Image
                src={value}
                alt="brand-logo"
                width={60}
                height={60}
                style={{ objectFit: "contain", borderRadius: 8 }}
                preview={false}
              />
            ) : (
              <Tag>-</Tag>
            )
          }
        />

        <Table.Column
          dataIndex="createdAt"
          title="Ngày tạo"
          render={(value: string | null | undefined) =>
            value ? (
              <span>{new Date(value).toLocaleString("vi-VN")}</span>
            ) : (
              "-"
            )
          }
        />

        {/* Actions */}
        <Table.Column
          title="Actions"
          dataIndex="actions"
          fixed="right"
          width={150}
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
