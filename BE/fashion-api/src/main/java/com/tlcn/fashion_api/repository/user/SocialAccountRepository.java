package com.tlcn.fashion_api.repository.user;

import com.tlcn.fashion_api.entity.user.SocialAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SocialAccountRepository extends JpaRepository<SocialAccount, Long> {
    
    Optional<SocialAccount> findByProviderAndProviderUserId(String provider, String providerUserId);
    
    List<SocialAccount> findByUserId(Long userId);
    
    boolean existsByUserIdAndProvider(Long userId, String provider);
}
