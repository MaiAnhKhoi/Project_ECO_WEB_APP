package com.tlcn.fashion_api.repository.order;

import com.tlcn.fashion_api.entity.order.Refund;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RefundRepository extends JpaRepository<Refund, Long> {

    // Lấy theo 1 trạng thái
    List<Refund> findByStatus(String status);

    // Lấy theo nhiều trạng thái
    List<Refund> findByStatusIn(List<String> statuses);

    Optional<Refund> findByRefundCode(String refundCode);

    // 👇 DÙNG ĐỂ CHẶN TẠO REFUND TRÙNG
    boolean existsByOrderIdAndStatusIn(Long orderId, List<String> statuses);

    Optional<Refund> findTopByOrderIdOrderByCreatedAtDesc(Long orderId);
}
