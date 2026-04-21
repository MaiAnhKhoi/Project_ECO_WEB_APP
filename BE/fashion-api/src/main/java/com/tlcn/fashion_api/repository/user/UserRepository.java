package com.tlcn.fashion_api.repository.user;

import com.tlcn.fashion_api.common.enums.UserStatus;
import com.tlcn.fashion_api.entity.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByUsername(String username);
    
    Optional<User> findByEmailOrUsername(String email, String username);
    
    boolean existsByEmail(String email);
    
    boolean existsByUsername(String username);
    
    Page<User> findByStatus(UserStatus status, Pageable pageable);
    
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.userRoles ur LEFT JOIN FETCH ur.role WHERE u.email = :email")
    Optional<User> findByEmailWithRoles(@Param("email") String email);
    
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.userRoles ur LEFT JOIN FETCH ur.role WHERE u.username = :username")
    Optional<User> findByUsernameWithRoles(@Param("username") String username);
    
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.userRoles ur LEFT JOIN FETCH ur.role WHERE u.id = :id")
    Optional<User> findByIdWithRoles(@Param("id") Long id);
    
    @Query("SELECT u FROM User u WHERE u.email LIKE %:keyword% OR u.name LIKE %:keyword% OR u.username LIKE %:keyword%")
    Page<User> searchUsers(@Param("keyword") String keyword, Pageable pageable);
    
    @Query("SELECT u FROM User u JOIN u.userRoles ur WHERE ur.role.code = :roleCode")
    Page<User> findByRoleCode(@Param("roleCode") String roleCode, Pageable pageable);

    @Query("""
    SELECT DISTINCT u 
    FROM User u 
    JOIN u.userRoles ur 
    JOIN ur.role r 
    WHERE r.code IN :codes
""")
    List<User> findStaffUsersByRoleCodes(@Param("codes") Collection<String> codes);

    @Query("""
    SELECT DISTINCT u 
    FROM User u 
    JOIN u.userRoles ur 
    JOIN ur.role r 
    WHERE r.code IN :codes
""")
    Page<User> findStaffUsersByRoleCodes(@Param("codes") Collection<String> codes, Pageable pageable);

    @Query("""
    SELECT DISTINCT u 
    FROM User u 
    JOIN u.userRoles ur 
    JOIN ur.role r 
    WHERE r.code = :code
""")
    List<User> findUsersByRoleCode(@Param("code") String code);

    long countByStatus(com.tlcn.fashion_api.common.enums.UserStatus status);
    
    long countByCreatedAtAfter(java.time.LocalDateTime dateTime);

    // Query for daily user registration statistics
    @Query(value = """
        SELECT 
            DATE(u.created_at) as date,
            COUNT(u.id) as userCount
        FROM users u
        WHERE u.created_at >= :startDate
        GROUP BY DATE(u.created_at)
        ORDER BY DATE(u.created_at) ASC
        """, nativeQuery = true)
    List<Object[]> getDailyUserStatistics(@Param("startDate") java.time.LocalDateTime startDate);

}
