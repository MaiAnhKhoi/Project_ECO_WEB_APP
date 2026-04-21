import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Switch, Upload, Button, Image, Space } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
import type { Banner } from "../../type/banner";

export const BannerCreate = () => {
  const { formProps, saveButtonProps } = useForm<Banner>({
    resource: "banners",
  });

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFinish = (values: any) => {
    const formData = new FormData();

    const payload = {
      title: values.title,
      linkUrl: values.linkUrl,
      position: values.position,
      active: values.active,
      imageUrl: null, // backend sẽ gán sau khi upload
    };

    // JSON -> Blob
    formData.append(
      "data",
      new Blob([JSON.stringify(payload)], {
        type: "application/json",
      })
    );

    if (file) {
      formData.append("image", file);
    }

    return formProps.onFinish?.(formData as any);
  };

  return (
    <Create saveButtonProps={saveButtonProps} title="Create Banner">
      <Form {...formProps} layout="vertical" onFinish={handleFinish} initialValues={{ active: true }}>
        
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Title is required" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="linkUrl" label="Link URL">
          <Input />
        </Form.Item>

        <Form.Item name="position" label="Position">
          <Input />
        </Form.Item>

        <Form.Item
          name="active"
          label="Active"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        {/* Upload hình */}
        <Form.Item label="Banner Image">
          <Space direction="vertical">
            <Upload
              beforeUpload={(f) => {
                setFile(f);
                setPreview(URL.createObjectURL(f));
                return false;
              }}
              maxCount={1}
              showUploadList={{ showRemoveIcon: true }}
              onRemove={() => {
                setFile(null);
                setPreview(null);
              }}
            >
              <Button icon={<UploadOutlined />}>Select image</Button>
            </Upload>

            {preview && (
              <Image
                src={preview}
                width={200}
                height={100}
                style={{ objectFit: "cover", borderRadius: 8 }}
              />
            )}
          </Space>
        </Form.Item>
      </Form>
    </Create>
  );
};
