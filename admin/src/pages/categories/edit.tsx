// src/pages/categories/edit.tsx
import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, InputNumber, Upload, type FormProps } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { useEffect } from "react";

type CategoryFormValues = {
  name?: string;
  slug?: string;
  parentId?: number;
  sortOrder?: number;
  description?: string;
  image?: UploadFile[];
  imageUrl?: string; // để đọc từ record
};

export const CategoryEdit = () => {
  // TVariables = CategoryFormValues
  const { formProps, saveButtonProps, query } =
    useForm<any, any, CategoryFormValues>();

  // record hiện tại từ API (/admin/categories/:id)
  const record = query?.data?.data as any;

  // Map imageUrl -> Upload fileList để hiển thị ảnh cũ
  useEffect(() => {
    if (!record?.imageUrl) return;

    formProps.form?.setFieldsValue({
      image: [
        {
          uid: "-1",
          name: "current-image",
          status: "done",
          url: record.imageUrl,
        } as UploadFile,
      ],
    });
  }, [record?.imageUrl, formProps.form]);

  // Tạo thumbUrl để preview ảnh khi chọn mới
  const normFile = (e: any) => {
    const origin = Array.isArray(e) ? e : e?.fileList || [];

    return origin.map((file: UploadFile & { originFileObj?: File }) => {
      if (file.originFileObj && !file.thumbUrl) {
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
      sortOrder: values.sortOrder,
    };

    formData.append(
      "data",
      new Blob([JSON.stringify(payload)], {
        type: "application/json",
      }),
    );

    // Nếu chọn ảnh mới -> gửi file mới
    const file = values.image?.[0]?.originFileObj as File | undefined;
    if (file) {
      formData.append("image", file);
    }
    // Không chọn ảnh mới -> backend giữ imageUrl cũ (vì không có "image" field)

    // @ts-expect-error: override TVariables bằng FormData
    return formProps.onFinish?.(formData);
  };

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form<CategoryFormValues>
        {...formProps}
        layout="vertical"
        onFinish={handleFinish}
      >
        <Form.Item label="Tên danh mục" name="name">
          <Input />
        </Form.Item>

        <Form.Item label="Slug" name="slug">
          <Input />
        </Form.Item>

        <Form.Item label="Parent ID" name="parentId">
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Thứ tự" name="sortOrder">
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Mô tả" name="description">
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          label="Ảnh (chọn mới nếu muốn thay)"
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
    </Edit>
  );
};
