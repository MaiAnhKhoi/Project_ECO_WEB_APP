package com.tlcn.fashion_api.service.chat;

import com.tlcn.fashion_api.cloudinary.CloudinaryService;
import com.tlcn.fashion_api.controller.admin.ChatEventPublisher;
import com.tlcn.fashion_api.dto.response.message.AttachmentDto;
import com.tlcn.fashion_api.dto.response.message.MessageDto;
import com.tlcn.fashion_api.dto.response.message.MessageThreadSummaryDto;
import com.tlcn.fashion_api.dto.response.message.SimpleUserDto;
import com.tlcn.fashion_api.entity.media.Media;
import com.tlcn.fashion_api.entity.message.*;
import com.tlcn.fashion_api.entity.user.User;
import com.tlcn.fashion_api.repository.message.MediaRepository;
import com.tlcn.fashion_api.repository.message.MessageMediaRepository;
import com.tlcn.fashion_api.repository.message.MessageReadRepository;
import com.tlcn.fashion_api.repository.message.MessageRepository;
import com.tlcn.fashion_api.repository.message.MessageThreadRepository;
import com.tlcn.fashion_api.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final MessageThreadRepository threadRepo;
    private final MessageRepository messageRepo;
    private final MessageReadRepository messageReadRepo;
    private final MessageMediaRepository messageMediaRepo;
    private final UserRepository userRepo;
    private final MediaRepository mediaRepo;
    private final CloudinaryService cloudinaryService; // upload ảnh
    private final ChatEventPublisher chatEventPublisher; // bắn WebSocket (bạn tạo class này phía dưới)

    /* =========================
       1. THREAD LIST: ADMIN SUPPORT (PAGED)
       ========================= */

    @Transactional(readOnly = true)
    public Page<MessageThreadSummaryDto> getSupportThreadsForStaff(Long staffUserId, Pageable pageable) {
        Page<MessageThread> threads = threadRepo.findSupportThreads(pageable);

        List<MessageThreadSummaryDto> content = threads.getContent().stream()
                .map(thread -> buildThreadSummaryForStaff(thread, staffUserId))
                .collect(Collectors.toList());

        return new PageImpl<>(content, threads.getPageable(), threads.getTotalElements());
    }

    private MessageThreadSummaryDto buildThreadSummaryForStaff(MessageThread thread, Long staffUserId) {
        // subject: SUPPORT:{customerId}
        Long customerId = parseSupportCustomerId(thread.getSubject());
        User customer = customerId != null
                ? userRepo.findById(customerId).orElse(null)
                : null;

        Message last = messageRepo.findTop1ByThreadOrderByCreatedAtDesc(thread);

        String lastPreview = null;
        LocalDateTime lastTime = thread.getCreatedAt();
        if (last != null) {
            lastPreview = (last.getContentText() != null && !last.getContentText().isBlank())
                    ? last.getContentText()
                    : "[Ảnh]";
            lastTime = last.getCreatedAt();
        }

        long unread = messageRepo.countUnreadByThreadAndUser(thread.getId(), staffUserId);

        return MessageThreadSummaryDto.builder()
                .id(thread.getId())
                .subject(thread.getSubject())
                .otherUserId(customer != null ? customer.getId() : null)
                .otherUserName(customer != null ? customer.getName() : "Khách hàng")
                .lastMessagePreview(lastPreview)
                .lastMessageTime(lastTime)
                .unreadCount(unread)
                .build();
    }

    private Long parseSupportCustomerId(String subject) {
        // "SUPPORT:{customerId}"
        if (subject == null || !subject.startsWith("SUPPORT:")) return null;
        try {
            return Long.parseLong(subject.substring("SUPPORT:".length()));
        } catch (NumberFormatException ex) {
            return null;
        }
    }

    /* =========================
       2. THREAD LIST: DIRECT (PAGED)
       ========================= */

    @Transactional(readOnly = true)
    public Page<MessageThreadSummaryDto> getDirectThreadsForUser(Long userId, Pageable pageable) {
        Page<MessageThread> threads = threadRepo.findDirectThreadsForUser(userId, pageable);

        List<MessageThreadSummaryDto> content = threads.getContent().stream()
                .map(thread -> buildThreadSummaryForDirect(thread, userId))
                .collect(Collectors.toList());

        return new PageImpl<>(content, threads.getPageable(), threads.getTotalElements());
    }

    private MessageThreadSummaryDto buildThreadSummaryForDirect(MessageThread thread, Long currentUserId) {
        // subject: DIRECT:{userAId}:{userBId}
        Long otherId = parseDirectOtherUserId(thread.getSubject(), currentUserId);
        User other = otherId != null
                ? userRepo.findById(otherId).orElse(null)
                : null;

        Message last = messageRepo.findTop1ByThreadOrderByCreatedAtDesc(thread);

        String lastPreview = null;
        LocalDateTime lastTime = thread.getCreatedAt();
        if (last != null) {
            lastPreview = (last.getContentText() != null && !last.getContentText().isBlank())
                    ? last.getContentText()
                    : "[Ảnh]";
            lastTime = last.getCreatedAt();
        }

        long unread = messageRepo.countUnreadByThreadAndUser(thread.getId(), currentUserId);

        return MessageThreadSummaryDto.builder()
                .id(thread.getId())
                .subject(thread.getSubject())
                .otherUserId(other != null ? other.getId() : null)
                .otherUserName(other != null ? other.getName() : "Người dùng")
                .lastMessagePreview(lastPreview)
                .lastMessageTime(lastTime)
                .unreadCount(unread)
                .build();
    }

    private Long parseDirectOtherUserId(String subject, Long currentUserId) {
        // DIRECT:{userA}:{userB}
        if (subject == null || !subject.startsWith("DIRECT:")) return null;
        String body = subject.substring("DIRECT:".length());
        String[] parts = body.split(":");
        if (parts.length != 2) return null;
        try {
            Long u1 = Long.parseLong(parts[0]);
            Long u2 = Long.parseLong(parts[1]);
            if (Objects.equals(u1, currentUserId)) return u2;
            if (Objects.equals(u2, currentUserId)) return u1;
            return null;
        } catch (NumberFormatException ex) {
            return null;
        }
    }

    /* =========================
       2b. SUPPORT THREAD CHO USER
       ========================= */

    @Transactional
    public MessageThread getOrCreateSupportThread(Long customerId) {
        String subject = "SUPPORT:" + customerId;

        return threadRepo.findFirstBySubjectOrderByIdDesc(subject)
                .orElseGet(() -> {
                    MessageThread t = new MessageThread();
                    t.setSubject(subject);
                    t.setCreatedBy(customerId);
                    t.setCreatedAt(LocalDateTime.now());
                    return threadRepo.save(t);
                });
    }

    /* =========================
       3. GET MESSAGES: MAP attachments + read flag
       ========================= */

    @Transactional(readOnly = true)
    public Page<MessageDto> getMessages(Long threadId, Long currentUserId, Pageable pageable) {
        MessageThread thread = threadRepo.findById(threadId)
                .orElseThrow(() -> new RuntimeException("Thread not found"));

        Page<Message> messagePage = messageRepo.findByThreadOrderByCreatedAtAsc(thread, pageable);

        List<Long> messageIds = messagePage.getContent().stream()
                .map(Message::getId)
                .toList();

        // read flags
        List<MessageRead> reads = messageReadRepo.findByUserIdAndMessageIdIn(currentUserId, messageIds);
        Set<Long> readMessageIds = reads.stream()
                .map(MessageRead::getMessageId)
                .collect(Collectors.toSet());


        // attachments
        List<MessageMedia> medias = messageMediaRepo.findAllByMessageIdInWithMedia(messageIds);
        Map<Long, List<AttachmentDto>> attachmentsByMessage = medias.stream()
                .collect(Collectors.groupingBy(
                        mm -> mm.getMessage().getId(),
                        Collectors.mapping(this::toAttachmentDto, Collectors.toList())
                ));

        List<MessageDto> dtoList = messagePage.getContent().stream()
                .map(m -> toMessageDto(m, currentUserId, readMessageIds, attachmentsByMessage))
                .collect(Collectors.toList());

        return new PageImpl<>(dtoList, messagePage.getPageable(), messagePage.getTotalElements());
    }

    private AttachmentDto toAttachmentDto(MessageMedia mm) {
        Media m = mm.getMedia();
        return AttachmentDto.builder()
                .id(m.getId())
                .url(m.getUrl())
                .mimeType(m.getMimeType())
                .sizeBytes(m.getSizeBytes())
                .width(m.getWidth())
                .height(m.getHeight())
                .altText(m.getAltText())
                .build();
    }

    private MessageDto toMessageDto(Message m,
                                    Long currentUserId,
                                    Set<Long> readMessageIds,
                                    Map<Long, List<AttachmentDto>> attachmentsByMessage) {
        boolean mine = Objects.equals(m.getSender().getId(), currentUserId);
        boolean read = readMessageIds.contains(m.getId());

        List<AttachmentDto> attachments = attachmentsByMessage.getOrDefault(
                m.getId(),
                Collections.emptyList()
        );

        return MessageDto.builder()
                .id(m.getId())
                .threadId(m.getThread().getId())
                .senderId(m.getSender().getId())
                .senderName(m.getSender().getName())
                .contentText(m.getContentText())
                .createdAt(m.getCreatedAt())
                .mine(mine)
                .read(read)
                .attachments(attachments)
                .build();
    }

    /* =========================
       4. MARK READ
       ========================= */

    @Transactional
    public void markThreadMessagesAsRead(Long threadId, Long userId) {
        MessageThread thread = threadRepo.findById(threadId)
                .orElseThrow(() -> new RuntimeException("Thread not found"));

        // lấy tất cả messages trong thread (unpaged)
        List<Message> messages = messageRepo
                .findByThreadOrderByCreatedAtAsc(thread, Pageable.unpaged())
                .getContent();

        if (messages.isEmpty()) {
            return;
        }

        // list id của tất cả messages
        List<Long> ids = messages.stream()
                .map(Message::getId)
                .toList();

        // các bản ghi read hiện có của user này trên các message đó
        List<MessageRead> existing = messageReadRepo.findByUserIdAndMessageIdIn(userId, ids);

        // những messageId đã được user này đọc rồi
        Set<Long> existingIds = existing.stream()
                .map(MessageRead::getMessageId)   // 🔥 dùng field trực tiếp
                .collect(Collectors.toSet());

        List<MessageRead> toSave = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        for (Message msg : messages) {
            // không tính tin mình gửi
            if (Objects.equals(msg.getSenderId(), userId)) {
                continue;
            }

            // nếu đã có record read thì bỏ qua
            if (existingIds.contains(msg.getId())) {
                continue;
            }

            // tạo record mới
            MessageRead r = MessageRead.builder()
                    .messageId(msg.getId())
                    .userId(userId)
                    .readAt(now)
                    .build();

            toSave.add(r);
        }

        if (!toSave.isEmpty()) {
            messageReadRepo.saveAll(toSave);
        }
    }


    /* =========================
       5. SEND MESSAGE + UPLOAD ẢNH + REALTIME
       ========================= */

    @Transactional
    public MessageDto sendMessageToThread(Long threadId, Long senderId, String text, MultipartFile[] files) {
        // 1. Lấy thread + user gửi
        MessageThread thread = threadRepo.findById(threadId)
                .orElseThrow(() -> new RuntimeException("Thread not found"));

        User sender = userRepo.findById(senderId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Tạo message
        Message message = new Message();
        message.setThread(thread);
        message.setSenderId(senderId);          // ✅ dùng senderId, không có setSender(...)
        message.setContentText(text);
        message.setStatus("visible");
        message.setCreatedAt(LocalDateTime.now());

        message = messageRepo.save(message);

        // 3. Upload & link media
        List<AttachmentDto> attachments = new ArrayList<>();
        int sort = 0;

        if (files != null) {
            for (MultipartFile file : files) {
                if (file == null || file.isEmpty()) continue;

                String url = cloudinaryService.uploadFile(file, "messages");

                Media media = new Media();
                media.setUrl(url);
                media.setMimeType(file.getContentType());
                media.setSizeBytes(file.getSize());
                media.setCreatedAt(LocalDateTime.now());
                // createdBy là User, nên set User, không set Long
                media.setCreatedBy(sender);     // ✅ đúng với lỗi bạn báo

                media = mediaRepo.save(media);

                MessageMedia mm = new MessageMedia();
                mm.setId(new MessageMediaId(message.getId(), media.getId()));
                mm.setMessage(message);
                mm.setMedia(media);
                mm.setSortOrder(sort++);
                messageMediaRepo.save(mm);

                attachments.add(toAttachmentDto(mm));
            }
        }

        // 4. Đánh dấu tin của chính mình là đã đọc
        MessageRead selfRead = new MessageRead();
        selfRead.setMessageId(message.getId());            // ✅ field có thật
        selfRead.setUserId(senderId);                     // ✅ field có thật
        selfRead.setReadAt(LocalDateTime.now());
        messageReadRepo.save(selfRead);

        // 5. Build DTO trả về
        MessageDto dto = MessageDto.builder()
                .id(message.getId())
                .threadId(thread.getId())
                .senderId(senderId)
                .senderName(sender.getName())
                .contentText(message.getContentText())
                .createdAt(message.getCreatedAt())
                .mine(true)
                .read(true)
                .attachments(attachments)
                .build();

        // 6. Đẩy realtime cho tất cả client subscribe thread này
        chatEventPublisher.publishNewMessage(dto);

        return dto;
    }


    @Transactional
    public MessageThread getOrCreateDirectThread(Long userAId, Long userBId) {
        // tạo subject cố định để 2 user luôn dùng 1 thread
        Long u1 = Math.min(userAId, userBId);
        Long u2 = Math.max(userAId, userBId);
        String subject = "DIRECT:" + u1 + ":" + u2;

        return threadRepo.findFirstBySubjectOrderByIdDesc(subject)
                .orElseGet(() -> {
                    MessageThread t = new MessageThread();
                    t.setSubject(subject);
                    t.setCreatedBy(userAId); // ai gửi tin đầu tiên
                    t.setCreatedAt(LocalDateTime.now());
                    return threadRepo.save(t);
                });
    }



    private SimpleUserDto toSimpleUserDto(User u) {
        return SimpleUserDto.builder()
                .id(u.getId())
                .name(u.getName())
                .email(u.getEmail())
                .build();
    }

    // 🔹 danh sách nhân viên nội bộ cho tab "Nội bộ"
    @Transactional(readOnly = true)
    public List<SimpleUserDto> getStaffUsersForChat() {
        var staffRoleCodes = List.of(
                "ADMIN",
                "PRODUCT_MANAGER",
                "ORDER_MANAGER",
                "CUSTOMER_SERVICE",
                "MARKETING_STAFF",
                "ACCOUNTANT"
        );
        var users = userRepo.findStaffUsersByRoleCodes(staffRoleCodes);
        return users.stream()
                .map(this::toSimpleUserDto)
                .toList();
    }

    // 🔹 danh sách khách hàng (ROLE USER) cho tab "Khách hàng"
    @Transactional(readOnly = true)
    public List<SimpleUserDto> getCustomerUsersForChat() {
        var users = userRepo.findUsersByRoleCode("USER");
        return users.stream()
                .map(this::toSimpleUserDto)
                .toList();
    }

    // 🔹 tạo / lấy DIRECT thread và trả summary cho current user
    @Transactional
    public MessageThreadSummaryDto getOrCreateDirectThreadForUser(Long currentUserId, Long otherUserId) {
        MessageThread t = getOrCreateDirectThread(currentUserId, otherUserId);
        return buildThreadSummaryForDirect(t, currentUserId);
    }

    // 🔹 tạo / lấy SUPPORT thread cho 1 customer và trả summary cho staff
    @Transactional
    public MessageThreadSummaryDto getOrCreateSupportThreadForStaff(Long staffUserId, Long customerId) {
        MessageThread t = getOrCreateSupportThread(customerId);
        return buildThreadSummaryForStaff(t, staffUserId);
    }
}

