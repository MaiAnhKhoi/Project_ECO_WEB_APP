package com.tlcn.fashion_api.repository.address;

import com.tlcn.fashion_api.entity.address.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface AddressRepository extends JpaRepository<Address, Long> {

    List<Address> findByUser_IdOrderByCreatedAtDesc(Long userId);

    Optional<Address> findByIdAndUser_Id(Long id, Long userId);
    Optional<Address> findByUser_IdAndIsDefaultTrue(Long userId);
    @Modifying
    @Query("update Address a set a.isDefault = false " +
            "where a.user.id = :userId and a.isDefault = true")
    void clearDefaultForUser(Long userId);


}