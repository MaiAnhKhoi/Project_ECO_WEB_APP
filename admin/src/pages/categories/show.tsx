// src/pages/categories/show.tsx
import { Show, TextField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography, Image } from "antd";

const { Title } = Typography;

export const CategoryShow = () => {
  const { query } = useShow();           // ✅ dùng query
  const { data, isLoading } = query;
  const record: any = data?.data;        // refine: data.data là record

  return (
    <Show isLoading={isLoading}>
      <Title level={5}>ID</Title>
      <TextField value={record?.id} />

      <Title level={5}>Tên danh mục</Title>
      <TextField value={record?.name} />

      <Title level={5}>Slug</Title>
      <TextField value={record?.slug} />

      <Title level={5}>Parent ID</Title>
      <TextField value={record?.parentId ?? "Root"} />

      <Title level={5}>Thứ tự</Title>
      <TextField value={record?.sortOrder} />

      <Title level={5}>Mô tả</Title>
      <TextField value={record?.description} />

      <Title level={5}>Ảnh</Title>
      {record?.imageUrl ? (
        <Image src={record.imageUrl} width={200} />
      ) : (
        <TextField value="(Không có ảnh)" />
      )}
    </Show>
  );
};
