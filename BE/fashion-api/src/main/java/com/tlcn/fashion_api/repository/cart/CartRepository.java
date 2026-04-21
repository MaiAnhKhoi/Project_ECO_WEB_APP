package com.tlcn.fashion_api.repository.cart;

import com.tlcn.fashion_api.entity.cart.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findFirstByUserIdAndStatusOrderByIdDesc(Long userId, String status);

}
