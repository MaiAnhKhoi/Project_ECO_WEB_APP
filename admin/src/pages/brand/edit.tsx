import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Upload, Button, Image, Space } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
import type { Brand } from "../../type/brand";

export const BrandEdit = () => {
  const { formProps, saveButtonProps } = useForm<Brand>();
  const [file, setFile] = useState<File | null>(null);

  // Lấy record hiện tại từ formProps.initialValues
  const record = formProps.initialValues;

  const handleFinish = (values: any) => {
    const formData = new FormData();

    const payload = {
      name: values.name,
      slug: values.slug,
      imageUrl: record?.imageUrl ?? null, // giữ image cũ nếu không upload mới
    };

    formData.append(
      "data",
      new Blob([JSON.stringify(payload)], { type: "application/json" })
    );

    if (file) {
      formData.append("image", file);
    }

    return formProps.onFinish?.(formData as any);
  };

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form
        {...formProps}
        layout="vertical"
        onFinish={handleFinish}
      >
        <Form.Item
          label="Tên thương hiệu"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên thương hiệu" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Slug"
          name="slug"
          rules={[{ required: true, message: "Vui lòng nhập slug" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Logo hiện tại">
          {record?.imageUrl ? (
            <Image
              src={record.imageUrl}
              alt="logo"
              width={100}
              height={100}
              style={{ objectFit: "contain", borderRadius: 8 }}
            />
          ) : (
            <span>Chưa có logo</span>
          )}
        </Form.Item>

        <Form.Item label="Đổi logo (tùy chọn)">
          <Space direction="vertical">
            <Upload
              beforeUpload={(file) => {
                setFile(file as File);
                return false;
              }}
              maxCount={1}
              showUploadList={{ showRemoveIcon: true }}
              onRemove={() => setFile(null)}
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh mới</Button>
            </Upload>
          </Space>
        </Form.Item>
      </Form>
    </Edit>
  );
};
