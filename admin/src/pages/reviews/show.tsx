import React from "react";
import { Show } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Card, Col, Image, Rate, Row, Space, Tag, Typography, Select, Button, message } from "antd";
import type { ReviewAdminDto } from "../../type/review";
import reviewAdminApi from "../../service/reviewAdminApi";
import { useInvalidate } from "@refinedev/core";

const STATUS_OPTIONS = [
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

export const ReviewShow: React.FC = () => {
  const { query } = useShow<ReviewAdminDto>({ resource: "reviews" });
  const review = query?.data?.data;
  const invalidate = useInvalidate();
  const [updating, setUpdating] = React.useState(false);

  const handleStatusChange = async (value: string) => {
    if (!review) return;
    setUpdating(true);
    try {
      await reviewAdminApi.updateStatus(review.id, value);
      invalidate({
        resource: "reviews",
        id: review.id,
        invalidates: ["detail", "list"],
      });
      const statusText = value === "approved" ? "duyệt" : value === "rejected" ? "từ chối" : "chuyển về chờ duyệt";
      message.success(`Đánh giá đã được ${statusText} thành công`);
    } catch (error: any) {
      console.error("Failed to update review status:", error);
      message.error(error?.response?.data?.message || "Không thể cập nhật trạng thái đánh giá");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Show title="Chi tiết đánh giá" isLoading={query?.isLoading}>
      {review && (
        <Row gutter={16}>
          <Col span={16}>
            <Card title="Thông tin đánh giá" bordered={false}>
              <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                <div>
                  <Typography.Text type="secondary">Sản phẩm</Typography.Text>
                  <Typography.Title level={4}>{review.productName}</Typography.Title>
                </div>
                <div>
                  <Typography.Text type="secondary">Khách hàng</Typography.Text>
                  <Typography.Title level={5}>{review.userName}</Typography.Title>
                </div>
                <div>
                  <Typography.Text type="secondary">Điểm</Typography.Text>
                  <Rate disabled defaultValue={review.rating} />
                </div>
                <div>
                  <Typography.Text type="secondary">Nội dung</Typography.Text>
                  <Typography.Paragraph>{review.content || "—"}</Typography.Paragraph>
                </div>
                <div>
                  <Typography.Text type="secondary">Trạng thái</Typography.Text>
                  <div style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center" }}>
                    <Select
                      options={STATUS_OPTIONS}
                      value={review.status}
                      onChange={handleStatusChange}
                      disabled={updating}
                      loading={updating}
                      style={{ width: 200 }}
                    />
                    {review.status === "pending" && (
                      <Space>
                        <Button
                          type="primary"
                          size="small"
                          onClick={() => handleStatusChange("approved")}
                          disabled={updating}
                          loading={updating}
                        >
                          Duyệt ngay
                        </Button>
                        <Button
                          danger
                          size="small"
                          onClick={() => handleStatusChange("rejected")}
                          disabled={updating}
                          loading={updating}
                        >
                          Từ chối
                        </Button>
                      </Space>
                    )}
                  </div>
                </div>
              </Space>
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Ảnh minh họa" bordered={false}>
              {review.imageUrls?.length ? (
                <Space direction="vertical" size={12}>
                  {review.imageUrls.map((url, index) => (
                    <Image key={index} width={200} src={url} />
                  ))}
                </Space>
              ) : (
                <Tag>Không có hình ảnh</Tag>
              )}
            </Card>
          </Col>
        </Row>
      )}
    </Show>
  );
};

