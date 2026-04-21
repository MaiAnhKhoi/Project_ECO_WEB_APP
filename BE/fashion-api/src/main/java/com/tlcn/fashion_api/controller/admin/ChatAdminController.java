package com.tlcn.fashion_api.controller.admin;

import com.tlcn.fashion_api.common.response.ApiResponse;
import com.tlcn.fashion_api.common.response.PageResponse;
import com.tlcn.fashion_api.dto.response.message.MessageDto;
import com.tlcn.fashion_api.dto.response.message.MessageThreadSummaryDto;
import com.tlcn.fashion_api.dto.response.message.SimpleUserDto;
import com.tlcn.fashion_api.security.SecurityUtils;
import com.tlcn.fashion_api.service.chat.ChatService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/admin/chat")
@RequiredArgsConstructor
@Tag(name = "Chat Management", description = "Chat giữa admin/staff và khách hàng")
public class ChatAdminController {

    private final ChatService chatService;

    @GetMapping("/customer-threads")
    @PreAuthorize("hasAnyRole('ADMIN','CUSTOMER_SERVICE')")
    @Operation(summary = "Danh sách thread hỗ trợ khách hàng (paged)")
    public ResponseEntity<ApiResponse<PageResponse<MessageThreadSummaryDto>>> listCustomerThreads(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Long staffId = SecurityUtils.getCurrentUserId(); // tuỳ dự án bạn

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        var threadPage = chatService.getSupportThreadsForStaff(staffId, pageable);

        PageResponse<MessageThreadSummaryDto> body = PageResponse.of(threadPage);

        return ResponseEntity.ok(ApiResponse.success(body));
    }

    @GetMapping("/direct-threads")
    @PreAuthorize("hasAnyRole('ADMIN','PRODUCT_MANAGER','ORDER_MANAGER','CUSTOMER_SERVICE','MARKETING_STAFF','ACCOUNTANT')")
    @Operation(summary = "Danh sách thread nội bộ (direct) (paged)")
    public ResponseEntity<ApiResponse<PageResponse<MessageThreadSummaryDto>>> listDirectThreads(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Long currentUserId = SecurityUtils.getCurrentUserId();

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        var threadPage = chatService.getDirectThreadsForUser(currentUserId, pageable);

        PageResponse<MessageThreadSummaryDto> body = PageResponse.of(threadPage);

        return ResponseEntity.ok(ApiResponse.success(body));
    }

