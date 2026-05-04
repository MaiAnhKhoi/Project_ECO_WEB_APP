package com.tlcn.fashion_api.repository.ai;

import com.tlcn.fashion_api.entity.ai.UserStyleProfile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserStyleProfileRepository extends JpaRepository<UserStyleProfile, Long> {

    Optional<UserStyleProfile> findTopByUserIdOrderByCreatedAtDesc(Long userId);

    Page<UserStyleProfile> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
}
