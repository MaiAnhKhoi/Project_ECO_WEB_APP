package com.tlcn.fashion_api.service.statistics;

import com.tlcn.fashion_api.common.enums.UserStatus;
import com.tlcn.fashion_api.dto.response.statistics.*;
import com.tlcn.fashion_api.entity.order.Order;
import com.tlcn.fashion_api.entity.order.OrderItem;
import com.tlcn.fashion_api.entity.product.Category;
import com.tlcn.fashion_api.entity.product.Product;
import com.tlcn.fashion_api.entity.product.ProductVariant;
import com.tlcn.fashion_api.entity.product.Stock;
import com.tlcn.fashion_api.entity.user.User;
import com.tlcn.fashion_api.repository.category.CategoryRepository;
import com.tlcn.fashion_api.repository.order.OrderItemRepository;
import com.tlcn.fashion_api.repository.order.OrderRepository;
import com.tlcn.fashion_api.repository.product.ProductCategoryRepository;
import com.tlcn.fashion_api.repository.product.ProductRepository;
import com.tlcn.fashion_api.repository.product.ProductVariantRepository;
import com.tlcn.fashion_api.repository.stock.StockRepository;
import com.tlcn.fashion_api.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class StatisticsServiceImpl implements StatisticsService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductVariantRepository productVariantRepository;
    private final StockRepository stockRepository;
    private final ProductCategoryRepository productCategoryRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public StatisticsResponse getStatistics() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfToday = LocalDateTime.of(LocalDate.now(), LocalTime.MIN);
        LocalDateTime startOfWeek = now.minusDays(now.getDayOfWeek().getValue() - 1).with(LocalTime.MIN);
        LocalDateTime startOfMonth = now.withDayOfMonth(1).with(LocalTime.MIN);
        LocalDateTime startOfYear = now.withDayOfYear(1).with(LocalTime.MIN);

        // ===== USER =====
        Long totalUsers = userRepository.count();
        Long activeUsers = userRepository.countByStatus(UserStatus.ACTIVE);
        Long inactiveUsers = totalUsers - activeUsers;
        Long todayRegistered = userRepository.countByCreatedAtAfter(startOfToday);
        Long thisWeekRegistered = userRepository.countByCreatedAtAfter(startOfWeek);
        Long thisMonthRegistered = userRepository.countByCreatedAtAfter(startOfMonth);

        UserStatistics userStats = UserStatistics.builder()
                .total(totalUsers)
                .active(activeUsers)
                .inactive(inactiveUsers)
                .todayRegistered(todayRegistered)
                .thisWeekRegistered(thisWeekRegistered)
                .thisMonthRegistered(thisMonthRegistered)
                .build();

        // ===== PRODUCT BASE =====
        Long totalProducts = productRepository.count();
        Long activeProducts = productRepository.countByStatus("active");
        Long inactiveProducts = totalProducts - activeProducts;

        List<Product> allProducts = productRepository.findAll();

        long totalUnitsSold = allProducts.stream()
                .mapToLong(p -> p.getSoldCount() != null ? p.getSoldCount() : 0L)
                .sum();

        long totalProductViews = allProducts.stream()
                .mapToLong(p -> p.getViewCount() != null ? p.getViewCount() : 0L)
                .sum();

        // Tồn kho chi tiết (dùng Stock + ProductVariant)
        InventoryStatistics inventoryStats = calculateInventoryStatistics();

        ProductStatistics productStats = ProductStatistics.builder()
                .total(totalProducts)
                .active(activeProducts)
                .inactive(inactiveProducts)
                .outOfStock(inventoryStats.getOutOfStockVariants())
                .lowStock(inventoryStats.getLowStockVariants())
                .build();

        // ===== ORDERS =====
        Long totalOrders = orderRepository.count();
        Long todayOrders = orderRepository.countByCreatedAtAfter(startOfToday);
        Long thisWeekOrders = orderRepository.countByCreatedAtAfter(startOfWeek);
        Long thisMonthOrders = orderRepository.countByCreatedAtAfter(startOfMonth);
        Long pendingOrders = orderRepository.countByStatus("pending");
        Long confirmedOrders = orderRepository.countByStatus("confirmed");
        Long cancelledOrders = orderRepository.countByStatus("cancelled");
        Long completedOrders = orderRepository.countByStatus("completed");

        OrderStatistics orderStats = OrderStatistics.builder()
                .total(totalOrders)
                .today(todayOrders)
                .thisWeek(thisWeekOrders)
                .thisMonth(thisMonthOrders)
                .pending(pendingOrders)
                .confirmed(confirmedOrders)
                .cancelled(cancelledOrders)
                .completed(completedOrders)
                .build();

        // ===== REVENUE =====
        List<String> completedStatuses = List.of("confirmed", "completed");
        BigDecimal totalRevenue = orZero(orderRepository.sumGrandTotalByStatus(completedStatuses));
        BigDecimal todayRevenue = orZero(orderRepository.sumGrandTotalByStatusAndCreatedAtAfter(completedStatuses, startOfToday));
        BigDecimal thisWeekRevenue = orZero(orderRepository.sumGrandTotalByStatusAndCreatedAtAfter(completedStatuses, startOfWeek));
        BigDecimal thisMonthRevenue = orZero(orderRepository.sumGrandTotalByStatusAndCreatedAtAfter(completedStatuses, startOfMonth));
        BigDecimal thisYearRevenue = orZero(orderRepository.sumGrandTotalByStatusAndCreatedAtAfter(completedStatuses, startOfYear));

        RevenueStatistics revenueStats = RevenueStatistics.builder()
                .today(todayRevenue)
                .thisWeek(thisWeekRevenue)
                .thisMonth(thisMonthRevenue)
                .thisYear(thisYearRevenue)
                .total(totalRevenue)
                .build();

        // ===== PROFIT / COGS =====
        ProfitStatistics profitStats = calculateProfitStatistics(completedStatuses, startOfToday, startOfMonth);


        // ===== RETURNS / CANCELLATIONS =====
        ReturnStatistics returnStats = calculateReturnStatistics();

