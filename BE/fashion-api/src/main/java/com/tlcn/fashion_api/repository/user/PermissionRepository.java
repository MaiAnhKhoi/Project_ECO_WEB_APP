package com.tlcn.fashion_api.repository.user;

import com.tlcn.fashion_api.entity.user.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.Set;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, Long> {
    
    Optional<Permission> findByCode(String code);
    
    boolean existsByCode(String code);
    
    Set<Permission> findByIdIn(Set<Long> ids);
    
    Set<Permission> findByCodeIn(Set<String> codes);
}
