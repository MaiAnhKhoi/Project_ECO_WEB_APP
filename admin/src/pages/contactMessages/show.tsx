import React from "react";
import { Show } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Button, Card, Form, Input, Select, Space, Typography, message } from "antd";
import contactMessageApi from "../../service/contactMessageApi";
import type { ContactMessageDto } from "../../type/contactMessage";
import dayjs from "dayjs";
import { useInvalidate } from "@refinedev/core";

const STATUS_OPTIONS = [
  { label: "Mới", value: "new" },
  { label: "Đang xử lý", value: "in_progress" },
  { label: "Đã xử lý", value: "resolved" },
];

export const ContactMessageShow: React.FC = () => {
  const { query } = useShow<ContactMessageDto>({ resource: "contact-messages" });
  const messageData = query?.data?.data;
  const invalidate = useInvalidate();
  const [form] = Form.useForm<{ status: string; note?: string }>();

  const handleUpdateStatus = async (values: { status: string; note?: string }) => {
    if (!messageData) return;
    try {
      await contactMessageApi.updateStatus(messageData.id, values.status, values.note);
      message.success("Cập nhật trạng thái thành công");
      invalidate({
        resource: "contact-messages",
        id: messageData.id,
        invalidates: ["detail", "list"],
      });
    } catch (error) {
      console.error(error);
      message.error("Cập nhật thất bại");
    }
  };

  return (
    <Show title="Chi tiết liên hệ" isLoading={query?.isLoading}>
      {messageData && (
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          <Card title="Thông tin khách hàng">
            <Typography.Paragraph>
              <strong>Họ tên:</strong> {messageData.name}
            </Typography.Paragraph>
            <Typography.Paragraph>
              <strong>Email:</strong> {messageData.email}
            </Typography.Paragraph>
            <Typography.Paragraph>
              <strong>Thời gian gửi:</strong>{" "}
              {dayjs(messageData.createdAt).format("DD/MM/YYYY HH:mm")}
            </Typography.Paragraph>
            <Typography.Paragraph>
              <strong>Nội dung:</strong>
              <br />
              {messageData.message}
            </Typography.Paragraph>
          </Card>

          <Card title="Xử lý">
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                status: messageData.status,
                note: messageData.note,
              }}
              onFinish={handleUpdateStatus}
            >
              <Form.Item label="Trạng thái" name="status" rules={[{ required: true }]}>
                <Select options={STATUS_OPTIONS} />
              </Form.Item>
              <Form.Item label="Ghi chú" name="note">
                <Input.TextArea rows={3} placeholder="Nhập ghi chú cho khách hàng" />
              </Form.Item>
              <Button type="primary" htmlType="submit">
                Cập nhật
              </Button>
            </Form>
          </Card>
        </Space>
      )}
    </Show>
  );
};

