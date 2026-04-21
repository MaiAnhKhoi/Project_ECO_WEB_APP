package com.tlcn.fashion_api.repository.contact;

import com.tlcn.fashion_api.entity.contact.ContactMessage;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long>,
        JpaSpecificationExecutor<ContactMessage> {

    @Override
    @EntityGraph(attributePaths = {"handledBy"})
    org.springframework.data.domain.Page<ContactMessage> findAll(
            org.springframework.data.jpa.domain.Specification<ContactMessage> spec,
            org.springframework.data.domain.Pageable pageable
    );
}

