import { Show } from "@refinedev/antd";
import { useShow, type HttpError } from "@refinedev/core";
import { Descriptions, Image, Tag, Table } from "antd";
import type {
  ProductAdminDetailDto,
  ProductVariantAdminDto,
  ImageDto,
} from "../../type/product";

export const ProductShow = () => {
  // ✅ Dùng query (không phải queryResult, không destructure data/isLoading trực tiếp)
  const { query } = useShow<ProductAdminDetailDto, HttpError>({
    resource: "products",
  });

  const { data, isLoading } = query;
  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      {record && (
        <>
          <Descriptions
            title="Thông tin sản phẩm"
            bordered
            column={1}
            size="small"
          >
            <Descriptions.Item label="ID">{record.id}</Descriptions.Item>
            <Descriptions.Item label="Tên">{record.name}</Descriptions.Item>
            <Descriptions.Item label="Slug">{record.slug}</Descriptions.Item>

            <Descriptions.Item label="Thương hiệu">
              {record.brandName ? (
                <Tag>{record.brandName}</Tag>
              ) : (
                <Tag color="default">No brand</Tag>
              )}
            </Descriptions.Item>

            <Descriptions.Item label="Giá gốc">
              {record.basePrice.toLocaleString("vi-VN")} đ
            </Descriptions.Item>

            <Descriptions.Item label="Trạng thái">
              <Tag>{record.status}</Tag>
            </Descriptions.Item>

            <Descriptions.Item label="Nổi bật">
              {record.featured ? <Tag color="gold">Featured</Tag> : "No"}
            </Descriptions.Item>

            <Descriptions.Item label="Danh mục">
              {record.categoryNames?.length
                ? record.categoryNames.join(", ")
                : "—"}
            </Descriptions.Item>

            <Descriptions.Item label="Mô tả">
              {record.description || "—"}
            </Descriptions.Item>
          </Descriptions>

          <h3 style={{ marginTop: 24 }}>Ảnh sản phẩm</h3>
          {record.images?.length ? (
            record.images.map((img: ImageDto) => (
              <Image
                key={img.id}
                src={img.url}
                width={80}
                height={80}
                style={{
                  objectFit: "cover",
                  marginRight: 8,
                  borderRadius: 8,
                }}
              />
            ))
          ) : (
            <Tag color="default">No images</Tag>
          )}

          <h3 style={{ marginTop: 24 }}>Biến thể</h3>
          <Table<ProductVariantAdminDto>
            dataSource={record.variants}
            rowKey="id"
            size="small"
          >
            <Table.Column dataIndex="id" title="ID" />
            <Table.Column dataIndex="sku" title="SKU" />
            <Table.Column
              dataIndex="price"
              title="Giá"
              render={(value: number) =>
                value != null ? value.toLocaleString("vi-VN") + " đ" : "-"
              }
            />
            <Table.Column dataIndex="stockQuantity" title="Tồn kho" />
            <Table.Column
              dataIndex="status"
              title="Trạng thái"
              render={(value: string) => <Tag>{value}</Tag>}
            />
          </Table>
        </>
      )}
    </Show>
  );
};
