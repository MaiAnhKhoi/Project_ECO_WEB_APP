import { Show } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import type { HttpError } from "@refinedev/core";
import { Descriptions } from "antd";
import type { Banner } from "../../type/banner";

export const BannerShow = () => {
  // ⬇️ dùng query thay cho queryResult
  const { query } = useShow<Banner, HttpError>({
    resource: "banners",
  });

  const { data, isLoading } = query;
  const record = data?.data;

  return (
    <Show title={`Banner #${record?.id ?? ""}`} isLoading={isLoading}>
      <Descriptions bordered column={1}>
        <Descriptions.Item label="ID">{record?.id}</Descriptions.Item>
        <Descriptions.Item label="Title">{record?.title}</Descriptions.Item>
        <Descriptions.Item label="Image URL">
          {record?.imageUrl}
        </Descriptions.Item>
        <Descriptions.Item label="Link URL">
          {record?.linkUrl}
        </Descriptions.Item>
        <Descriptions.Item label="Position">
          {record?.position}
        </Descriptions.Item>
        <Descriptions.Item label="Active">
          {record?.active ? "Yes" : "No"}
        </Descriptions.Item>
        <Descriptions.Item label="Created At">
          {record?.createdAt}
        </Descriptions.Item>
      </Descriptions>
    </Show>
  );
};
