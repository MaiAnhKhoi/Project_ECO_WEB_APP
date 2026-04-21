// src/pages/orders/list.tsx
import {
  List,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import type { BaseRecord, HttpError, CrudFilters } from "@refinedev/core";
import {
  Table,
  Space,
  Tag,
  Button,
  Select,
  Input,
  Form,
  Popconfirm,
  message,
} from "antd";
import type { OrderSummary } from "../../type/order";
import orderApi from "../../service/orderApi";

const { Option } = Select;

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

// =========================
// RULE enable/disable nút
// =========================

// ✅ Confirm:
// - COD: chỉ khi PENDING (chưa thanh toán)
// - PayOS: chỉ khi PENDING và đã thanh toán (paid) - admin phải Confirm thủ công
const canConfirm = (order: OrderSummary) => {
  if (!order.status) return false;

  const status = order.status.toUpperCase();
  // Chỉ cho Confirm khi đơn đang PENDING
  if (status !== "PENDING") return false;

  const method = order.paymentMethod?.toUpperCase();
  const paymentStatus = order.paymentStatus?.toLowerCase();

  // PayOS: phải thanh toán xong (paid) mới được Confirm
  if (method === "PAYOS") {
    return paymentStatus === "paid";
  }

  // COD: PENDING và chưa thanh toán → được Confirm
  return paymentStatus === "unpaid" || !paymentStatus;
};

// ✅ Processing:
// - Cho cả COD và PayOS khi đã CONFIRMED
// - COD: sau khi Confirm → CONFIRMED → Processing → PROCESSING
// - PayOS: sau khi thanh toán → CONFIRMED → Processing → PROCESSING
const canProcessing = (order: OrderSummary) => {
  if (!order.status) return false;
  const status = order.status.toUpperCase();
  return status === "CONFIRMED";
};

// ✅ Completed (Done):
// - Chỉ khi đang PROCESSING (cả COD và PayOS)
const canComplete = (order: OrderSummary) => {
  if (!order.status) return false;
  const status = order.status.toUpperCase();
  return status === "PROCESSING";
};

// ✅ Cancel:
// - Cho phép hủy khi PENDING (cả chưa thanh toán và đã thanh toán)
// - Nếu đã thanh toán (paid) → sẽ yêu cầu thông tin hoàn tiền từ khách
// - Không cho hủy khi đã CONFIRMED hoặc PROCESSING
const canCancel = (order: OrderSummary) => {
  if (!order.status) return false;
  
  const status = order.status.toUpperCase();
  // Chỉ cho hủy khi PENDING (cả unpaid và paid đều được)
  return status === "PENDING";
};

type OrderSearchVars = {
  status?: string;
  paymentStatus?: string;
  keyword?: string;
};

export const OrderList = () => {
  const {
    tableProps,
    tableQuery,
    searchFormProps,
  } = useTable<OrderSummary, HttpError, OrderSearchVars>({
    resource: "orders",
    syncWithLocation: true,
    onSearch: (values) => {
      const filters: CrudFilters = [];

      if (values.status) {
        filters.push({
          field: "status",
          operator: "eq",
          value: values.status,
        });
      }
  console.log("pagination >>>", tableProps.pagination);
      if (values.paymentStatus) {
        filters.push({
          field: "paymentStatus",
          operator: "eq",
          value: values.paymentStatus,
        });
      }

      if (values.keyword) {
        filters.push({
          field: "keyword",
          operator: "contains",
          value: values.keyword,
        });
      }

      return filters;
    },
  });

  const reload = () => {
    tableQuery?.refetch();
  };

  const handleUpdateStatus = async (order: OrderSummary, newStatus: string) => {
    try {
      await orderApi.updateOrderStatus(order.orderId, {
        status: newStatus,
      });
      message.success(
        `Cập nhật trạng thái đơn ${order.orderCode} → ${newStatus}`,
      );
      reload();
    } catch (e: any) {
      message.error(
        e?.response?.data?.message || "Cập nhật trạng thái đơn thất bại",
      );
    }
  };

  const handleAdminCancel = async (order: OrderSummary) => {
    try {
      const reason = window.prompt(
        `Lý do hủy đơn ${order.orderCode}?`,
        "Admin hủy đơn",
      );
      await orderApi.adminCancelOrder(order.orderId, reason || undefined);
      message.success(`Đã hủy đơn ${order.orderCode}`);
      reload();
    } catch (e: any) {
      message.error(e?.response?.data?.message || "Hủy đơn thất bại");
    }
  };

  return (
    <List title="Orders">
      {/* 🔍 Bộ lọc dùng đúng searchFormProps của refine */}
      {/* <Form
        {...searchFormProps}
        layout="inline"
        style={{ marginBottom: 16 }}
      >
        <Form.Item name="status" label="Order Status">
          <Select
            allowClear
            placeholder="All"
            style={{ width: 180 }}
            onChange={() => searchFormProps?.form?.submit()}
          >
            <Option value="PENDING">Pending</Option>
            <Option value="CONFIRMED">Confirmed</Option>
            <Option value="PROCESSING">Processing</Option>
            <Option value="CANCEL_REQUESTED">Cancel requested</Option>
            <Option value="CANCELLED">Cancelled</Option>
            <Option value="COMPLETED">Completed</Option>
          </Select>
        </Form.Item>

        <Form.Item name="paymentStatus" label="Payment Status">
          <Select
            allowClear
            placeholder="All"
            style={{ width: 200 }}
            onChange={() => searchFormProps?.form?.submit()}
          >
            <Option value="unpaid">Unpaid</Option>
            <Option value="paid">Paid</Option>
            <Option value="failed">Failed</Option>
            <Option value="expired">Expired</Option>
            <Option value="refund_requested">Refund requested</Option>
            <Option value="refund_processing">Refund processing</Option>
            <Option value="refunded">Refunded</Option>
            <Option value="refund_info_required">Need refund info</Option>
          </Select>
        </Form.Item>

        <Form.Item name="keyword" label="Keyword">
          <Input.Search
            allowClear
            placeholder="Mã đơn / email / tên khách..."
            onSearch={() => searchFormProps?.form?.submit()}
            style={{ width: 260 }}
          />
        </Form.Item>
      </Form> */}

      <Table
        {...tableProps}
        rowKey="orderId"
      >
        <Table.Column<OrderSummary>
          dataIndex="orderId"
          title="ID"
          width={70}
        />
        <Table.Column<OrderSummary>
          dataIndex="orderCode"
          title="Order Code"
        />
        <Table.Column<OrderSummary>
          dataIndex="status"
          title="Order Status"
          render={renderOrderStatus}
        />
        <Table.Column<OrderSummary>
          dataIndex="paymentStatus"
          title="Payment Status"
          render={renderPaymentStatus}
        />
        {/* CỘT PHƯƠNG THỨC THANH TOÁN */}
        <Table.Column<OrderSummary>
          dataIndex="paymentMethod"
          title="Payment Method"
          render={renderPaymentMethod}
        />
        <Table.Column<OrderSummary>
          dataIndex="grandTotal"
          title="Total"
          render={(value: number) => formatMoney(value)}
        />
        <Table.Column<OrderSummary>
          dataIndex="createdAt"
          title="Created At"
          render={(value?: string | null) =>
            value ? (
              <span>{new Date(value).toLocaleString("vi-VN")}</span>
            ) : (
              "-"
            )
          }
        />

        <Table.Column<OrderSummary>
          title="Actions"
          dataIndex="actions"
          fixed="right"
          width={320}
          render={(_, record) => {
            // Ẩn tất cả nút nếu đã có yêu cầu hủy
            const isCancelRequested = record.status?.toUpperCase() === "CANCEL_REQUESTED";
            
            if (isCancelRequested) {
              return (
                <Space size="small">
                  <ShowButton
                    hideText
                    size="small"
                    recordItemId={record.orderId}
                  />
                </Space>
              );
            }

            return (
              <Space size="small">
                <ShowButton
                  hideText
                  size="small"
                  recordItemId={record.orderId}
                />

                {/* Confirm */}
                <Button
                  size="small"
                  disabled={!canConfirm(record)}
                  onClick={() => handleUpdateStatus(record, "CONFIRMED")}
                >
                  Confirm
                </Button>

                {/* Processing */}
                <Button
                  size="small"
                  disabled={!canProcessing(record)}
                  onClick={() => handleUpdateStatus(record, "PROCESSING")}
                >
                  Processing
                </Button>

                {/* Completed */}
                <Button
                  size="small"
                  disabled={!canComplete(record)}
                  onClick={() => handleUpdateStatus(record, "COMPLETED")}
                >
                  Done
                </Button>

                {/* Cancel */}
                <Popconfirm
                  title={`Hủy đơn ${record.orderCode}?`}
                  onConfirm={() => handleAdminCancel(record)}
                  okText="Yes"
                  cancelText="No"
                  disabled={!canCancel(record)}
                >
                  <Button
                    size="small"
                    danger
                    disabled={!canCancel(record)}
                  >
                    Cancel
                  </Button>
                </Popconfirm>
              </Space>
            );
          }}
        />
      </Table>
    </List>
  );
};
