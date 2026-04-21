import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Switch, Upload, Button, Image, Space } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import type { Banner } from "../../type/banner";

export const BannerEdit = () => {
  const { formProps, saveButtonProps } = useForm<Banner>({
    resource: "banners",
  });

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // record hiện tại từ API
  const record = formProps.initialValues as Banner | undefined;

  // cleanup object URL khi file thay đổi / unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFinish = (values: any) => {
    const formData = new FormData();

    const payload = {
      title: values.title,
      linkUrl: values.linkUrl,
      position: values.position,
      active: values.active,
      // nếu không chọn ảnh mới → giữ image cũ
      imageUrl: record?.imageUrl ?? null,
    };

    formData.append(
      "data",
      new Blob([JSON.stringify(payload)], {
        type: "application/json",
      }),
    );

    if (file) {
      formData.append("image", file);
    }

    // refine sẽ gọi dataProvider.update với formData này
    return formProps.onFinish?.(formData as any);
  };

  return (
    <Edit saveButtonProps={saveButtonProps} title="Edit Banner">
      <Form {...formProps} layout="vertical" onFinish={handleFinish}>
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

        {/* Ảnh hiện tại / preview ảnh mới */}
        <Form.Item label="Preview Image">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="preview"
              width={160}
              height={80}
              style={{ objectFit: "cover", borderRadius: 8 }}
            />
          ) : record?.imageUrl ? (
            <Image
              src={record.imageUrl}
              alt="banner"
              width={160}
              height={80}
              style={{ objectFit: "cover", borderRadius: 8 }}
            />
          ) : (
            <span>No image</span>
          )}
        </Form.Item>

        {/* Chọn ảnh mới (tùy chọn) */}
        <Form.Item label="Change Image (optional)">
          <Space direction="vertical">
            <Upload
              beforeUpload={(file) => {
                // set file để gửi lên server
                setFile(file as File);

                // tạo URL preview local
                const url = URL.createObjectURL(file);
                setPreviewUrl((old) => {
                  if (old) URL.revokeObjectURL(old);
                  return url;
                });

                return false; // không upload tự động
              }}
              maxCount={1}
              showUploadList={{ showRemoveIcon: true }}
              onRemove={() => {
                setFile(null);
                setPreviewUrl((old) => {
                  if (old) URL.revokeObjectURL(old);
                  return null;
                });
              }}
            >
              <Button icon={<UploadOutlined />}>
                Select new image
              </Button>
            </Upload>
          </Space>
        </Form.Item>
      </Form>
    </Edit>
  );
};
