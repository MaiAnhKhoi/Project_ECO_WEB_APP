// src/pages/attribute/edit.tsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Edit } from "@refinedev/antd";
import {
  Card,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Button,
  message,
  Typography,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";

import type {
  AttributeDto,
  AttributeValueDto,
  CreateAttributeRequest,
  CreateAttributeValueRequest,
} from "../../type/attribute";
import attributeApi from "../../service/attributeApi";
import { BOOTSTRAP_COLORS } from "../../constant/bootstrapColors";

export const AttributeEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const attrId = Number(id);

  const [attrForm] = Form.useForm<CreateAttributeRequest>();
  const [valueForm] = Form.useForm<CreateAttributeValueRequest>();

  const [data, setData] = useState<AttributeDto | null>(null);
  const [loading, setLoading] = useState(false);

  const [valueModalOpen, setValueModalOpen] = useState(false);
  const [editingValue, setEditingValue] = useState<AttributeValueDto | null>(
    null,
  );

  const fetchData = useCallback(async () => {
    if (!attrId) return;
    try {
      setLoading(true);
      const res = await attributeApi.getById(attrId);
      const attr = res.data.data;
      setData(attr);

      attrForm.setFieldsValue({
        name: attr.name,
        code: attr.code,
        sortOrder: (attr as any).sortOrder ?? null,
        type: attr.type ?? null,
      });
    } catch (e) {
      console.error(e);
      message.error("Không tải được thuộc tính");
    } finally {
      setLoading(false);
    }
  }, [attrForm, attrId]);

  useEffect(() => {
    fetchData();
  }, [attrId, fetchData]);

  const handleSaveAttr = async (values: CreateAttributeRequest) => {
    if (!attrId) return;
    try {
      await attributeApi.updateAttribute(attrId, values);
      message.success("Cập nhật thuộc tính thành công");
      fetchData();
    } catch (e) {
      console.error(e);
      message.error("Cập nhật thuộc tính thất bại");
    }
  };

  const openCreateValueModal = () => {
    setEditingValue(null);
    valueForm.resetFields();
    setValueModalOpen(true);
  };

  const openEditValueModal = (value: AttributeValueDto) => {
    setEditingValue(value);
    valueForm.setFieldsValue({
      value: value.value,
      code: (value as any).code ?? null,
      sortOrder: value.sortOrder ?? null,
      colorCssClass: value.colorCssClass ?? null,
      colorHex: value.colorHex ?? null,
    });
    setValueModalOpen(true);
  };

  const handleSaveValue = async () => {
    if (!attrId) return;
    const values = await valueForm.validateFields();

    const payload: CreateAttributeValueRequest = {
      value: values.value,
      code: values.code ?? null,
      sortOrder: values.sortOrder ?? null,
      colorCssClass: values.colorCssClass ?? null,
      colorHex: values.colorHex ?? null,
    };

    try {
      if (editingValue) {
        await attributeApi.updateValue(editingValue.id, payload);
        message.success("Cập nhật value thành công");
      } else {
        await attributeApi.createValue(attrId, payload);
        message.success("Tạo value thành công");
      }
      setValueModalOpen(false);
      fetchData();
    } catch (e) {
      console.error(e);
      message.error("Lưu value thất bại");
    }
  };

  const handleDeleteValue = async (valueId: number) => {
    try {
      await attributeApi.deleteValue(valueId);
      message.success("Đã xoá value");
      fetchData();
    } catch (e) {
      console.error(e);
      message.error("Xoá value thất bại");
    }
  };

  const selectedType = Form.useWatch("type", attrForm);
  const isColorAttr = selectedType === "color";

  const colorSelectOptions = useMemo(
    () =>
      BOOTSTRAP_COLORS.map((c) => ({
        value: c.cssClass,
        hex: c.hex,
        label: (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                backgroundColor: c.hex,
                border: "1px solid #ccc",
                display: "inline-block",
              }}
            />
            {c.label} <span style={{ opacity: 0.6 }}>({c.cssClass})</span>
          </span>
        ),
      })),
    [],
  );

  return (
    <Edit
      title="Sửa thuộc tính"
      isLoading={loading}
      saveButtonProps={{
        onClick: () => attrForm.submit(),
      }}
    >
      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        <Card
          size="small"
          title={<Typography.Text strong>Thông tin thuộc tính</Typography.Text>}
        >
          <Form<CreateAttributeRequest>
            form={attrForm}
            layout="vertical"
            onFinish={handleSaveAttr}
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
        </Card>

        <Card
          size="small"
          title={<Typography.Text strong>Giá trị thuộc tính</Typography.Text>}
          extra={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={openCreateValueModal}
            >
              Thêm value
            </Button>
          }
        >
          <Table<AttributeValueDto>
            rowKey="id"
            dataSource={data?.values || []}
            pagination={false}
            size="small"
            columns={[
              {
                title: "ID",
                dataIndex: "id",
                width: 80,
              },
              {
                title: "Giá trị",
                dataIndex: "value",
              },
              {
                title: "Code",
                dataIndex: "code",
                width: 160,
                render: (value: string | null) =>
                  value ? <Tag>{value}</Tag> : "-",
              },
              {
                title: "Thứ tự",
                dataIndex: "sortOrder",
                width: 110,
                align: "center",
                render: (value: number | null) => value ?? "-",
              },
              {
                title: "Mã màu",
                dataIndex: "colorHex",
                width: 200,
                render: (value: string | null) =>
                  value ? (
                    <Space>
                      <span
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: "50%",
                          border: "1px solid #ddd",
                          backgroundColor: value,
                          display: "inline-block",
                        }}
                      />
                      <span>{value}</span>
                    </Space>
                  ) : (
                    "-"
                  ),
              },
              {
                title: "Actions",
                key: "actions",
                width: 200,
                render: (_, record) => (
                  <Space>
                    <Button
                      size="small"
                      onClick={() => openEditValueModal(record)}
                    >
                      Sửa
                    </Button>
                    <Popconfirm
                      title="Xoá value?"
                      okText="Xoá"
                      cancelText="Huỷ"
                      okType="danger"
                      onConfirm={() => handleDeleteValue(record.id)}
                    >
                      <Button size="small" danger>
                        Xoá
                      </Button>
                    </Popconfirm>
                  </Space>
                ),
              },
            ]}
          />
        </Card>
      </Space>

      <Modal
        open={valueModalOpen}
        title={editingValue ? "Sửa value" : "Thêm value"}
        onCancel={() => setValueModalOpen(false)}
        onOk={handleSaveValue}
        okText="Lưu"
        destroyOnClose
      >
        <Form<CreateAttributeValueRequest> form={valueForm} layout="vertical">
          <Form.Item
            label="Giá trị hiển thị"
            name="value"
            rules={[
              { required: true, message: "Vui lòng nhập giá trị" },
              { whitespace: true, message: "Giá trị không được toàn khoảng trắng" },
            ]}
          >
            <Input placeholder="VD: Đỏ, Xanh, S, M, L..." />
          </Form.Item>

          <Form.Item label="Code" name="code">
            <Input placeholder="VD: RED, BLUE, S, M, L..." />
          </Form.Item>

          <Form.Item label="Thứ tự" name="sortOrder">
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              placeholder="Tự tăng nếu bỏ trống"
            />
          </Form.Item>

          {isColorAttr && (
            <>
              <Form.Item
                label="Chọn màu (Bootstrap)"
                name="colorCssClass"
                rules={[{ required: true, message: "Vui lòng chọn màu" }]}
              >
                <Select
                  showSearch
                  placeholder="Chọn màu"
                  options={colorSelectOptions}
                  optionFilterProp="label"
                  onChange={(value) => {
                    const found = colorSelectOptions.find(
                      (item) => item.value === value,
                    );
                    valueForm.setFieldsValue({
                      colorHex: found?.hex ?? null,
                    });
                  }}
                />
              </Form.Item>

              <Form.Item label="Mã màu HEX" name="colorHex">
                <Input disabled placeholder="#FF0000" />
              </Form.Item>

              <Form.Item shouldUpdate noStyle>
                {() => {
                  const hex = valueForm.getFieldValue("colorHex") as
                    | string
                    | null;
                  if (!hex) return null;
                  return (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginTop: 4,
                      }}
                    >
                      <span>Preview:</span>
                      <span
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          border: "1px solid #ccc",
                          backgroundColor: hex,
                          display: "inline-block",
                        }}
                      />
                      <Typography.Text>{hex}</Typography.Text>
                    </div>
                  );
                }}
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </Edit>
  );
};