    @GetMapping("/threads/{threadId}/messages")
    @PreAuthorize("hasAnyRole('ADMIN','PRODUCT_MANAGER','ORDER_MANAGER','CUSTOMER_SERVICE','MARKETING_STAFF','ACCOUNTANT')")
    @Operation(summary = "Lấy tin nhắn trong thread (paged, kèm attachments)")
    public ResponseEntity<ApiResponse<PageResponse<MessageDto>>> getThreadMessages(
            @PathVariable Long threadId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "30") int size
    ) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "createdAt"));

        var msgPage = chatService.getMessages(threadId, currentUserId, pageable);
        PageResponse<MessageDto> body = PageResponse.of(msgPage);

        return ResponseEntity.ok(ApiResponse.success(body));
    }

    @GetMapping("/customers/{customerId}/messages")
    @PreAuthorize("hasAnyRole('ADMIN','CUSTOMER_SERVICE')")
    @Operation(summary = "Lấy hoặc tạo thread hỗ trợ với 1 khách hàng, trả về tin nhắn (kể cả khi chưa có dữ liệu)")
    public ResponseEntity<ApiResponse<PageResponse<MessageDto>>> getOrCreateCustomerChatMessages(
            @PathVariable Long customerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "30") int size
    ) {
        Long currentUserId = SecurityUtils.getCurrentUserId();

        // 🔹 Tạo hoặc lấy thread SUPPORT:{customerId}
        var thread = chatService.getOrCreateSupportThread(customerId);

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "createdAt"));

        var msgPage = chatService.getMessages(thread.getId(), currentUserId, pageable);
        PageResponse<MessageDto> body = PageResponse.of(msgPage);

        return ResponseEntity.ok(ApiResponse.success(body));
    }


    @PostMapping(
            value = "/threads/{threadId}/messages",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    @PreAuthorize("hasAnyRole('ADMIN','PRODUCT_MANAGER','ORDER_MANAGER','CUSTOMER_SERVICE','MARKETING_STAFF','ACCOUNTANT')")
    @Operation(summary = "Admin/staff gửi tin nhắn vào 1 thread (text + ảnh)")
    public ResponseEntity<ApiResponse<MessageDto>> sendMessageInThread(
            @PathVariable Long threadId,
            @RequestPart(value = "text", required = false) String text,
            @RequestPart(value = "files", required = false) MultipartFile[] files
    ) {
        Long currentUserId = SecurityUtils.getCurrentUserId();

        MessageDto dto = chatService.sendMessageToThread(
                threadId,
                currentUserId,
                text,
                files
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success(dto, "Message sent"));
    }


    @GetMapping("/staff-users")
    @PreAuthorize("hasAnyRole('ADMIN','PRODUCT_MANAGER','ORDER_MANAGER','CUSTOMER_SERVICE','MARKETING_STAFF','ACCOUNTANT')")
    @Operation(summary = "Danh sách user nội bộ (staff) để tạo chat direct")
    public ResponseEntity<ApiResponse<List<SimpleUserDto>>> getStaffUsers() {
        var list = chatService.getStaffUsersForChat();
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    // 🔹 Danh sách khách hàng cho tab "Khách hàng"
    @GetMapping("/customer-users")
    @PreAuthorize("hasAnyRole('ADMIN','CUSTOMER_SERVICE')")
    @Operation(summary = "Danh sách khách hàng để tạo chat hỗ trợ")
    public ResponseEntity<ApiResponse<List<SimpleUserDto>>> getCustomerUsers() {
        var list = chatService.getCustomerUsersForChat();
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    // 🔹 Tạo hoặc lấy DIRECT thread nội bộ
    @PostMapping("/direct/{otherUserId}/thread")
    @PreAuthorize("hasAnyRole('ADMIN','PRODUCT_MANAGER','ORDER_MANAGER','CUSTOMER_SERVICE','MARKETING_STAFF','ACCOUNTANT')")
    @Operation(summary = "Tạo hoặc lấy thread nội bộ (DIRECT) với một user khác")
    public ResponseEntity<ApiResponse<MessageThreadSummaryDto>> createOrGetDirectThread(
            @PathVariable Long otherUserId
    ) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        var dto = chatService.getOrCreateDirectThreadForUser(currentUserId, otherUserId);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    // 🔹 Tạo hoặc lấy SUPPORT thread với 1 khách (cho tab khách hàng)
    @PostMapping("/customers/{customerId}/thread")
    @PreAuthorize("hasAnyRole('ADMIN','CUSTOMER_SERVICE')")
    @Operation(summary = "Tạo hoặc lấy thread hỗ trợ với 1 khách hàng")
    public ResponseEntity<ApiResponse<MessageThreadSummaryDto>> createOrGetCustomerSupportThread(
            @PathVariable Long customerId
    ) {
        Long staffId = SecurityUtils.getCurrentUserId();
        var dto = chatService.getOrCreateSupportThreadForStaff(staffId, customerId);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    @PostMapping("/threads/{threadId}/read-all")
    @PreAuthorize("hasAnyRole('ADMIN','PRODUCT_MANAGER','ORDER_MANAGER','CUSTOMER_SERVICE','MARKETING_STAFF','ACCOUNTANT')")
    @Operation(summary = "Đánh dấu tất cả tin nhắn trong thread là đã đọc cho admin/staff hiện tại")
    public ResponseEntity<ApiResponse<Void>> markThreadReadForAdmin(
            @PathVariable Long threadId
    ) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        chatService.markThreadMessagesAsRead(threadId, currentUserId);
        return ResponseEntity.ok(ApiResponse.success(null, "Marked as read"));
    }
}