package com.tlcn.fashion_api.repository.order;

import com.tlcn.fashion_api.common.enums.PaymentProvider;
import com.tlcn.fashion_api.entity.payment.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findFirstByOrderIdAndProviderOrderByCreatedAtDesc(
            Long orderId,
            PaymentProvider provider
    );
}