// src/pages/categories/create.tsx
import { Create, useForm } from "@refinedev/antd";
import { Form, Input, InputNumber, Upload, type FormProps } from "antd";
import type { UploadFile } from "antd/es/upload/interface";

type CategoryFormValues = {
  name: string;
  slug?: string;
  parentId?: number; // ⚠️ để undefined = root
  sortOrder?: number;
  description?: string;
  image?: UploadFile[];
};

export const CategoryCreate = () => {
  const { formProps, saveButtonProps } =
    useForm<any, any, CategoryFormValues>();

  // 🔥 Tạo thumbUrl để Upload hiển thị preview ảnh
  const normFile = (e: any) => {
    const origin = Array.isArray(e) ? e : e?.fileList || [];

    return origin.map((file: UploadFile & { originFileObj?: File }) => {
      if (file.originFileObj && !file.thumbUrl) {
        // tạo URL tạm để preview
        (file as any).thumbUrl = URL.createObjectURL(file.originFileObj);
      }
      return file;
    });
  };

  const handleFinish: FormProps<CategoryFormValues>["onFinish"] = async (
    values,
  ) => {
    const formData = new FormData();

    const payload: any = {
      name: values.name,
      slug: values.slug,
      parentId: values.parentId !== undefined ? values.parentId : null,
      description: values.description,
      sortOrder: values.sortOrder ?? 1,
    };

    formData.append(
      "data",
      new Blob([JSON.stringify(payload)], {
        type: "application/json",
      }),
    );

    const file = values.image?.[0]?.originFileObj as File | undefined;
    if (file) {
      formData.append("image", file);
    }

    // @ts-expect-error: override TVariables bằng FormData
    return formProps.onFinish?.(formData);
  };

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form<CategoryFormValues>
        {...formProps}
        layout="vertical"
        onFinish={handleFinish}
      >
        <Form.Item
          label="Tên danh mục"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên danh mục" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Slug" name="slug">
          <Input placeholder="Nếu bỏ trống sẽ tự sinh từ tên" />
        </Form.Item>

        <Form.Item
          label="Parent ID"
          name="parentId"
          tooltip="Để trống nếu đây là danh mục gốc (root)"
        >
          <InputNumber
            style={{ width: "100%" }}
            placeholder="Để trống = Root"
          />
        </Form.Item>

        <Form.Item label="Thứ tự" name="sortOrder" initialValue={1}>
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Mô tả" name="description">
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          label="Ảnh"
          name="image"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload
            listType="picture-card"
            beforeUpload={() => false}
            accept="image/*"
          >
            + Upload
          </Upload>
        </Form.Item>
      </Form>
    </Create>
  );
};
