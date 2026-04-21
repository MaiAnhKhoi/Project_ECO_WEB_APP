package com.tlcn.fashion_api.repository.order;

import com.tlcn.fashion_api.entity.order.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findByOrderId(Long orderId);

    /**
     * Kiểm tra user đã mua sản phẩm này với trạng thái COMPLETED chưa
     */
    @Query("""
        select count(oi) > 0
        from OrderItem oi
        join oi.order o
        where o.userId = :userId
          and oi.productId = :productId
          and o.status = 'COMPLETED'
    """)
    boolean existsByUserIdAndProductIdAndOrderStatusCompleted(
            @Param("userId") Long userId,
            @Param("productId") Long productId
    );

    /**
     * Đếm số lần user đã mua sản phẩm này với trạng thái COMPLETED
     */
    @Query("""
        select count(oi)
        from OrderItem oi
        join oi.order o
        where o.userId = :userId
          and oi.productId = :productId
          and o.status = 'COMPLETED'
    """)
    long countPurchasesByUserIdAndProductIdAndOrderStatusCompleted(
            @Param("userId") Long userId,
            @Param("productId") Long productId
    );
}