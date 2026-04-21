// src/pages/products/edit.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Edit, useForm } from "@refinedev/antd";
import { useNavigation, type HttpError } from "@refinedev/core";
import {
  Button,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Switch,
  Table,
  Tabs,
  Tag,
  Upload,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";

import type {
  ImageDto,
  ProductAdminDetailDto,
  ProductVariantAdminDto,
  VariantAttributePairDto,
} from "../../type/product";
import type { AttributeDto } from "../../type/attribute";

import productApi from "../../service/productApi";
import attributeApi from "../../service/attributeApi";

const TAG_OPTIONS = [
  { label: "Featured", value: "featured" },
  { label: "Trendy", value: "trendy" },
  { label: "New", value: "new" },
  { label: "Sale", value: "sale" },
];

interface VariantsTabProps {
  productId?: number;
  variants: ProductVariantAdminDto[];
  onChanged: () => void;
}

// ===============================
//      TAB QUẢN LÝ BIẾN THỂ
// ===============================
const VariantsTab: React.FC<VariantsTabProps> = ({
  productId,
  variants,
  onChanged,
}) => {
  const [variantModalOpen, setVariantModalOpen] = useState(false);
  const [variantForm] = Form.useForm();
  const [editingVariant, setEditingVariant] =
    useState<ProductVariantAdminDto | null>(null);
  const [variantFileList, setVariantFileList] = useState<UploadFile[]>([]);
  const [variantRawFiles, setVariantRawFiles] = useState<File[]>([]);

  // ✅ Danh sách thuộc tính + values (COLOR, SIZE, ...)
  const [attributes, setAttributes] = useState<AttributeDto[]>([]);

  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const res = await attributeApi.getAll();
        setAttributes(res.data.data);
      } catch (e) {
        console.error(e);
        message.error("Không tải được danh sách thuộc tính");
      }
    };
    fetchAttributes();
  }, []);

  if (!productId) {
    return (
      <Tag color="red">
        Chưa có ID sản phẩm — không thể quản lý biến thể
      </Tag>
    );
  }

  const openCreateVariantModal = () => {
    setEditingVariant(null);
    variantForm.resetFields();
    setVariantFileList([]);
    setVariantRawFiles([]);
    setVariantModalOpen(true);
  };

  const openEditVariantModal = (variant: ProductVariantAdminDto) => {
    setEditingVariant(variant);

    variantForm.setFieldsValue({
      sku: variant.sku,
      price: variant.price,
      compareAtPrice: variant.compareAtPrice,
      costPrice: variant.costPrice,
      // nếu DTO hiện tại là weightGram thì bạn có thể map: weight: variant.weightGram
      weight: (variant as any).weight ?? (variant as any).weightGram ?? null,
      status: variant.status,
      isDefault: variant.isDefault,
      stockQuantity: variant.stockQuantity,
      safetyStock: variant.safetyStock,
      stockLocation: variant.stockLocation,
      // ✅ set sẵn attribute values đang dùng
      attributeValueIds: variant.attributes?.map(
        (a: VariantAttributePairDto) => a.attributeValueId,
      ),
    });

    setVariantFileList([]);
    setVariantRawFiles([]);
    setVariantModalOpen(true);
  };

  const handleDeleteVariant = (variantId: number) => {
    Modal.confirm({
      title: "Xoá biến thể",
      content: "Bạn có chắc chắn muốn xoá biến thể này?",
      okText: "Xoá",
      okType: "danger",
      cancelText: "Huỷ",
      onOk: async () => {
        await productApi.deleteVariant(productId, variantId);
        message.success("Đã xoá biến thể");
        onChanged();
      },
    });
  };

  const handleDeleteVariantImage = async (
    variantId: number,
    imageId: number,
  ) => {
    await productApi.deleteVariantImage(variantId, imageId);
    message.success("Đã xoá ảnh biến thể");
    onChanged();
  };

  const handleVariantSubmit = async () => {
    const values = await variantForm.validateFields();

    // ✅ Build attributes payload từ list valueId
    const selectedValueIds: number[] = values.attributeValueIds ?? [];

    const attributePairs = attributes.flatMap((attr) =>
      (attr.values || [])
        .filter((v) => selectedValueIds.includes(v.id))
        .map((v) => ({
          attributeId: attr.id,
          attributeValueId: v.id,
        })),
    );

    const variantPayload: any = {
      sku: values.sku,
      price: values.price,
      compareAtPrice: values.compareAtPrice ?? null,
      costPrice: values.costPrice ?? null,
      // gửi weight lên backend (backend map sang weight / weightGram tuỳ DTO)
      weight: values.weight ?? null,
      status: values.status ?? "active",
      isDefault: values.isDefault ?? false,
      attributes: attributePairs,
    };

    // Tạo FormData
    const formData = new FormData();

    // ⭐ CASE TẠO MỚI → dùng initialStock, safetyStock, stockLocation
    if (!editingVariant) {
      variantPayload.initialStock = values.stockQuantity ?? 0;
      variantPayload.safetyStock = values.safetyStock ?? 0;
      variantPayload.stockLocation = values.stockLocation ?? null;
    }

    formData.append(
      "data",
      new Blob([JSON.stringify(variantPayload)], {
        type: "application/json",
      }),
    );
    variantRawFiles.forEach((file) => {
      formData.append("images", file);
    });

    if (editingVariant) {
      // UPDATE variant
      await productApi.updateVariant(productId, editingVariant.id, formData);

      // UPDATE stock riêng
      await productApi.updateVariantStock(productId, editingVariant.id, {
        quantity: values.stockQuantity,
        safetyStock: values.safetyStock,
        location: values.stockLocation,
      });

      message.success("Cập nhật biến thể thành công");
    } else {
      // CREATE variant
      await productApi.createVariant(productId, formData);
      message.success("Tạo biến thể thành công");
    }

    setVariantModalOpen(false);
    onChanged();
  };

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={openCreateVariantModal}>
          Thêm biến thể
        </Button>
      </Space>

      <Table<ProductVariantAdminDto>
        dataSource={variants}
        rowKey="id"
        pagination={false}
      >
        <Table.Column<ProductVariantAdminDto>
          dataIndex="sku"
          title="SKU"
        />
        <Table.Column<ProductVariantAdminDto>
          dataIndex="price"
          title="Giá"
          render={(value: number) =>
            value != null ? value.toLocaleString("vi-VN") + " đ" : "-"
          }
        />
        <Table.Column<ProductVariantAdminDto>
          dataIndex="status"
          title="Trạng thái"
          render={(value: string) => {
            let color: "green" | "red" | "orange" | "default" = "default";
            if (value === "active") color = "green";
            else if (value === "inactive") color = "orange";
            else if (value === "deleted") color = "red";
            return <Tag color={color}>{value}</Tag>;
          }}
        />
        <Table.Column<ProductVariantAdminDto>
          dataIndex="stockQuantity"
          title="Tồn kho"
        />
        <Table.Column<ProductVariantAdminDto>
          key="attrs"
          title="Thuộc tính"
          render={(_, record) =>
            record.attributes?.length ? (
              <Space wrap>
                {record.attributes.map((a: VariantAttributePairDto) => (
                  <Tag key={a.attributeValueId}>
                    {a.attributeName}: {a.attributeValue}
                  </Tag>
                ))}
              </Space>
            ) : (
              <Tag color="default">No attributes</Tag>
            )
          }
        />
        <Table.Column<ProductVariantAdminDto>
          title="Actions"
          render={(_, record) => (
            <Space>
              <Button size="small" onClick={() => openEditVariantModal(record)}>
                Sửa
              </Button>
              <Button
                size="small"
                danger
                onClick={() => handleDeleteVariant(record.id)}
              >
                Xoá
              </Button>
            </Space>
          )}
        />
      </Table>

      {/* Modal tạo / sửa biến thể */}
      <Modal
        open={variantModalOpen}
        title={editingVariant ? "Sửa biến thể" : "Thêm biến thể"}
        onCancel={() => setVariantModalOpen(false)}
        onOk={handleVariantSubmit}
        okText="Lưu"
        forceRender
      >
        <Form form={variantForm} layout="vertical">
          {/* Ảnh hiện tại của biến thể (khi sửa) */}
          {editingVariant?.images?.length ? (
            <Form.Item label="Ảnh hiện tại của biến thể">
              <Space wrap>
                {editingVariant.images.map((img: ImageDto) => (
                  <div key={img.id} style={{ textAlign: "center" }}>
                    <Image
                      src={img.url}
                      width={60}
                      height={60}
                      style={{
                        objectFit: "cover",
                        borderRadius: 8,
                        display: "block",
                      }}
                    />
                    <Popconfirm
                      title="Xoá ảnh biến thể?"
                      okText="Xoá"
                      cancelText="Huỷ"
                      okType="danger"
                      onConfirm={() =>
                        handleDeleteVariantImage(editingVariant.id, img.id)
                      }
                    >
                      <Button size="small" danger style={{ marginTop: 4 }}>
                        Xoá
                      </Button>
                    </Popconfirm>
                  </div>
                ))}
              </Space>
            </Form.Item>
          ) : null}

          <Form.Item
            label="SKU"
            name="sku"
            rules={[{ required: true, message: "Vui lòng nhập SKU" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Giá"
            name="price"
            rules={[{ required: true, message: "Vui lòng nhập giá" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
            />
          </Form.Item>

          <Form.Item label="Giá so sánh" name="compareAtPrice">
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>

          <Form.Item label="Giá vốn" name="costPrice">
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>

          <Form.Item label="Khối lượng (gram)" name="weight">
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>

          <Form.Item label="Trạng thái" name="status">
            <Select
              options={[
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
                { label: "Deleted", value: "deleted" },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="Biến thể mặc định"
            name="isDefault"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          {/* ✅ chọn thuộc tính (Color, Size, ...) */}
          <Form.Item
            label="Thuộc tính (Color / Size / ...)"
            name="attributeValueIds"
          >
            <Select
              mode="multiple"
              placeholder="Chọn thuộc tính cho biến thể"
              optionFilterProp="label"
              options={attributes.flatMap((attr) =>
                (attr.values || []).map((v) => ({
                  label: `${attr.name}: ${v.value}`,
                  value: v.id,
                })),
              )}
            />
          </Form.Item>

          <Form.Item label="Số lượng tồn" name="stockQuantity">
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>
          <Form.Item label="Tồn tối thiểu" name="safetyStock">
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>
          <Form.Item label="Vị trí kho" name="stockLocation">
            <Input />
          </Form.Item>

          {/* Ảnh biến thể mới */}
          <Form.Item label="Thêm ảnh biến thể">
            <Upload
              multiple
              fileList={variantFileList}
              beforeUpload={(file) => {
                setVariantFileList((prev) => [...prev, file]);
                const real = (file as any).originFileObj as File | undefined;
                setVariantRawFiles((prev) => [
                  ...prev,
                  real ?? (file as any as unknown as File),
                ]);
                return false;
              }}
              onRemove={(file) => {
                setVariantFileList((prev) =>
                  prev.filter((f) => f.uid !== file.uid),
                );
                const real = file.originFileObj as File | undefined;
                setVariantRawFiles((prev) =>
                  prev.filter(
                    (f) => f !== (real ?? ((file as any) as unknown as File)),
                  ),
                );
              }}
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh biến thể</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

// ===============================
//          PRODUCT EDIT
// ===============================
export const ProductEdit = () => {
  const { formProps, saveButtonProps } = useForm<
    ProductAdminDetailDto,
    HttpError,
    ProductAdminDetailDto
  >({
    resource: "products",
    redirect: false,
  });

  const { list } = useNavigation();

  // Ảnh sản phẩm mới
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [rawFiles, setRawFiles] = useState<File[]>([]);

  const record = formProps.initialValues as ProductAdminDetailDto | undefined;
  const productId = record?.id;

  const onCancel = () => {
    list("products");
  };

  const reloadPage = () => {
    window.location.reload();
  };

  const handleFinish = async (values: any) => {
    if (!productId) return;

    const payload = {
      name: values.name,
      slug: values.slug,
      description: values.description ?? null,
      metaTitle: values.metaTitle ?? null,
      metaDescription: values.metaDescription ?? null,
      metaKeywords: values.metaKeywords ?? null,
      tags: Array.isArray(values.tags)
        ? values.tags.join(",")
        : values.tags ?? null,
      material: values.material ?? null,
      careInstructions: values.careInstructions ?? null,
      countryOfOrigin: values.countryOfOrigin ?? null,
      featured: values.featured ?? false,
      basePrice: values.basePrice,
      status: values.status ?? "active",
      brandId: values.brandId ?? null,
      categoryIds: values.categoryIds ?? [],
    };

    const formData = new FormData();
    formData.append(
      "data",
      new Blob([JSON.stringify(payload)], { type: "application/json" }),
    );

    rawFiles.forEach((file) => {
      formData.append("images", file);
    });

    await formProps.onFinish?.(formData as any);
    message.success("Cập nhật sản phẩm thành công");
    reloadPage();
  };

  const handleDeleteProductImage = async (imageId: number) => {
    if (!productId) return;
    await productApi.deleteProductImage(productId, imageId);
    message.success("Đã xoá ảnh sản phẩm");
    reloadPage();
  };

  const variants: ProductVariantAdminDto[] = useMemo(
    () => record?.variants ?? [],
    [record],
  );

  return (
    <Edit
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
      <Tabs
        defaultActiveKey="info"
        items={[
          {
            key: "info",
            label: "Thông tin sản phẩm",
            children: (
              <Form
                {...formProps}
                layout="vertical"
                onFinish={handleFinish}
                initialValues={{
                  status: record?.status ?? "active",
                  featured: record?.featured ?? false,
                  ...formProps.initialValues,
                  tags: record?.tags
                    ? record.tags.split(",").map((t) => t.trim())
                    : [],
                }}
              >
                <Form.Item label="Thương hiệu" name="brandId">
                  <Select placeholder="Chọn thương hiệu" allowClear />
                </Form.Item>

                <Form.Item
                  label="Tên sản phẩm"
                  name="name"
                  rules={[
                    { required: true, message: "Vui lòng nhập tên sản phẩm" },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Slug"
                  name="slug"
                  rules={[
                    { required: true, message: "Vui lòng nhập slug" },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Giá gốc"
                  name="basePrice"
                  rules={[{ required: true, message: "Vui lòng nhập giá" }]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    min={0}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                  />
                </Form.Item>

                <Form.Item label="Trạng thái" name="status">
                  <Select
                    options={[
                      { label: "Active", value: "active" },
                      { label: "Inactive", value: "inactive" },
                      { label: "Deleted", value: "deleted" },
                    ]}
                  />
                </Form.Item>

                <Form.Item
                  label="Nổi bật"
                  name="featured"
                  valuePropName="checked"
                  tooltip="Hiển thị sản phẩm ở mục nổi bật"
                >
                  <Switch />
                </Form.Item>

                <Form.Item label="Mô tả" name="description">
                  <Input.TextArea rows={4} />
                </Form.Item>

                <Form.Item label="Chất liệu" name="material">
                  <Input />
                </Form.Item>

                <Form.Item label="Tags" name="tags">
                  <Select
                    mode="multiple"
                    allowClear
                    placeholder="Chọn tags"
                    options={TAG_OPTIONS}
                  />
                </Form.Item>

                <Form.Item label="Hướng dẫn bảo quản" name="careInstructions">
                  <Input.TextArea rows={3} />
                </Form.Item>

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

                <Form.Item label="Meta title" name="metaTitle">
                  <Input />
                </Form.Item>

                <Form.Item label="Meta description" name="metaDescription">
                  <Input.TextArea rows={2} />
                </Form.Item>

                <Form.Item label="Meta keywords" name="metaKeywords">
                  <Input />
                </Form.Item>

                {/* Ảnh hiện tại */}
                {record?.images?.length ? (
                  <Form.Item label="Ảnh hiện tại">
                    <Space wrap>
                      {record.images.map((img: ImageDto) => {
                        const isHover =
                          Boolean(img.hover) ||
                          (!img.primary &&
                            (img.sortOrder === 2 ||
                              img.sortOrder === null ||
                              img.sortOrder === undefined));
                        const tagColor = img.primary
                          ? "gold"
                          : isHover
                            ? "cyan"
                            : "default";
                        const tagLabel = img.primary
                          ? "Ảnh chính"
                          : isHover
                            ? "Ảnh hover"
                            : "Ảnh phụ";

                        return (
                          <div key={img.id} style={{ textAlign: "center" }}>
                            <Image
                              src={img.url}
                              width={80}
                              height={80}
                              style={{
                                objectFit: "cover",
                                borderRadius: 8,
                                display: "block",
                              }}
                            />
                            <Tag color={tagColor} style={{ marginTop: 8 }}>
                              {tagLabel}
                            </Tag>
                            {typeof img.sortOrder === "number" && (
                              <div style={{ fontSize: 12, color: "#8c8c8c" }}>
                                Thứ tự: {img.sortOrder}
                              </div>
                            )}
                            <Popconfirm
                              title="Xoá ảnh?"
                              okText="Xoá"
                              cancelText="Huỷ"
                              okType="danger"
                              onConfirm={() => handleDeleteProductImage(img.id)}
                            >
                              <Button
                                size="small"
                                danger
                                style={{ marginTop: 4 }}
                              >
                                Xoá
                              </Button>
                            </Popconfirm>
                          </div>
                        );
                      })}
                    </Space>
                  </Form.Item>
                ) : null}

                {/* Thêm ảnh mới */}
                <Form.Item label="Thêm ảnh mới">
                  <Upload
                    multiple
                    fileList={fileList}
                    beforeUpload={(file) => {
                      setFileList((prev) => [...prev, file]);
                      const real =
                        (file as any).originFileObj as File | undefined;
                      setRawFiles((prev) => [
                        ...prev,
                        real ?? (file as any as unknown as File),
                      ]);
                      return false;
                    }}
                    onRemove={(file) => {
                      setFileList((prev) =>
                        prev.filter((f) => f.uid !== file.uid),
                      );
                      const real = file.originFileObj as File | undefined;
                      setRawFiles((prev) =>
                        prev.filter(
                          (f) =>
                            f !==
                            (real ?? ((file as any) as unknown as File)),
                        ),
                      );
                    }}
                  >
                    <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                  </Upload>
                </Form.Item>
              </Form>
            ),
          },

          // TAB BIẾN THỂ
          {
            key: "variants",
            label: "Biến thể",
            children: (
              <VariantsTab
                productId={productId}
                variants={variants}
                onChanged={reloadPage}
              />
            ),
          },
        ]}
      />
    </Edit>
  );
};
