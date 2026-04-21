package com.tlcn.fashion_api.controller;

import com.tlcn.fashion_api.common.response.ApiResponse;
import com.tlcn.fashion_api.common.response.PageResponse;
import com.tlcn.fashion_api.dto.response.message.MessageDto;
import com.tlcn.fashion_api.entity.message.MessageThread;
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

@RestController
@RequestMapping("/api/customer/chat")
@RequiredArgsConstructor
@Tag(name = "Customer Chat", description = "API trò chuyện hỗ trợ khách hàng (user ↔ admin/customer service)")
public class ChatController {

    private final ChatService chatService;

    /**
     * Lấy hoặc tạo thread hỗ trợ cho khách hiện tại.
     * -> FE chỉ cần lấy ra threadId để subscribe WebSocket /topic/threads/{threadId}
     */
    @GetMapping("/thread")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<Long>> getOrCreateMySupportThread() {
        Long userId = SecurityUtils.getCurrentUserId(); // ✅ LẤY TỪ SecurityUtils

        MessageThread thread = chatService.getOrCreateSupportThread(userId);
        return ResponseEntity.ok(ApiResponse.success(thread.getId()));
    }

    /**
     * Lấy danh sách tin nhắn trong thread hỗ trợ của khách hiện tại (phân trang).
     */
    @GetMapping("/messages")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Lấy tin nhắn trong cuộc trò chuyện hỗ trợ của khách (phân trang)")
    public ResponseEntity<ApiResponse<PageResponse<MessageDto>>> getMyMessages(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "30") int size
    ) {
        Long userId = SecurityUtils.getCurrentUserId(); // ✅

        // luôn luôn đảm bảo có thread
        MessageThread thread = chatService.getOrCreateSupportThread(userId);

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "createdAt"));

        var msgPage = chatService.getMessages(thread.getId(), userId, pageable);

        PageResponse<MessageDto> response = PageResponse.of(msgPage);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * Gửi tin nhắn (text + nhiều ảnh) trong thread hỗ trợ.
     */
    @PostMapping(value = "/messages", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Gửi tin nhắn (text + ảnh) trong cuộc trò chuyện hỗ trợ")
    public ResponseEntity<ApiResponse<MessageDto>> sendMyMessage(
            @RequestPart(value = "text", required = false) String text,
            @RequestPart(value = "files", required = false) MultipartFile[] files
    ) {
        Long userId = SecurityUtils.getCurrentUserId(); // ✅

        MessageThread thread = chatService.getOrCreateSupportThread(userId);

        MessageDto dto = chatService.sendMessageToThread(
                thread.getId(),
                userId,
                text,
                files
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success(dto, "Message sent"));
    }

    /**
     * Đánh dấu tất cả tin nhắn trong thread hỗ trợ của khách là đã đọc
     */
    @PostMapping("/read-all")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Đánh dấu tất cả tin nhắn trong cuộc trò chuyện hỗ trợ là đã đọc")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead() {
        Long userId = SecurityUtils.getCurrentUserId(); // ✅

        MessageThread thread = chatService.getOrCreateSupportThread(userId);
        chatService.markThreadMessagesAsRead(thread.getId(), userId);
        return ResponseEntity.ok(ApiResponse.success(null, "Marked as read"));
    }
}