// ===== LOGISTICS =====
        LogisticsStatistics logisticsStats = calculateLogisticsStatistics();
        // ===== OVERVIEW CARD =====
        OverviewStatistics overview = OverviewStatistics.builder()
                .totalUsers(totalUsers)
                .totalProducts(totalProducts)
                .totalOrders(totalOrders)
                .totalRevenue(totalRevenue)
                .todayOrders(todayOrders)
                .todayRevenue(todayRevenue)
                .thisWeekOrders(thisWeekOrders)
                .thisWeekRevenue(thisWeekRevenue)
                .thisMonthOrders(thisMonthOrders)
                .thisMonthRevenue(thisMonthRevenue)
                .totalUnitsSold(totalUnitsSold)
                .totalProductViews(totalProductViews)
                .totalSkus(inventoryStats.getTotalSkus())
                .totalUnitsInStock(inventoryStats.getTotalUnitsInStock())
                .build();

        // ===== TOP PRODUCTS / CUSTOMERS =====
        List<TopProductDto> topProducts = getTopProducts(10);
        List<TopCustomerDto> topCustomers = getTopCustomers(10);

        // ===== CATEGORY PERFORMANCE =====
        List<CategoryPerformanceDto> categoryPerformance = getCategoryPerformance();

        // ===== TIME SERIES =====
        DetailedStatistics detailed = getDetailedStatistics();

        return StatisticsResponse.builder()
                .overview(overview)
                .revenue(revenueStats)
                .orders(orderStats)
                .products(productStats)
                .users(userStats)
                .topProducts(topProducts)
                .topCustomers(topCustomers)
                .detailed(detailed)
                .inventory(inventoryStats)
                .profit(profitStats)
                .categoryPerformance(categoryPerformance)
                .returns(returnStats)
                .logistics(logisticsStats)
                .build();
    }
    private ReturnStatistics calculateReturnStatistics() {
        List<Order> allOrders = orderRepository.findAll();
        long totalOrders = allOrders.size();

        // Đơn hủy (status = cancelled)
        List<Order> cancelledOrders = allOrders.stream()
                .filter(o -> o.getStatus() != null &&
                        "cancelled".equalsIgnoreCase(o.getStatus()))
                .toList();

        long cancelledCount = cancelledOrders.size();

        // Doanh thu bị mất do hủy (grand_total của đơn cancelled)
        BigDecimal cancelledRevenue = cancelledOrders.stream()
                .map(o -> orZero(o.getGrandTotal()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Tỷ lệ hủy %
        BigDecimal cancelRatePercent = BigDecimal.ZERO;
        if (totalOrders > 0) {
            cancelRatePercent = BigDecimal.valueOf(cancelledCount)
                    .multiply(BigDecimal.valueOf(100))
                    .divide(BigDecimal.valueOf(totalOrders), 2, RoundingMode.HALF_UP);
        }

        // Thống kê lý do hủy
        Map<String, Long> reasonCounts = cancelledOrders.stream()
                .collect(Collectors.groupingBy(
                        o -> {
                            String reason = o.getCancelReason();
                            if (reason == null || reason.isBlank()) {
                                return "Khác";
                            }
                            return reason.trim();
                        },
                        Collectors.counting()
                ));

        List<ReasonCountDto> topReasons = reasonCounts.entrySet().stream()
                .map(e -> ReasonCountDto.builder()
                        .reason(e.getKey())
                        .count(e.getValue())
                        .build())
                .sorted((a, b) -> Long.compare(b.getCount(), a.getCount()))
                .limit(5) // lấy top 5 lý do hủy
                .collect(Collectors.toList());

        return ReturnStatistics.builder()
                .totalOrders(totalOrders)
                .cancelledOrders(cancelledCount)
                .cancelledRevenue(cancelledRevenue)
                .cancelRatePercent(cancelRatePercent)
                .topCancelReasons(topReasons)
                .build();
    }

    private LogisticsStatistics calculateLogisticsStatistics() {
        List<Order> allOrders = orderRepository.findAll();

        if (allOrders.isEmpty()) {
            return LogisticsStatistics.builder()
                    .totalOrdersWithShipping(0L)
                    .unfulfilledOrders(0L)
                    .shippingOrders(0L)
                    .deliveredOrders(0L)
                    .failedDeliveryOrders(0L)
                    .deliverySuccessRate(BigDecimal.ZERO)
                    .shippingStatusBreakdown(Collections.emptyList())
                    .build();
        }

        // Gom theo shipping_status (lowercase, null -> "unfulfilled")
        Map<String, Long> shippingStatusCounts = allOrders.stream()
                .map(o -> {
                    String st = null;
                    try {
                        st = o.getShippingStatus();
                    } catch (Exception e) {
                        // nếu entity chưa có field này thì cần thêm vào entity Order
                    }
                    if (st == null || st.isBlank()) return "unfulfilled";
                    return st.toLowerCase();
                })
                .collect(Collectors.groupingBy(s -> s, Collectors.counting()));

        long unfulfilled = shippingStatusCounts.getOrDefault("unfulfilled", 0L);
        long shipping = shippingStatusCounts.getOrDefault("shipping", 0L)
                + shippingStatusCounts.getOrDefault("shipped", 0L);
        long delivered = shippingStatusCounts.getOrDefault("delivered", 0L);
        long failed = shippingStatusCounts.getOrDefault("failed", 0L);

        long totalWithShipping = allOrders.stream()
                .filter(o -> {
                    try {
                        String st = o.getShippingStatus();
                        return st != null && !st.isBlank();
                    } catch (Exception e) {
                        return false;
                    }
                })
                .count();

        // Tỷ lệ giao thành công = delivered / (delivered + failed)
        BigDecimal deliverySuccessRate = BigDecimal.ZERO;
        long successBase = delivered + failed;
        if (successBase > 0) {
            deliverySuccessRate = BigDecimal.valueOf(delivered)
                    .multiply(BigDecimal.valueOf(100))
                    .divide(BigDecimal.valueOf(successBase), 2, RoundingMode.HALF_UP);
        }

        List<StatusCountDto> breakdown = shippingStatusCounts.entrySet().stream()
                .map(e -> StatusCountDto.builder()
                        .status(e.getKey())
                        .count(e.getValue())
                        .build())
                .sorted((a, b) -> Long.compare(b.getCount(), a.getCount()))
                .collect(Collectors.toList());

        return LogisticsStatistics.builder()
                .totalOrdersWithShipping(totalWithShipping)
                .unfulfilledOrders(unfulfilled)
                .shippingOrders(shipping)
                .deliveredOrders(delivered)
                .failedDeliveryOrders(failed)
                .deliverySuccessRate(deliverySuccessRate)
                .shippingStatusBreakdown(breakdown)
                .build();
    }


    private BigDecimal orZero(BigDecimal value) {
        return value != null ? value : BigDecimal.ZERO;
    }

    private InventoryStatistics calculateInventoryStatistics() {
        List<ProductVariant> variants = productVariantRepository.findAll();
        List<Stock> stocks = stockRepository.findAll();

        Map<Long, List<Stock>> stockByVariant = stocks.stream()
                .filter(stock -> stock.getVariant() != null && stock.getVariant().getId() != null)
                .collect(Collectors.groupingBy(
                        stock -> stock.getVariant().getId()
                ));


        long totalUnitsInStock = 0L;
        long outOfStockVariants = 0L;
        long lowStockVariants = 0L;

        BigDecimal inventoryCostValue = BigDecimal.ZERO;
        BigDecimal inventoryRetailValue = BigDecimal.ZERO;

        for (ProductVariant variant : variants) {
            Long variantId = variant.getId();
            List<Stock> variantStocks = stockByVariant.getOrDefault(variantId, Collections.emptyList());

            long availableQty = variantStocks.stream()
                    .mapToLong(s -> s.getQuantity() != null ? s.getQuantity() : 0L)
                    .sum();

            Stock firstStock = variantStocks.isEmpty() ? null : variantStocks.get(0);
            Integer safetyStock = firstStock != null && firstStock.getSafetyStock() != null 
                    ? firstStock.getSafetyStock() 
                    : 0;
            
            // Check if safety stock warning is disabled for this variant
            Boolean disableSafetyWarning = firstStock != null && firstStock.getDisableSafetyWarning() != null 
                    ? firstStock.getDisableSafetyWarning() 
                    : false;

            // Always count out of stock variants
            if (availableQty <= 0) {
                outOfStockVariants++;
            } 
            // Only count low stock if warning is not disabled
            else if (!disableSafetyWarning && availableQty <= safetyStock) {
                lowStockVariants++;
            }


            totalUnitsInStock += availableQty;

            BigDecimal cost = variant.getCostPrice() != null ? variant.getCostPrice() : BigDecimal.ZERO;
            BigDecimal price = variant.getPrice() != null ? variant.getPrice() : BigDecimal.ZERO;
            BigDecimal qtyBD = BigDecimal.valueOf(availableQty);

            inventoryCostValue = inventoryCostValue.add(cost.multiply(qtyBD));
            inventoryRetailValue = inventoryRetailValue.add(price.multiply(qtyBD));
        }

        BigDecimal potentialProfit = inventoryRetailValue.subtract(inventoryCostValue);

        return InventoryStatistics.builder()
                .totalProducts(productRepository.count())
                .totalSkus((long) variants.size())
                .totalUnitsInStock(totalUnitsInStock)
                .outOfStockVariants(outOfStockVariants)
                .lowStockVariants(lowStockVariants)
                .inventoryCostValue(inventoryCostValue)
                .inventoryRetailValue(inventoryRetailValue)
                .inventoryPotentialProfit(potentialProfit)
                .build();
    }

    private ProfitStatistics calculateProfitStatistics(List<String> completedStatuses,
                                                       LocalDateTime startOfToday,
                                                       LocalDateTime startOfMonth) {
        // Tất cả order hoàn tất
        List<Order> completedOrders = orderRepository.findAll().stream()
                .filter(o -> o.getStatus() != null &&
                        completedStatuses.contains(o.getStatus().toLowerCase()))
                .collect(Collectors.toList());

        if (completedOrders.isEmpty()) {
            return ProfitStatistics.builder()
                    .totalRevenue(BigDecimal.ZERO)
                    .totalCogs(BigDecimal.ZERO)
                    .totalGrossProfit(BigDecimal.ZERO)
                    .totalGrossMargin(BigDecimal.ZERO)
                    .todayRevenue(BigDecimal.ZERO)
                    .todayCogs(BigDecimal.ZERO)
                    .todayProfit(BigDecimal.ZERO)
                    .thisMonthRevenue(BigDecimal.ZERO)
                    .thisMonthCogs(BigDecimal.ZERO)
                    .thisMonthProfit(BigDecimal.ZERO)
                    .build();
        }

        BigDecimal totalRevenue = BigDecimal.ZERO;
        BigDecimal totalCogs = BigDecimal.ZERO;

        BigDecimal todayRevenue = BigDecimal.ZERO;
        BigDecimal todayCogs = BigDecimal.ZERO;

        BigDecimal monthRevenue = BigDecimal.ZERO;
        BigDecimal monthCogs = BigDecimal.ZERO;

        for (Order order : completedOrders) {
            BigDecimal orderRevenue = orZero(order.getGrandTotal());
            List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());

            BigDecimal orderCogs = BigDecimal.ZERO;
            for (OrderItem item : items) {
                Long variantId = item.getVariantId();
                Long qty = item.getQty() != null ? item.getQty() : 0L;

                BigDecimal costPrice = BigDecimal.ZERO;
                if (variantId != null) {
                    costPrice = productVariantRepository.findById(variantId)
                            .map(ProductVariant::getCostPrice)
                            .orElse(BigDecimal.ZERO);
                }
                orderCogs = orderCogs.add(costPrice.multiply(BigDecimal.valueOf(qty)));
            }

            totalRevenue = totalRevenue.add(orderRevenue);
            totalCogs = totalCogs.add(orderCogs);

            // Hôm nay
            if (!order.getCreatedAt().isBefore(startOfToday)) {
                todayRevenue = todayRevenue.add(orderRevenue);
                todayCogs = todayCogs.add(orderCogs);
            }

            // Trong tháng
            if (!order.getCreatedAt().isBefore(startOfMonth)) {
                monthRevenue = monthRevenue.add(orderRevenue);
                monthCogs = monthCogs.add(orderCogs);
            }
        }

        BigDecimal totalProfit = totalRevenue.subtract(totalCogs);
        BigDecimal totalMargin = BigDecimal.ZERO;
        if (totalRevenue.compareTo(BigDecimal.ZERO) > 0) {
            totalMargin = totalProfit
                    .multiply(BigDecimal.valueOf(100))
                    .divide(totalRevenue, 2, java.math.RoundingMode.HALF_UP);
        }

        BigDecimal todayProfit = todayRevenue.subtract(todayCogs);
        BigDecimal monthProfit = monthRevenue.subtract(monthCogs);

        return ProfitStatistics.builder()
                .totalRevenue(totalRevenue)
                .totalCogs(totalCogs)
                .totalGrossProfit(totalProfit)
                .totalGrossMargin(totalMargin)
                .todayRevenue(todayRevenue)
                .todayCogs(todayCogs)
                .todayProfit(todayProfit)
                .thisMonthRevenue(monthRevenue)
                .thisMonthCogs(monthCogs)
                .thisMonthProfit(monthProfit)
                .build();
    }
    private List<CategoryPerformanceDto> getCategoryPerformance() {
        // Map productId -> list categoryIds
        Map<Long, List<Long>> productCategoryMap = productCategoryRepository.findAll().stream()
                .collect(Collectors.groupingBy(
                        pc -> pc.getProductId(),
                        Collectors.mapping(pc -> pc.getCategoryId(), Collectors.toList())
                ));

        Map<Long, Category> categoryMap = categoryRepository.findAll().stream()
                .collect(Collectors.toMap(Category::getId, c -> c));

        // Lấy order item của các đơn completed/confirmed
        List<Order> completedOrders = orderRepository.findAll().stream()
                .filter(o -> o.getStatus() != null &&
                        ("confirmed".equalsIgnoreCase(o.getStatus())
                                || "completed".equalsIgnoreCase(o.getStatus())))
                .collect(Collectors.toList());

        if (completedOrders.isEmpty()) {
            return List.of();
        }

        Map<Long, CategoryPerformanceDto> result = new HashMap<>();

        for (Order order : completedOrders) {
            List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
            for (OrderItem item : items) {
                Long productId = item.getProductId();
                Long qty = item.getQty() != null ? item.getQty() : 0L;
                BigDecimal lineTotal = item.getLineTotal();

                if (lineTotal == null) {
                    BigDecimal unit = item.getUnitPrice() != null ? item.getUnitPrice() : BigDecimal.ZERO;
                    lineTotal = unit.multiply(BigDecimal.valueOf(qty));
                }

                List<Long> categoryIds = productCategoryMap.getOrDefault(productId, Collections.emptyList());
                for (Long categoryId : categoryIds) {
                    Category category = categoryMap.get(categoryId);
                    if (category == null) continue;

                    CategoryPerformanceDto dto = result.computeIfAbsent(categoryId, id ->
                            CategoryPerformanceDto.builder()
                                    .categoryId(id)
                                    .categoryName(category.getName())
                                    .productCount(0L)
                                    .unitsSold(0L)
                                    .revenue(BigDecimal.ZERO)
                                    .build()
                    );

                    dto.setUnitsSold(dto.getUnitsSold() + qty);
                    dto.setRevenue(dto.getRevenue().add(lineTotal));
                }
            }
        }

        // Đếm số product trong từng category (để hiển thị)
        productCategoryMap.forEach((productId, catIds) -> {
            catIds.forEach(catId -> {
                CategoryPerformanceDto dto = result.get(catId);
                if (dto != null) {
                    dto.setProductCount(dto.getProductCount() + 1);
                }
            });
        });

        return result.values().stream()
                .sorted((a, b) -> b.getRevenue().compareTo(a.getRevenue()))
                .limit(10)
                .collect(Collectors.toList());
    }


    private DetailedStatistics getDetailedStatistics() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime start7Days = now.minusDays(7);
        LocalDateTime start30Days = now.minusDays(30);
        LocalDateTime start12Months = now.minusMonths(12);
        LocalDateTime start52Weeks = now.minusWeeks(52);

        List<TimeSeriesData> last7Days = getDailyStatistics(start7Days);
        List<TimeSeriesData> last30Days = getDailyStatistics(start30Days);
        List<TimeSeriesData> last12Months = getMonthlyStatistics(start12Months);
        List<TimeSeriesData> last52Weeks = getWeeklyStatistics(start52Weeks);

        return DetailedStatistics.builder()
                .last7Days(last7Days)
                .last30Days(last30Days)
                .last12Months(last12Months)
                .last52Weeks(last52Weeks)
                .build();
    }

    private List<TimeSeriesData> getDailyStatistics(LocalDateTime startDate) {
        List<Object[]> rawData = orderRepository.getDailyStatistics(startDate);
        List<Object[]> userData = userRepository.getDailyUserStatistics(startDate);

        // map ngày -> số user đăng ký
        Map<String, Long> userCountMap = userData.stream()
                .collect(Collectors.toMap(
                        row -> row[0].toString(),
                        row -> ((Number) row[1]).longValue()
                ));

        // tạo full list ngày từ start -> hôm nay
        LocalDate start = startDate.toLocalDate();
        LocalDate end = LocalDate.now();
        Map<String, TimeSeriesData> dataMap = IntStream
                .range(0, (int) java.time.temporal.ChronoUnit.DAYS.between(start, end) + 1)
                .mapToObj(i -> start.plusDays(i))
                .collect(Collectors.toMap(
                        date -> date.format(DateTimeFormatter.ISO_DATE),
                        date -> TimeSeriesData.builder()
                                .date(date.format(DateTimeFormatter.ISO_DATE))
                                .orders(0L)
                                .revenue(BigDecimal.ZERO)
                                .users(userCountMap.getOrDefault(date.format(DateTimeFormatter.ISO_DATE), 0L))
                                .build()
                ));

        // cập nhật data thực từ orders
        for (Object[] row : rawData) {
            String date = row[0].toString();
            Long orders = ((Number) row[1]).longValue();
            BigDecimal revenue = (BigDecimal) row[2];
            Long users = userCountMap.getOrDefault(date, 0L);

            dataMap.put(date, TimeSeriesData.builder()
                    .date(date)
                    .orders(orders)
                    .revenue(revenue != null ? revenue : BigDecimal.ZERO)
                    .users(users)
                    .build());
        }

        return new ArrayList<>(dataMap.values());
    }

    private List<TimeSeriesData> getWeeklyStatistics(LocalDateTime startDate) {
        List<Object[]> rawData = orderRepository.getWeeklyStatistics(startDate);

        return rawData.stream()
                .map(row -> TimeSeriesData.builder()
                        .date("Week " + row[0].toString())
                        .orders(((Number) row[1]).longValue())
                        .revenue(row[2] != null ? (BigDecimal) row[2] : BigDecimal.ZERO)
                        .users(0L) // Weekly user stats chưa implement
                        .build())
                .collect(Collectors.toList());
    }

    private List<TimeSeriesData> getMonthlyStatistics(LocalDateTime startDate) {
        List<Object[]> rawData = orderRepository.getMonthlyStatistics(startDate);

        return rawData.stream()
                .map(row -> TimeSeriesData.builder()
                        .date(row[0].toString()) // Format: "YYYY-MM"
                        .orders(((Number) row[1]).longValue())
                        .revenue(row[2] != null ? (BigDecimal) row[2] : BigDecimal.ZERO)
                        .users(0L) // Monthly user stats chưa implement
                        .build())
                .collect(Collectors.toList());
    }

    /**
     * Top sản phẩm: lấy theo sold_count (đã có) và bổ sung doanh thu thực tế
     */
    private List<TopProductDto> getTopProducts(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        List<Product> products = productRepository.findTopProductsBySoldCount(pageable);

        // map productId -> revenue từ các đơn hàng đã "confirmed/completed"
        Map<Long, BigDecimal> revenueMap = calculateProductRevenueForCompletedOrders();

        return products.stream()
                .map(p -> {
                    Long productId = p.getId();
                    BigDecimal revenue = revenueMap.getOrDefault(productId, BigDecimal.ZERO);

                    return TopProductDto.builder()
                            .productId(productId)
                            .productName(p.getName())
                            .productSlug(p.getSlug())
                            .soldCount(p.getSoldCount() != null ? p.getSoldCount().longValue() : 0L)
                            .revenue(revenue)
                            .viewCount(p.getViewCount() != null ? p.getViewCount().longValue() : 0L)
                            .build();
                })
                .collect(Collectors.toList());
    }

    /**
     * Tính doanh thu theo productId từ các đơn đã hoàn tất (confirmed/completed)
     */
    private Map<Long, BigDecimal> calculateProductRevenueForCompletedOrders() {
        List<Order> completedOrders = orderRepository.findAll().stream()
                .filter(o -> o.getStatus() != null &&
                        ("confirmed".equalsIgnoreCase(o.getStatus())
                                || "completed".equalsIgnoreCase(o.getStatus())))
                .collect(Collectors.toList());

        if (completedOrders.isEmpty()) {
            return Collections.emptyMap();
        }

        Map<Long, BigDecimal> revenueByProduct = new HashMap<>();

        for (Order order : completedOrders) {
            List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
            for (OrderItem item : items) {
                Long productId = item.getProductId();
                if (productId == null) continue;

                BigDecimal lineTotal = item.getLineTotal();
                if (lineTotal == null) {
                    BigDecimal unit = item.getUnitPrice() != null ? item.getUnitPrice() : BigDecimal.ZERO;
                    long qty = item.getQty() != null ? item.getQty() : 0L;
                    lineTotal = unit.multiply(BigDecimal.valueOf(qty));
                }

                BigDecimal finalLineTotal = lineTotal != null ? lineTotal : BigDecimal.ZERO;
                revenueByProduct.merge(productId, finalLineTotal, BigDecimal::add);
            }
        }

        return revenueByProduct;
    }

    /**
     * Top khách hàng theo tổng chi tiêu trên các đơn đã confirmed/completed
     */
    private List<TopCustomerDto> getTopCustomers(int limit) {
        List<Order> completedOrders = orderRepository.findAll().stream()
                .filter(o -> o.getStatus() != null &&
                        ("confirmed".equalsIgnoreCase(o.getStatus())
                                || "completed".equalsIgnoreCase(o.getStatus())))
                .collect(Collectors.toList());

        if (completedOrders.isEmpty()) {
            return List.of();
        }

        Map<Long, List<Order>> ordersByUser = completedOrders.stream()
                .filter(o -> o.getUserId() != null)
                .collect(Collectors.groupingBy(Order::getUserId));

        return ordersByUser.entrySet().stream()
                .map(entry -> {
                    Long userId = entry.getKey();
                    List<Order> userOrders = entry.getValue();

                    long orderCount = userOrders.size();
                    BigDecimal totalSpent = userOrders.stream()
                            .map(o -> o.getGrandTotal() != null ? o.getGrandTotal() : BigDecimal.ZERO)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);

                    User user = userRepository.findById(userId).orElse(null);

                    return TopCustomerDto.builder()
                            .userId(userId)
                            .userName(user != null ? user.getName() : null)
                            .userEmail(user != null ? user.getEmail() : null)
                            .orderCount(orderCount)
                            .totalSpent(totalSpent)
                            .build();
                })
                .sorted((a, b) -> b.getTotalSpent().compareTo(a.getTotalSpent()))
                .limit(limit)
                .collect(Collectors.toList());
    }
}

