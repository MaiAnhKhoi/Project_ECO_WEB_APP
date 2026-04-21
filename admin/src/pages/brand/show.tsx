// src/pages/brands/BrandShow.tsx
import { Show, TextField, DateField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography, Tag, Image, Divider } from "antd";
import type { Brand } from "../../type/brand";

const { Title } = Typography;

export const BrandShow = () => {
  // ✅ API mới: destructuring từ query
  const {
    query: { data, isLoading },
  } = useShow<Brand>();

  // data?.data vì dataProvider.getOne trả { data: Brand }
  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Title level={5}>ID</Title>
      <TextField value={record?.id ?? "-"} />

      <Title level={5}>Tên thương hiệu</Title>
      <TextField value={record?.name ?? "-"} />

      <Title level={5}>Slug</Title>
      {record?.slug ? <Tag>{record.slug}</Tag> : <TextField value="-" />}

      <Divider />

      <Title level={5}>Logo</Title>
      {record?.imageUrl ? (
        <Image
          src={record.imageUrl}
          alt="logo"
          width={120}
          height={120}
          style={{ objectFit: "contain", borderRadius: 8 }}
        />
      ) : (
        <TextField value="Chưa có logo" />
      )}

      <Divider />

      <Title level={5}>Ngày tạo</Title>
      <DateField value={record?.createdAt} />
    </Show>
  );
};
