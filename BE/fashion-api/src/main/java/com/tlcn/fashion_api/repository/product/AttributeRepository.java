package com.tlcn.fashion_api.repository.product;

import com.tlcn.fashion_api.entity.product.Attribute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AttributeRepository extends JpaRepository<Attribute, Long> {

    // Lấy danh sách Attribute theo type (ví dụ: "Color", "Size")
    List<Attribute> findByType(String type);

    // Nếu muốn, có thể lấy theo tên cụ thể
    List<Attribute> findByNameIn(List<String> names);

    Optional<Attribute> findByCode(String code);
}
