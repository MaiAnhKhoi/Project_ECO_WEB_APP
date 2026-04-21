import React, { useMemo, useState } from "react";
import { Create, useForm } from "@refinedev/antd";
import { useNavigation, type HttpError } from "@refinedev/core";
import {
  Form,
  Input,
  InputNumber,
  Select,
  message,
} from "antd";

import type {
  AttributeDto,
  CreateAttributeRequest,
} from "../../type/attribute";

export const AttributeCreate: React.FC = () => {
  const { list } = useNavigation();
  const { formProps, saveButtonProps } = useForm<
    AttributeDto,
    HttpError,
    CreateAttributeRequest
  >({
    resource: "attributes",
    redirect: false,
  });

  const form = formProps.form;
  const [submitting, setSubmitting] = useState(false);

  const initialValues = useMemo<CreateAttributeRequest>(
    () => ({
      name: "",
      code: "",
      sortOrder: 0,
      type: "text",
    }),
    [],
  );

  const handleFinish = async (attributePayload: CreateAttributeRequest) => {
    const payload: CreateAttributeRequest = {
      name: attributePayload.name?.trim() ?? "",
      code: attributePayload.code?.trim() ?? "",
      sortOrder:
        typeof attributePayload.sortOrder === "number"
          ? attributePayload.sortOrder
          : null,
      type: attributePayload.type ?? null,
    };

    try {
      setSubmitting(true);
      const response = await formProps.onFinish?.(payload as any);
      const created =
        (response as any)?.data?.data ??
        (response as any)?.data ??
        response ??
        null;

      message.success("Tạo thuộc tính thành công");
      list("attributes");
    } catch (error) {
      console.error(error);
      message.error("Tạo thuộc tính thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  const mergedSaveButtonProps = {
    ...saveButtonProps,
    loading: submitting || saveButtonProps?.loading,
  };

  return (
    <Create
      title="Thêm thuộc tính sản phẩm"
      saveButtonProps={{
        ...mergedSaveButtonProps,
        onClick: () => form?.submit(),
      }}
    >
      <Form<CreateAttributeRequest>
        {...formProps}
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={handleFinish}
      >
        <Form.Item
          label="Tên thuộc tính"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên" }]}
        >
          <Input placeholder="VD: Màu sắc, Kích thước" />
        </Form.Item>

        <Form.Item
          label="Code"
          name="code"
          rules={[{ required: true, message: "Vui lòng nhập code" }]}
        >
          <Input placeholder="VD: COLOR, SIZE" />
        </Form.Item>

        <Form.Item label="Thứ tự" name="sortOrder">
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            placeholder="Tuỳ chọn"
          />
        </Form.Item>

        <Form.Item
          label="Type"
          name="type"
          tooltip="Xác định kiểu hiển thị cho các value"
        >
          <Select
            allowClear
            placeholder="Chọn type"
            options={[
              { label: "Text", value: "text" },
              { label: "Color", value: "color" },
              { label: "Size", value: "size" },
            ]}
          />
        </Form.Item>
      </Form>
    </Create>
  );
};
