package com.tlcn.fashion_api.dto.response.ai;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ChatResponse {

    private Long conversationId;
    private String sessionId;
    private String reply;
    private List<ProductSuggestionDto> suggestedProducts;
    private Integer tokensUsed;
    private boolean fromCache;
}
