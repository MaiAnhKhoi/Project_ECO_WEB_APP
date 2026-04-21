// src/pages/products/list.tsx
import {
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import type { BaseRecord } from "@refinedev/core";
import { Image, Space, Table, Tag, Typography } from "antd";
import type { ProductAdminDetailDto, ProductVariantAdminDto } from "../../type/product";

const { Text } = Typography;

export const ProductList = () => {
  const { tableProps } = useTable<ProductAdminDetailDto>({
    syncWithLocation: true,
    resource: "products",
  });

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="id" title="ID" />

        {/* Ảnh sản phẩm: lấy ảnh đầu tiên */}
        <Table.Column
          key="image"
          title="Ảnh"
          render={(_, record: ProductAdminDetailDto) => {
            const firstImage = record.images?.[0];
            return firstImage?.url ? (
              <Image
                src={firstImage.url}
                width={60}
                height={60}
                style={{ objectFit: "cover", borderRadius: 8 }}
              />
            ) : (
              <Tag color="default">No image</Tag>
            );
          }}
        />

        <Table.Column dataIndex="name" title="Tên sản phẩm" />
        <Table.Column dataIndex="slug" title="Slug" />

        <Table.Column
          dataIndex="brandName"
          title="Thương hiệu"
          render={(value: string | undefined) =>
            value ? <Tag>{value}</Tag> : <Tag color="default">No brand</Tag>
          }
        />

        {/* 🔥 Cột BIẾN THỂ */}
        <Table.Column
          key="variants"
          title="Biến thể"
          render={(_, record: ProductAdminDetailDto) => {
            const variants = record.variants ?? [];
            if (!variants.length) {
              return <Tag color="default">No variant</Tag>;
            }

            // Lấy 2 biến thể đầu để preview
            const preview = variants.slice(0, 2)
              .map((v: ProductVariantAdminDto) => {
                const attrs = v.attributes
                  ?.map((a) => a.attributeValue)
                  .filter(Boolean)
                  .join(" / ");
                // ưu tiên hiển thị thuộc tính, fallback về SKU
                return attrs || v.sku;
              })
              .join(" • ");

            return (
              <Space direction="vertical" size={0}>
                <Tag color="blue">{variants.length} variant(s)</Tag>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {preview}
                  {variants.length > 2 && " ..."}
                </Text>
              </Space>
            );
          }}
        />

        <Table.Column
          dataIndex="basePrice"
          title="Giá gốc"
          render={(value: number) =>
            value != null ? value.toLocaleString("vi-VN") + " đ" : "-"
          }
        />

        <Table.Column
          dataIndex="status"
          title="Trạng thái"
          render={(value: string) => {
            let color: "green" | "red" | "orange" | "default" = "default";
            if (value === "active") color = "green";
            else if (value === "inactive") color = "orange";
            else if (value === "deleted") color = "red";
            return <Tag color={color}>{value}</Tag>;
          }}
        />

        <Table.Column
          dataIndex="createdAt"
          title="Ngày tạo"
          render={(value: string | undefined) =>
            value ? new Date(value).toLocaleString("vi-VN") : "-"
          }
        />

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
