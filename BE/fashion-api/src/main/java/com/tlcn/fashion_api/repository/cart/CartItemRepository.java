package com.tlcn.fashion_api.repository.cart;

import com.tlcn.fashion_api.entity.cart.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;


public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    Optional<CartItem> findByIdAndCartUserId(Long id, Long userId);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("delete from CartItem ci where ci.id = :id and ci.cart.user.id = :userId")
    int deleteByIdAndCartUserId(@Param("id") Long id, @Param("userId") Long userId);
}
