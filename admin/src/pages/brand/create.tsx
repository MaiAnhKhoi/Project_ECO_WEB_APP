import { Create } from "@refinedev/antd";
import { useForm } from "@refinedev/antd";
import { Form, Input, Upload, Button, Space } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";

export const BrandCreate = () => {
  const { formProps, saveButtonProps } = useForm();
  const [file, setFile] = useState<File | null>(null);

  const handleFinish = (values: any) => {
    const formData = new FormData();

    const payload = {
      name: values.name,
      slug: values.slug,
      imageUrl: null as string | null, // BE sẽ set bằng Cloudinary URL
    };

    formData.append(
      "data",
      new Blob([JSON.stringify(payload)], { type: "application/json" })
    );

    if (file) {
      formData.append("image", file);
    }

    // Gửi FormData vào dataProvider (brandProvider sẽ nhận)
    return formProps.onFinish?.(formData as any);
  };

  return (
    <Create saveButtonProps={saveButtonProps}>
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
          <Input placeholder="VD: Nike" />
        </Form.Item>

        <Form.Item
          label="Slug"
          name="slug"
          rules={[{ required: true, message: "Vui lòng nhập slug" }]}
        >
          <Input placeholder="VD: nike" />
        </Form.Item>

        <Form.Item label="Logo">
          <Space direction="vertical">
            <Upload
              beforeUpload={(file) => {
                setFile(file as File);
                return false; // Không upload tự động
              }}
              maxCount={1}
              showUploadList={{ showRemoveIcon: true }}
              onRemove={() => setFile(null)}
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
          </Space>
        </Form.Item>
      </Form>
    </Create>
  );
};
