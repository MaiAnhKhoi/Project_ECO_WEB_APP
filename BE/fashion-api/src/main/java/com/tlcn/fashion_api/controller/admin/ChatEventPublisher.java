package com.tlcn.fashion_api.controller.admin;

import com.tlcn.fashion_api.dto.response.message.MessageDto;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ChatEventPublisher {

    private final SimpMessagingTemplate messagingTemplate;

    public void publishNewMessage(MessageDto dto) {
        // Mỗi thread sẽ có 1 topic riêng
        String destination = "/topic/threads/" + dto.getThreadId();
        messagingTemplate.convertAndSend(destination, dto);
    }
}
