import { Edit, useForm, useSelect } from "@refinedev/antd";
import MDEditor from "@uiw/react-md-editor";
import { Form, Input, Select, Upload, Button, Image, Space, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigation } from "@refinedev/core";
import { useState, useEffect } from "react";

export const BlogPostEdit = () => {
  const { formProps, saveButtonProps, query, formLoading } = useForm({
    resource: "blog_posts",
    redirect: false,
  });

  const { list } = useNavigation();

  const blogPostData = query?.data?.data;

  const { selectProps: categorySelectProps } = useSelect({
    resource: "blog-categories",
    optionLabel: "name",
    optionValue: "id",
    defaultValue: blogPostData?.category?.id,
    queryOptions: {
      enabled: !!blogPostData,
    },
  });

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(
    blogPostData?.featuredImage || null
  );

  // Update preview when blogPostData loads
  useEffect(() => {
    if (blogPostData?.featuredImage && !file) {
      setPreview(blogPostData.featuredImage);
    }
  }, [blogPostData?.featuredImage, file]);

  const handleFinish = async (values: any) => {
    // Generate slug from title if not provided
    if (!values.slug && values.title) {
      values.slug = values.title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    const formData = new FormData();

    const payload = {
      title: values.title,
      slug: values.slug,
      content: values.content || "",
      excerpt: values.excerpt || "",
      featuredImage: values.featuredImage || blogPostData?.featuredImage || null,
      categoryId: values.categoryId || null,
      tags: values.tags || "",
      status: values.status || "draft",
    };

    // Append JSON data
    formData.append(
      "data",
      new Blob([JSON.stringify(payload)], { type: "application/json" })
    );

    // Append image file if provided
    if (file) {
      formData.append("image", file);
    }

    await formProps.onFinish?.(formData as any);
    message.success("Blog post updated successfully");
    list("blog_posts");
  };

  return (
    <Edit saveButtonProps={saveButtonProps} isLoading={formLoading}>
      <Form
        {...formProps}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          ...blogPostData,
          categoryId: blogPostData?.category?.id,
        }}
      >
        <Form.Item
          label={"Title"}
          name="title"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={"Slug"}
          name="slug"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={"Content"}
          name="content"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <MDEditor data-color-mode="light" />
        </Form.Item>

        <Form.Item label={"Excerpt"} name="excerpt">
          <Input.TextArea rows={3} placeholder="Short description" />
        </Form.Item>

        {/* Upload Featured Image */}
        <Form.Item label={"Featured Image"}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Upload
              beforeUpload={(f) => {
                setFile(f);
                setPreview(URL.createObjectURL(f));
                return false; // Prevent auto upload
              }}
              maxCount={1}
              showUploadList={{ showRemoveIcon: true }}
              onRemove={() => {
                setFile(null);
                if (blogPostData?.featuredImage) {
                  setPreview(blogPostData.featuredImage);
                } else {
                  setPreview(null);
                }
              }}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>Select new image</Button>
            </Upload>

            {preview && (
              <Image
                src={preview}
                width={300}
                style={{ objectFit: "cover", borderRadius: 8 }}
                alt="Preview"
              />
            )}

            <Form.Item name="featuredImage" noStyle>
              <Input
                placeholder="Or enter image URL manually"
                style={{ marginTop: 8 }}
              />
            </Form.Item>
          </Space>
        </Form.Item>

        <Form.Item label={"Category"} name="categoryId">
          <Select
            {...categorySelectProps}
            placeholder="Select category"
            allowClear
          />
        </Form.Item>

        <Form.Item label={"Tags"} name="tags">
          <Input placeholder="tag1, tag2, tag3" />
        </Form.Item>

        <Form.Item
          label={"Status"}
          name="status"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            options={[
              { value: "draft", label: "Draft" },
              { value: "published", label: "Published" },
              { value: "archived", label: "Archived" },
            ]}
            style={{ width: 120 }}
          />
        </Form.Item>
      </Form>
    </Edit>
  );
};
