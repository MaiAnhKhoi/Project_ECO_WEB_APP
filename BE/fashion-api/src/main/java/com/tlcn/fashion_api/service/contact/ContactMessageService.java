package com.tlcn.fashion_api.service.contact;

import com.tlcn.fashion_api.common.response.PageResponse;
import com.tlcn.fashion_api.dto.request.contact.ContactMessageRequest;
import com.tlcn.fashion_api.dto.request.contact.ContactMessageStatusUpdateRequest;
import com.tlcn.fashion_api.dto.response.contact.ContactMessageAdminDto;
import com.tlcn.fashion_api.entity.contact.ContactMessage;
import com.tlcn.fashion_api.entity.user.User;
import com.tlcn.fashion_api.repository.contact.ContactMessageRepository;
import com.tlcn.fashion_api.repository.user.UserRepository;
import com.tlcn.fashion_api.security.SecurityUtils;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Locale;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ContactMessageService {

    private static final Set<String> ALLOWED_STATUS = Set.of("new", "in_progress", "resolved");

    private final ContactMessageRepository contactMessageRepository;
    private final UserRepository userRepository;

    @Transactional
    public void submit(ContactMessageRequest request) {
        ContactMessage message = new ContactMessage();
        message.setName(request.getName().trim());
        message.setEmail(request.getEmail().trim());
        message.setMessage(request.getMessage().trim());
        message.setStatus("new");
        contactMessageRepository.save(message);
    }

    public PageResponse<ContactMessageAdminDto> getMessages(
            Integer page,
            Integer size,
            String status,
            String keyword
    ) {
        Pageable pageable = PageRequest.of(
                page == null || page < 0 ? 0 : page,
                size == null || size <= 0 ? 20 : size,
                Sort.by(Sort.Direction.DESC, "createdAt")
        );

        Specification<ContactMessage> spec = (root, query, cb) -> {
            query.distinct(true);
            var predicates = new ArrayList<Predicate>();

            if (status != null && !status.isBlank()) {
                predicates.add(cb.equal(cb.lower(root.get("status")), normalizeStatus(status)));
            }

            if (keyword != null && !keyword.isBlank()) {
                String like = "%" + keyword.toLowerCase(Locale.ROOT).trim() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("name")), like),
                        cb.like(cb.lower(root.get("email")), like),
                        cb.like(cb.lower(root.get("message")), like)
                ));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<ContactMessage> result = contactMessageRepository.findAll(spec, pageable);
        return PageResponse.of(result.map(this::toDto));
    }

    public ContactMessageAdminDto getDetail(Long id) {
        ContactMessage message = contactMessageRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Contact message not found"));
        return toDto(message);
    }

    @Transactional
    public ContactMessageAdminDto updateStatus(Long id, ContactMessageStatusUpdateRequest request) {
        ContactMessage message = contactMessageRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Contact message not found"));

        message.setStatus(normalizeStatus(request.getStatus()));
        message.setNote(request.getNote());
        Long currentUserId = SecurityUtils.getCurrentUserId();
        if (currentUserId != null) {
            User handler = userRepository.findById(currentUserId).orElse(null);
            message.setHandledBy(handler);
        }

        return toDto(contactMessageRepository.save(message));
    }

    private String normalizeStatus(String status) {
        if (status == null) {
            return "new";
        }
        String normalized = status.trim().toLowerCase(Locale.ROOT);
        if (!ALLOWED_STATUS.contains(normalized)) {
            throw new IllegalArgumentException("Invalid contact status: " + status);
        }
        return normalized;
    }

    private ContactMessageAdminDto toDto(ContactMessage message) {
        return ContactMessageAdminDto.builder()
                .id(message.getId())
                .name(message.getName())
                .email(message.getEmail())
                .message(message.getMessage())
                .status(message.getStatus())
                .note(message.getNote())
                .handledBy(message.getHandledBy() != null ? message.getHandledBy().getName() : null)
                .createdAt(message.getCreatedAt())
                .updatedAt(message.getUpdatedAt())
                .build();
    }
}

