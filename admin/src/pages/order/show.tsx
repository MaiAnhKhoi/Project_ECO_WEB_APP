// src/pages/orders/show.tsx
import { Show } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import type { HttpError } from "@refinedev/core";
import { Descriptions, Table, Tag } from "antd";
import type { OrderDetail, OrderItem } from "../../type/order";

const formatMoney = (value: number) =>
  value != null ? `${value.toLocaleString("vi-VN")} đ` : "-";

const renderOrderStatus = (status?: string) => {
  if (!status) return <Tag>-</Tag>;
  const s = status.toUpperCase();

  if (s === "PENDING") return <Tag color="orange">Pending</Tag>;
  if (s === "CONFIRMED") return <Tag color="blue">Confirmed</Tag>;
  if (s === "PROCESSING") return <Tag color="geekblue">Processing</Tag>;
  if (s === "CANCEL_REQUESTED") return <Tag color="gold">Cancel requested</Tag>;
  if (s === "CANCELLED") return <Tag color="red">Cancelled</Tag>;
  if (s === "COMPLETED") return <Tag color="green">Completed</Tag>;

  return <Tag>{status}</Tag>;
};

const renderPaymentStatus = (status?: string) => {
  if (!status) return <Tag>-</Tag>;

  const s = status.toLowerCase();

  if (s === "unpaid") return <Tag color="orange">Unpaid</Tag>;
  if (s === "paid") return <Tag color="green">Paid</Tag>;
  if (s === "failed") return <Tag color="red">Failed</Tag>;
  if (s === "expired") return <Tag color="red">Expired</Tag>;
  if (s === "refund_requested") return <Tag color="gold">Refund requested</Tag>;
  if (s === "refund_processing") return <Tag color="blue">Refund processing</Tag>;
  if (s === "refunded") return <Tag color="green">Refunded</Tag>;
  if (s === "refund_info_required")
    return <Tag color="purple">Need refund info</Tag>;

  return <Tag>{status}</Tag>;
};

// ✅ render phương thức thanh toán
const renderPaymentMethod = (method?: string) => {
  if (!method) return <Tag>-</Tag>;
  const m = method.toUpperCase();

  if (m === "COD") return <Tag color="blue">COD</Tag>;
  if (m === "PAYOS") return <Tag color="green">PayOS</Tag>;

  return <Tag>{method}</Tag>;
};

