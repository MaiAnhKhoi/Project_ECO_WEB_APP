// src/pages/products/create.tsx
import { Create, useForm } from "@refinedev/antd";
import { useNavigation } from "@refinedev/core";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Upload,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import type { UploadFile } from "antd/es/upload/interface";
import type { ProductAdminDetailDto } from "../../type/product";

export const ProductCreate = () => {
  const { formProps, saveButtonProps } = useForm<
    ProductAdminDetailDto,
    any,
    ProductAdminDetailDto
  >({
    resource: "products",
    redirect: false,
  });

  const { list } = useNavigation();

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [rawFiles, setRawFiles] = useState<File[]>([]);

  const onCancel = () => list("products");

  const handleFinish = async (values: any) => {
    const payload = {
      name: values.name,
      slug: values.slug,
      description: values.description,
      basePrice: values.basePrice,
      status: values.status ?? "active",
      featured: values.featured ?? false,
      material: values.material ?? null,
      tags: values.tags ?? null,
      metaTitle: values.metaTitle ?? null,
      metaDescription: values.metaDescription ?? null,
      metaKeywords: values.metaKeywords ?? null,
      careInstructions: values.careInstructions ?? null,
      countryOfOrigin: values.countryOfOrigin ?? null,
      brandId: values.brandId ?? null,
      categoryIds: values.categoryIds ?? [],
    };

    const formData = new FormData();
    formData.append(
      "data",
      new Blob([JSON.stringify(payload)], { type: "application/json" })
    );
    rawFiles.forEach((file) => formData.append("images", file));

    const res = await formProps.onFinish?.(formData as any);

    const created = (res as any)?.data?.data;
    if (created?.id) {
      message.success("Tạo sản phẩm thành công!");
      list(`products/edit/${created.id}`);
    }
  };

  return (
    <Create
      saveButtonProps={saveButtonProps}
      headerButtons={({ defaultButtons }) => (
        <>
          {defaultButtons}
          <Button style={{ marginLeft: 8 }} onClick={onCancel}>
            Cancel
          </Button>
        </>
      )}
    >
      <Form {...formProps} layout="vertical" onFinish={handleFinish}>
        {/* Brand */}
        <Form.Item label="Thương hiệu" name="brandId">
          <Select placeholder="Chọn thương hiệu" allowClear />
        </Form.Item>

        <Form.Item
          label="Tên sản phẩm"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
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

        <Form.Item label="Mô tả" name="description">
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item label="Giá gốc" name="basePrice" rules={[{ required: true }]}>
          <InputNumber style={{ width: "100%" }} min={0} />
        </Form.Item>

        <Form.Item label="Trạng thái" name="status" initialValue="active">
          <Select
            options={[
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
              { label: "Deleted", value: "deleted" },
            ]}
          />
        </Form.Item>

        <Form.Item label="Nổi bật" name="featured" valuePropName="checked">
          <Switch />
        </Form.Item>

        {/* MATERIAL */}
        <Form.Item label="Chất liệu" name="material">
          <Input />
        </Form.Item>

        {/* TAGS */}
        <Form.Item label="Tags" name="tags">
          <Input placeholder="vd: trending,new-arrival,bestseller" />
        </Form.Item>

        {/* CARE INSTRUCTIONS */}
        <Form.Item label="Hướng dẫn bảo quản" name="careInstructions">
          <Input.TextArea rows={3} />
        </Form.Item>

        {/* ORIGIN */}
        <Form.Item label="Xuất xứ" name="countryOfOrigin">
          <Select
            options={[
              { label: "Vietnam", value: "Vietnam" },
              { label: "China", value: "China" },
              { label: "Thailand", value: "Thailand" },
            ]}
            allowClear
          />
        </Form.Item>

        {/* SEO */}
        <Form.Item label="Meta title" name="metaTitle">
          <Input />
        </Form.Item>

        <Form.Item label="Meta description" name="metaDescription">
          <Input.TextArea rows={2} />
        </Form.Item>

        <Form.Item label="Meta keywords" name="metaKeywords">
          <Input />
        </Form.Item>

        {/* Ảnh sản phẩm */}
        <Form.Item label="Ảnh sản phẩm">
          <Upload
            multiple
            fileList={fileList}
            beforeUpload={(file) => {
              setFileList((prev) => [...prev, file]);
              setRawFiles((prev) => [...prev, file as File]);
              return false;
            }}
            onRemove={(file) => {
              setFileList((prev) => prev.filter((f) => f.uid !== file.uid));

              // file.originFileObj là File thật
              const realFile = file.originFileObj as File;

              setRawFiles((prev) => prev.filter((f) => f !== realFile));
            }}
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Create>
  );
};
