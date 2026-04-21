// src/service/statisticsApi.ts
import axiosAdmin from "./axiosAdmin";

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

/* ================== OVERVIEW ================== */
export interface OverviewStatistics {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;

  todayOrders: number;
  todayRevenue: number;

  thisWeekOrders: number;
  thisWeekRevenue: number;

  thisMonthOrders: number;
  thisMonthRevenue: number;

  // NEW: tổng bán & view
  totalUnitsSold: number;
  totalProductViews: number;

  // NEW: tồn kho tổng quát
  totalSkus: number;
  totalUnitsInStock: number;
}

/* ================== REVENUE ================== */
export interface RevenueStatistics {
  today: number;
  thisWeek: number;
  thisMonth: number;
  thisYear: number;
  total: number;
}

/* ================== ORDERS ================== */
export interface OrderStatistics {
  total: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
  pending: number;
  confirmed: number;
  cancelled: number;
  completed: number;
}

/* ================== PRODUCTS ================== */
export interface ProductStatistics {
  total: number;
  active: number;
  inactive: number;
  outOfStock: number;
  lowStock: number;
}

/* ================== USERS ================== */
export interface UserStatistics {
  total: number;
  active: number;
  inactive: number;
  todayRegistered: number;
  thisWeekRegistered: number;
  thisMonthRegistered: number;
}

/* ================== TOP PRODUCT / CUSTOMER ================== */
export interface TopProductDto {
  productId: number;
  productName: string;
  productSlug: string;
  soldCount: number;
  revenue: number;
  viewCount: number;
}

export interface TopCustomerDto {
  userId: number;
  userName: string | null;
  userEmail: string | null;
  orderCount: number;
  totalSpent: number;
}

/* ================== TIME SERIES ================== */
export interface TimeSeriesData {
  date: string;
  orders: number;
  revenue: number;
  users: number;
}

export interface DetailedStatistics {
  last7Days: TimeSeriesData[];
  last30Days: TimeSeriesData[];
  last12Months: TimeSeriesData[];
  last52Weeks: TimeSeriesData[];
}

/* ================== INVENTORY ================== */
export interface InventoryStatistics {
  totalProducts: number;
  totalSkus: number;
  totalUnitsInStock: number;
  outOfStockVariants: number;
  lowStockVariants: number;
  inventoryCostValue: number;
  inventoryRetailValue: number;
  inventoryPotentialProfit: number;
}

/* ================== PROFIT / COGS ================== */
export interface ProfitStatistics {
  totalRevenue: number;
  totalCogs: number;
  totalGrossProfit: number;
  totalGrossMargin: number; // %

  todayRevenue: number;
  todayCogs: number;
  todayProfit: number;

  thisMonthRevenue: number;
  thisMonthCogs: number;
  thisMonthProfit: number;
}

/* ================== CATEGORY PERFORMANCE ================== */
export interface CategoryPerformanceDto {
  categoryId: number;
  categoryName: string;
  productCount: number;
  unitsSold: number;
  revenue: number;
}

/* ================== RETURNS / CANCELLATIONS ================== */
export interface ReasonCountDto {
  reason: string;
  count: number;
}

export interface ReturnStatistics {
  totalOrders: number;
  cancelledOrders: number;
  cancelledRevenue: number;
  cancelRatePercent: number;
  topCancelReasons: ReasonCountDto[];
}

/* ================== LOGISTICS ================== */
export interface StatusCountDto {
  status: string;
  count: number;
}

export interface LogisticsStatistics {
  totalOrdersWithShipping: number;
  unfulfilledOrders: number;
  shippingOrders: number;
  deliveredOrders: number;
  failedDeliveryOrders: number;
  deliverySuccessRate: number; // %
  shippingStatusBreakdown: StatusCountDto[];
}

/* ================== ROOT RESPONSE ================== */
export interface StatisticsResponse {
  overview: OverviewStatistics;
  revenue: RevenueStatistics;
  orders: OrderStatistics;
  products: ProductStatistics;
  users: UserStatistics;
  topProducts: TopProductDto[];
  topCustomers: TopCustomerDto[];
  detailed: DetailedStatistics;

  // NEW
  inventory: InventoryStatistics;
  profit: ProfitStatistics;
  categoryPerformance: CategoryPerformanceDto[];
  returns: ReturnStatistics;
  logistics: LogisticsStatistics;
}

const statisticsApi = {

getStatistics() {
  return axiosAdmin
    .get<ApiResponse<StatisticsResponse>>("/admin/statistics")
    .then((res) => {
      console.log("📊 API /admin/statistics response:", res.data);
      return res; // quan trọng: trả lại res để FE vẫn hoạt động
    });
},

};

export default statisticsApi;
