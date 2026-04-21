package com.tlcn.fashion_api.repository.inventory;


import com.tlcn.fashion_api.entity.inventory.InventoryReservation;
import com.tlcn.fashion_api.entity.order.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface InventoryReservationRepository
        extends JpaRepository<InventoryReservation, Long> {

    // Tổng số lượng đang "held" cho 1 variant, chưa hết hạn
    @Query("""
        select coalesce(sum(r.qty), 0)
        from InventoryReservation r
        where r.variant.id = :variantId
          and r.status = :status
          and r.expiresAt > :now
    """)
    int sumActiveHeld(
            @Param("variantId") Long variantId,
            @Param("status") String status,
            @Param("now") LocalDateTime now
    );

    List<InventoryReservation> findByOrderAndStatus(Order order, String status);
}