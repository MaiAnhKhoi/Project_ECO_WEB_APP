import { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Typography,
  Spin,
  Space,
  Tag,
  Tabs,
} from "antd";
import {
  UserOutlined,
  ShoppingOutlined,
  DollarOutlined,
  ProductOutlined,
  RiseOutlined,
  TrophyOutlined,
  LineChartOutlined,
  InboxOutlined,
  FundOutlined,
  CarOutlined,
} from "@ant-design/icons";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  LabelList,
} from "recharts";
import statisticsApi, {
  StatisticsResponse,
} from "../../service/statisticsApi";
import { RequireRoles } from "../../components/RequireRoles";

const { Title, Text } = Typography;

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatNumber = (num: number) => {
  return new Intl.NumberFormat("vi-VN").format(num);
};

// Dùng cho trục Y của chart để tránh tràn chữ (triệu / tỷ)
const formatShortCurrency = (value: number) => {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)} tỷ`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)} triệu`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(0)}k`;
  }
  return String(value);
};

const formatDate = (dateStr: string) => {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
  } catch {
    return dateStr;
  }
};

export const StatisticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<StatisticsResponse | null>(null);
  const [activeTab, setActiveTab] = useState("7days");

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const response = await statisticsApi.getStatistics();
      setStatistics(response.data.data);
      // Debug: Log category performance data
      if (response.data.data?.categoryPerformance) {
        console.log("📊 Category Performance Data:", response.data.data.categoryPerformance);
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!statistics) {
    return <div>No data available</div>;
  }

  // Prepare chart data
  const getChartData = () => {
    if (!statistics.detailed) return [];

    switch (activeTab) {
      case "7days":
        return statistics.detailed.last7Days;
      case "30days":
        return statistics.detailed.last30Days;
      case "12months":
        return statistics.detailed.last12Months;
      case "52weeks":
        return statistics.detailed.last52Weeks;
      default:
        return statistics.detailed.last7Days;
    }
  };

  const chartData = getChartData();

  // Order Status Pie Chart Data
  const orderStatusData = [
    { name: "Chờ xử lý", value: statistics.orders.pending, color: "#faad14" },
    { name: "Đã xác nhận", value: statistics.orders.confirmed, color: "#1890ff" },
    { name: "Đã hoàn thành", value: statistics.orders.completed, color: "#52c41a" },
    { name: "Đã hủy", value: statistics.orders.cancelled, color: "#f5222d" },
  ];

  // Top Products Chart Data
  const topProductsChartData = statistics.topProducts
    .slice(0, 5)
    .map((p) => ({
      name:
        p.productName.length > 15
          ? p.productName.substring(0, 15) + "..."
          : p.productName,
      sold: p.soldCount,
      views: p.viewCount,
    }));

  // Revenue comparison data
  const revenueComparisonData = [
    { period: "Hôm nay", revenue: statistics.revenue.today },
    { period: "Tuần này", revenue: statistics.revenue.thisWeek },
    { period: "Tháng này", revenue: statistics.revenue.thisMonth },
    { period: "Năm nay", revenue: statistics.revenue.thisYear },
  ];

  // Orders comparison data
  const ordersComparisonData = [
    { period: "Hôm nay", orders: statistics.orders.today },
    { period: "Tuần này", orders: statistics.orders.thisWeek },
    { period: "Tháng này", orders: statistics.orders.thisMonth },
  ];

  const topProductsColumns = [
    {
      title: "STT",
      key: "index",
      render: (_: any, __: any, index: number) => index + 1,
      width: 60,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Đã bán",
      dataIndex: "soldCount",
      key: "soldCount",
      render: (value: number) => formatNumber(value),
      align: "right" as const,
    },
    {
      title: "Lượt xem",
      dataIndex: "viewCount",
      key: "viewCount",
      render: (value: number) => formatNumber(value),
      align: "right" as const,
    },
  ];

  const topCustomersColumns = [
    {
      title: "STT",
      key: "index",
      render: (_: any, __: any, index: number) => index + 1,
      width: 60,
    },
    {
      title: "Tên khách hàng",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Email",
      dataIndex: "userEmail",
      key: "userEmail",
    },
    {
      title: "Số đơn hàng",
      dataIndex: "orderCount",
      key: "orderCount",
      render: (value: number) => formatNumber(value),
      align: "right" as const,
    },
    {
      title: "Tổng chi tiêu",
      dataIndex: "totalSpent",
      key: "totalSpent",
      render: (value: number) => formatCurrency(value),
      align: "right" as const,
    },
  ];

  // Category performance chart data - sort by revenue descending
  const categoryPerformanceData =
    statistics.categoryPerformance
      ?.map((c) => {
        // Ensure revenue is a number (handle BigDecimal conversion)
        const revenueValue = typeof c.revenue === 'number' 
          ? c.revenue 
          : (typeof c.revenue === 'string' ? parseFloat(c.revenue) : 0);
        
        return {
          name:
            c.categoryName.length > 20
              ? c.categoryName.substring(0, 20) + "..."
              : c.categoryName,
          fullName: c.categoryName,
          revenue: revenueValue,
          unitsSold: c.unitsSold || 0,
        };
      })
      .filter((item) => item.revenue > 0) // Only show categories with revenue
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5) ?? [];
  
  // Debug: Log processed chart data
  if (categoryPerformanceData.length > 0) {
    console.log("📊 Processed Category Chart Data:", categoryPerformanceData);
  }

  const { inventory, profit, returns, logistics } = statistics;

  return (
    <RequireRoles allowedRoles={["ADMIN"]}>
      <div
        style={{
          padding: "24px",
          background: "#f0f2f5",
          minHeight: "100vh",
        }}
      >
        <Title level={2} style={{ marginBottom: 24 }}>
          <LineChartOutlined /> Dashboard Thống Kê
        </Title>

        {/* ========== PHẦN 1: TỔNG QUAN ========== */}
        <Card style={{ marginBottom: 24 }} title="📊 Tổng Quan Hệ Thống">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Tổng Người Dùng"
                  value={statistics.overview.totalUsers}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: "#1890ff" }}
                />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {statistics.users.active} hoạt động
                </Text>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Tổng Sản Phẩm"
                  value={statistics.overview.totalProducts}
                  prefix={<ProductOutlined />}
                  valueStyle={{ color: "#52c41a" }}
                />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {statistics.products.active} đang bán,{" "}
                  {inventory?.totalSkus ?? statistics.overview.totalSkus} SKU
                </Text>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Tổng Đơn Hàng"
                  value={statistics.overview.totalOrders}
                  prefix={<ShoppingOutlined />}
                  valueStyle={{ color: "#faad14" }}
                />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {statistics.orders.completed} đã hoàn thành
                </Text>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Tổng Doanh Thu"
                  value={formatCurrency(statistics.overview.totalRevenue)}
                  prefix={<DollarOutlined />}
                  valueStyle={{ color: "#f5222d" }}
                />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Tất cả thời gian
                </Text>
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col xs={24} sm={12} lg={6}>
              <Card size="small">
                <Statistic
                  title="Tổng Số Lượng Bán"
                  value={statistics.overview.totalUnitsSold}
                  prefix={<RiseOutlined />}
                />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Tổng sold của tất cả sản phẩm
                </Text>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card size="small">
                <Statistic
                  title="Tổng Lượt Xem"
                  value={statistics.overview.totalProductViews}
                  prefix={<LineChartOutlined />}
                />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Lượt xem tất cả sản phẩm
                </Text>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card size="small">
                <Statistic
                  title="Tổng Tồn Kho"
                  value={statistics.overview.totalUnitsInStock}
                  prefix={<InboxOutlined />}
                />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Sản phẩm trong kho hiện tại
                </Text>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card size="small">
                <Statistic
                  title="Lợi Nhuận Gộp Tổng"
                  value={profit ? formatCurrency(profit.totalGrossProfit) : "–"}
                  prefix={<FundOutlined />}
                  valueStyle={{ color: "#722ed1" }}
                />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Biên lợi nhuận: {profit?.totalGrossMargin ?? 0}%
                </Text>
              </Card>
            </Col>
          </Row>
        </Card>

        {/* ========== PHẦN 2: THỐNG KÊ HÔM NAY & TUẦN NÀY ========== */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Đơn Hàng Hôm Nay"
                value={statistics.overview.todayOrders}
                prefix={<RiseOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Doanh Thu Hôm Nay"
                value={formatCurrency(statistics.overview.todayRevenue)}
                prefix={<DollarOutlined />}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Đơn Hàng Tuần Này"
                value={statistics.overview.thisWeekOrders}
                prefix={<RiseOutlined />}
                valueStyle={{ color: "#faad14" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Doanh Thu Tuần Này"
                value={formatCurrency(statistics.overview.thisWeekRevenue)}
                prefix={<DollarOutlined />}
                valueStyle={{ color: "#f5222d" }}
              />
            </Card>
          </Col>
        </Row>

        {/* ========== PHẦN 3: XU HƯỚNG THEO THỜI GIAN ========== */}
        <Card
          style={{ marginBottom: 24 }}
          title={
            <Space>
              <LineChartOutlined />
              <span>Xu Hướng Chi Tiết</span>
            </Space>
          }
        >
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={[
              {
                key: "7days",
                label: "7 Ngày Qua",
              },
              {
                key: "30days",
                label: "30 Ngày Qua",
              },
              {
                key: "12months",
                label: "12 Tháng Qua",
              },
              {
                key: "52weeks",
                label: "52 Tuần Qua",
              },
            ]}
          />

          {chartData && chartData.length > 0 ? (
            <Row gutter={[16, 16]}>
              {/* Doanh Thu & Đơn Hàng Composed Chart */}
              <Col xs={24} lg={16}>
                <Card title="Doanh Thu & Đơn Hàng" size="small">
                  <ResponsiveContainer width="100%" height={350}>
                    <ComposedChart
                      data={chartData}
                      margin={{ top: 20, right: 20, bottom: 40, left: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={formatDate}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip
                        formatter={(value: any, name: string) => {
                          if (name === "revenue") {
                            return formatCurrency(value);
                          }
                          return formatNumber(value);
                        }}
                      />
                      <Legend />
                      <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="revenue"
                        fill="#1890ff"
                        fillOpacity={0.6}
                        stroke="#1890ff"
                        name="Doanh Thu"
                      />
                      <Bar
                        yAxisId="right"
                        dataKey="orders"
                        fill="#52c41a"
                        name="Đơn Hàng"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </Card>
              </Col>

              {/* Đơn Hàng Line Chart */}
              <Col xs={24} lg={8}>
                <Card title="Xu Hướng Đơn Hàng" size="small">
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart
                      data={chartData}
                      margin={{ top: 20, right: 20, bottom: 40, left: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={formatDate}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis />
                      <Tooltip formatter={(value) => formatNumber(value as number)} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="orders"
                        stroke="#52c41a"
                        strokeWidth={2}
                        name="Đơn Hàng"
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
            </Row>
          ) : (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <Text type="secondary">Chưa có dữ liệu</Text>
            </div>
          )}
        </Card>

        {/* ========== PHẦN 4: SO SÁNH & PHÂN TÍCH ========== */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          {/* Revenue Comparison */}
          <Col xs={24} lg={12}>
            <Card title="So Sánh Doanh Thu">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={revenueComparisonData}
                  margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis
                    tickFormatter={formatShortCurrency}
                    width={70}
                  />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Legend />
                  <Bar dataKey="revenue" fill="#1890ff" name="Doanh Thu" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>

          {/* Order Status Pie Chart */}
          <Col xs={24} lg={12}>
            <Card title="Trạng Thái Đơn Hàng">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>

        {/* ========== PHẦN 5: TOP SẢN PHẨM & KHÁCH HÀNG ========== */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          {/* Top Products Bar Chart */}
          <Col xs={24} lg={12}>
            <Card
              title={
                <Space>
                  <TrophyOutlined />
                  <span>Top 5 Sản Phẩm Bán Chạy</span>
                </Space>
              }
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={topProductsChartData}
                  layout="vertical"
                  margin={{ top: 20, right: 20, bottom: 20, left: 80 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={120} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sold" fill="#1890ff" name="Đã bán" />
                  <Bar dataKey="views" fill="#52c41a" name="Lượt xem" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>

          {/* Orders Comparison */}
          <Col xs={24} lg={12}>
            <Card title="So Sánh Đơn Hàng">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={ordersComparisonData}
                  margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: any) => [
                      `${formatNumber(value)} đơn hàng`,
                      "Số Đơn Hàng",
                    ]}
                    labelFormatter={(label) => `Thời gian: ${label}`}
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      padding: "8px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    }}
                    cursor={{ fill: "rgba(250, 173, 20, 0.1)" }}
                  />
                  <Legend />
                  <Bar
                    dataKey="orders"
                    fill="#faad14"
                    name="Số Đơn Hàng"
                    radius={[4, 4, 0, 0]}
                  >
                    {ordersComparisonData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.orders > 0
                            ? "#faad14"
                            : entry.orders === 0
                            ? "#d9d9d9"
                            : "#faad14"
                        }
                      />
                    ))}
                    <LabelList
                      dataKey="orders"
                      position="top"
                      formatter={(value: any) =>
                        value && value > 0 ? formatNumber(value) : ""
                      }
                      style={{ fill: "#666", fontSize: "12px", fontWeight: 500 }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>

        {/* ========== PHẦN 6: BẢNG TOP ========== */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card
              title={
                <Space>
                  <TrophyOutlined />
                  <span>Top Sản Phẩm</span>
                </Space>
              }
            >
              <Table
                dataSource={statistics.topProducts}
                columns={topProductsColumns}
                rowKey="productId"
                pagination={false}
                size="small"
              />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card
              title={
                <Space>
                  <TrophyOutlined />
                  <span>Top Khách Hàng</span>
                </Space>
              }
            >
              {statistics.topCustomers && statistics.topCustomers.length > 0 ? (
                <Table
                  dataSource={statistics.topCustomers}
                  columns={topCustomersColumns}
                  rowKey="userId"
                  pagination={false}
                  size="small"
                />
              ) : (
                <div style={{ textAlign: "center", padding: "20px" }}>
                  <Text type="secondary">Chưa có dữ liệu</Text>
                </div>
              )}
            </Card>
          </Col>
        </Row>

        {/* ========== PHẦN 7: INVENTORY, RETURNS, LOGISTICS, CATEGORY ========== */}
        <Card style={{ marginTop: 24 }} title="📈 Thống Kê Chi Tiết">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={6}>
              <Card title="Doanh Thu Theo Thời Gian" size="small">
                <Space direction="vertical" style={{ width: "100%" }} size="large">
                  <Statistic
                    title="Hôm nay"
                    value={formatCurrency(statistics.revenue.today)}
                    prefix={<DollarOutlined />}
                  />
                  <Statistic
                    title="Tuần này"
                    value={formatCurrency(statistics.revenue.thisWeek)}
                    prefix={<DollarOutlined />}
                  />
                  <Statistic
                    title="Tháng này"
                    value={formatCurrency(statistics.revenue.thisMonth)}
                    prefix={<DollarOutlined />}
                  />
                  <Statistic
                    title="Năm nay"
                    value={formatCurrency(statistics.revenue.thisYear)}
                    prefix={<DollarOutlined />}
                  />
                </Space>
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card title="Lợi Nhuận" size="small">
                <Space direction="vertical" style={{ width: "100%" }} size="large">
                  <Statistic
                    title="Lợi nhuận gộp tổng"
                    value={
                      profit ? formatCurrency(profit.totalGrossProfit) : "–"
                    }
                    prefix={<FundOutlined />}
                  />
                  <Statistic
                    title="Biên lợi nhuận gộp"
                    value={profit ? `${profit.totalGrossMargin}%` : "–"}
                  />
                  <Statistic
                    title="Lợi nhuận hôm nay"
                    value={
                      profit ? formatCurrency(profit.todayProfit) : "–"
                    }
                  />
                  <Statistic
                    title="Lợi nhuận tháng này"
                    value={
                      profit ? formatCurrency(profit.thisMonthProfit) : "–"
                    }
                  />
                </Space>
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card title="Tồn Kho" size="small">
                <Space direction="vertical" style={{ width: "100%" }} size="large">
                  <Statistic
                    title="Giá trị vốn tồn kho"
                    value={
                      inventory
                        ? formatCurrency(inventory.inventoryCostValue)
                        : "–"
                    }
                    prefix={<InboxOutlined />}
                  />
                  <Statistic
                    title="Giá trị bán ra (nếu xả hết)"
                    value={
                      inventory
                        ? formatCurrency(inventory.inventoryRetailValue)
                        : "–"
                    }
                  />
                  <Statistic
                    title="Lợi nhuận tiềm năng"
                    value={
                      inventory
                        ? formatCurrency(inventory.inventoryPotentialProfit)
                        : "–"
                    }
                  />
                  <Statistic
                    title="SKU hết / sắp hết"
                    value={
                      inventory
                        ? `${inventory.outOfStockVariants} hết hàng, ${inventory.lowStockVariants} sắp hết`
                        : "–"
                    }
                  />
                </Space>
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card title="Hủy Đơn & Vận Hành" size="small">
                <Space direction="vertical" style={{ width: "100%" }} size="large">
                  <Statistic
                    title="Tỷ lệ hủy đơn"
                    value={
                      returns ? `${returns.cancelRatePercent.toFixed(2)}%` : "–"
                    }
                    prefix={<ShoppingOutlined />}
                  />
                  <Statistic
                    title="Doanh thu mất do hủy"
                    value={
                      returns
                        ? formatCurrency(returns.cancelledRevenue)
                        : "–"
                    }
                  />
                  <Statistic
                    title="Tỷ lệ giao thành công"
                    value={
                      logistics
                        ? `${logistics.deliverySuccessRate.toFixed(2)}%`
                        : "–"
                    }
                    prefix={<CarOutlined />}
                  />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Đơn giao thành công / thất bại:{" "}
                    {logistics
                      ? `${logistics.deliveredOrders}/${logistics.failedDeliveryOrders}`
                      : "–"}
                  </Text>
                </Space>
              </Card>
            </Col>
          </Row>

          {/* Category performance chart */}
          {categoryPerformanceData && categoryPerformanceData.length > 0 && (
            <Card
              style={{ marginTop: 16 }}
              size="small"
              title="Hiệu Suất Danh Mục (Theo Doanh Thu)"
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={categoryPerformanceData}
                  layout="vertical"
                  margin={{ top: 20, right: 30, bottom: 20, left: 100 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    type="number"
                    tickFormatter={formatShortCurrency}
                    width={80}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={100}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(value: any, name: string) => {
                      if (name === "revenue") {
                        return [
                          formatCurrency(value),
                          "Doanh Thu",
                        ];
                      }
                      return [value, name];
                    }}
                    labelFormatter={(label, payload) => {
                      const fullName =
                        payload?.[0]?.payload?.fullName || label;
                      return `Danh mục: ${fullName}`;
                    }}
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      padding: "8px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    }}
                    cursor={{ fill: "rgba(24, 144, 255, 0.1)" }}
                  />
                  <Legend />
                  <Bar
                    dataKey="revenue"
                    fill="#1890ff"
                    name="Doanh Thu"
                    radius={[0, 4, 4, 0]}
                  >
                    {categoryPerformanceData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.revenue > 0
                            ? "#1890ff"
                            : entry.revenue === 0
                            ? "#d9d9d9"
                            : "#1890ff"
                        }
                      />
                    ))}
                    <LabelList
                      dataKey="revenue"
                      position="right"
                      formatter={(value: any) => {
                        if (!value || value === 0) return "";
                        return formatShortCurrency(value);
                      }}
                      style={{ fill: "#666", fontSize: "11px", fontWeight: 500 }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          )}
        </Card>
      </div>
    </RequireRoles>
  );
};
