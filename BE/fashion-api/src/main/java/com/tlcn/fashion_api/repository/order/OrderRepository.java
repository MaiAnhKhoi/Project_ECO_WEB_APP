package com.tlcn.fashion_api.repository.order;

import com.tlcn.fashion_api.entity.order.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {

    @Query("""
        SELECT o FROM Order o
        WHERE o.status = 'pending'
          AND o.paymentStatus = 'unpaid'
          AND o.paymentExpiresAt IS NOT NULL
          AND o.paymentExpiresAt < :now
    """)
    List<Order> findExpiredUnpaid(@Param("now") LocalDateTime now);

    Page<Order> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    Optional<Order> findByIdAndUserId(Long id, Long userId);

    long countByCreatedAtAfter(java.time.LocalDateTime dateTime);
    
    long countByStatus(String status);
    
    @Query("SELECT COALESCE(SUM(o.grandTotal), 0) FROM Order o WHERE o.status IN :statuses")
    java.math.BigDecimal sumGrandTotalByStatus(@Param("statuses") List<String> statuses);
    
    @Query("SELECT COALESCE(SUM(o.grandTotal), 0) FROM Order o WHERE o.status IN :statuses AND o.createdAt >= :dateTime")
    java.math.BigDecimal sumGrandTotalByStatusAndCreatedAtAfter(
            @Param("statuses") List<String> statuses,
            @Param("dateTime") java.time.LocalDateTime dateTime
    );

    // Query for daily statistics (last N days)
    @Query(value = """
        SELECT 
            DATE(o.created_at) as date,
            COUNT(o.id) as orderCount,
            COALESCE(SUM(CASE WHEN o.status IN ('confirmed', 'completed') THEN o.grand_total ELSE 0 END), 0) as revenue
        FROM orders o
        WHERE o.created_at >= :startDate
        GROUP BY DATE(o.created_at)
        ORDER BY DATE(o.created_at) ASC
        """, nativeQuery = true)
    List<Object[]> getDailyStatistics(@Param("startDate") java.time.LocalDateTime startDate);

    // Query for weekly statistics
    @Query(value = """
        SELECT 
            YEARWEEK(o.created_at) as week,
            COUNT(o.id) as orderCount,
            COALESCE(SUM(CASE WHEN o.status IN ('confirmed', 'completed') THEN o.grand_total ELSE 0 END), 0) as revenue
        FROM orders o
        WHERE o.created_at >= :startDate
        GROUP BY YEARWEEK(o.created_at)
        ORDER BY YEARWEEK(o.created_at) ASC
        """, nativeQuery = true)
    List<Object[]> getWeeklyStatistics(@Param("startDate") java.time.LocalDateTime startDate);

    // Query for monthly statistics
    @Query(value = """
        SELECT 
            DATE_FORMAT(o.created_at, '%Y-%m') as month,
            COUNT(o.id) as orderCount,
            COALESCE(SUM(CASE WHEN o.status IN ('confirmed', 'completed') THEN o.grand_total ELSE 0 END), 0) as revenue
        FROM orders o
        WHERE o.created_at >= :startDate
        GROUP BY DATE_FORMAT(o.created_at, '%Y-%m')
        ORDER BY DATE_FORMAT(o.created_at, '%Y-%m') ASC
        """, nativeQuery = true)
    List<Object[]> getMonthlyStatistics(@Param("startDate") java.time.LocalDateTime startDate);
}