export const OrderShow = () => {
  const { query } = useShow<OrderDetail, HttpError>({
    resource: "orders",
  });

  const { data, isLoading } = query;
  const record = data?.data;

  const showPayosQr =
    record &&
    record.paymentMethod?.toUpperCase() === "PAYOS" &&
    record.paymentStatus?.toLowerCase() !== "paid" &&
    record.status?.toLowerCase() !== "done" &&
    !!record.payosQrUrl;

  return (
    <Show isLoading={isLoading} title={`Order Detail`}>
      {record && (
        <>
          <Descriptions
            title={`Order #${record.orderCode}`}
            bordered
            size="small"
            column={2}
          >
            <Descriptions.Item label="Order ID">
              {record.orderId}
            </Descriptions.Item>
            <Descriptions.Item label="Created At">
              {record.createdAt
                ? new Date(record.createdAt).toLocaleString("vi-VN")
                : "-"}
            </Descriptions.Item>

            <Descriptions.Item label="Status">
              {renderOrderStatus(record.status)}
            </Descriptions.Item>
            <Descriptions.Item label="Payment Status">
              {renderPaymentStatus(record.paymentStatus)}
            </Descriptions.Item>

            {/* ✅ Payment Method */}
            <Descriptions.Item label="Payment Method">
              {renderPaymentMethod(record.paymentMethod)}
            </Descriptions.Item>
            {showPayosQr && (
              <Descriptions.Item label="QR thanh toán" span={2}>
                <img
                  src={record.payosQrUrl!}
                  alt="PayOS QR"
                  style={{ width: 220, height: "auto", border: "1px solid #eee" }}
                />
              </Descriptions.Item>
            )}
            <Descriptions.Item label="Subtotal">
              {formatMoney(record.subtotal)}
            </Descriptions.Item>

            <Descriptions.Item label="Discount">
              {formatMoney(record.discountTotal)}
            </Descriptions.Item>
            <Descriptions.Item label="Tax">
              {formatMoney(record.taxTotal)}
            </Descriptions.Item>
            <Descriptions.Item label="Shipping Fee">
              {formatMoney(record.shippingFee)}
            </Descriptions.Item>
            <Descriptions.Item label="Grand Total" span={2}>
              <strong>{formatMoney(record.grandTotal)}</strong>
            </Descriptions.Item>

            <Descriptions.Item label="Shipping Status">
              {record.shippingStatus || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Cancel Reason">
              {record.cancelReason || "-"}
            </Descriptions.Item>

            <Descriptions.Item label="Customer">
              {record.customerName
                ? `${record.customerName} (#${record.customerId})`
                : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Contact">
              {record.customerEmail || record.customerPhone
                ? `${record.customerEmail ?? ""} ${
                    record.customerPhone ? `(${record.customerPhone})` : ""
                  }`
                : "-"}
            </Descriptions.Item>

            <Descriptions.Item label="Note" span={2}>
              {record.note || "-"}
            </Descriptions.Item>
          </Descriptions>

          <br />

          <Descriptions
            title="Shipping Address"
            bordered
            size="small"
            column={1}
          >
            <Descriptions.Item label="Receiver">
              {record.shippingAddress
                ? `${record.shippingAddress.firstName} ${record.shippingAddress.lastName}`
                : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Phone">
              {record.shippingAddress?.phone ?? "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Address">
              {record.shippingAddress
                ? `${record.shippingAddress.address1}, ${record.shippingAddress.region}, ${record.shippingAddress.city}, ${record.shippingAddress.province}`
                : "-"}
            </Descriptions.Item>
            {record.shippingAddress?.company && (
              <Descriptions.Item label="Company">
                {record.shippingAddress.company}
              </Descriptions.Item>
            )}
          </Descriptions>

          <br />

          {record.refundStatus && (
            <Descriptions
              title="Refund Information"
              bordered
              size="small"
              column={2}
            >
              <Descriptions.Item label="Refund Status" span={2}>
                <strong>{record.refundStatus}</strong>
              </Descriptions.Item>

              <Descriptions.Item label="Refund Amount">
                {record.refundAmount
                  ? `${record.refundAmount.toLocaleString("vi-VN")} đ`
                  : "-"}
              </Descriptions.Item>

              <Descriptions.Item label="Refund Code">
                {record.refundCode ?? "-"}
              </Descriptions.Item>

              <Descriptions.Item label="Bank Name">
                {record.refundBankName ?? "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Account Number">
                {record.refundAccountNumber ?? "-"}
              </Descriptions.Item>

              <Descriptions.Item label="Account Holder" span={2}>
                {record.refundAccountHolder ?? "-"}
              </Descriptions.Item>

              <Descriptions.Item label="Refund Reason" span={2}>
                {record.refundReason ?? "-"}
              </Descriptions.Item>

              <Descriptions.Item label="Requested At" span={2}>
                {record.refundRequestedAt
                  ? new Date(record.refundRequestedAt).toLocaleString("vi-VN")
                  : "-"}
              </Descriptions.Item>

              {record.refundQrUrl &&
                record.refundStatus?.toLowerCase() !== "completed" && (
                  <Descriptions.Item label="Refund QR" span={2}>
                    <img
                      src={record.refundQrUrl}
                      alt="Refund QR"
                      style={{
                        width: 220,
                        height: "auto",
                        border: "1px solid #eee",
                      }}
                    />
                  </Descriptions.Item>
                )}
            </Descriptions>
          )}

          <h3>Items</h3>
          <Table<OrderItem>
            dataSource={record.items}
            rowKey="id"
            size="small"
            pagination={false}
          >
            <Table.Column<OrderItem>
              dataIndex="id"
              title="#"
              width={60}
            />
            <Table.Column<OrderItem>
              dataIndex="imageUrl"
              title="Image"
              render={(value: string | undefined) =>
                value ? (
                  <img
                    src={value}
                    alt=""
                    style={{ width: 40, height: 40, objectFit: "cover" }}
                  />
                ) : (
                  "-"
                )
              }
            />
            <Table.Column<OrderItem>
              dataIndex="productName"
              title="Product"
            />
            <Table.Column<OrderItem>
              dataIndex="color"
              title="Color"
            />
            <Table.Column<OrderItem>
              dataIndex="size"
              title="Size"
            />
            <Table.Column<OrderItem>
              dataIndex="unitPrice"
              title="Unit Price"
              render={(value: number) => formatMoney(value)}
            />
            <Table.Column<OrderItem>
              dataIndex="quantity"
              title="Qty"
              width={80}
            />
            <Table.Column<OrderItem>
              dataIndex="lineTotal"
              title="Total"
              render={(value: number) => formatMoney(value)}
            />
          </Table>
        </>
      )}
    </Show>
  );
};
