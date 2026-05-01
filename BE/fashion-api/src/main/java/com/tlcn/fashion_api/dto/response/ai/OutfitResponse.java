package com.tlcn.fashion_api.dto.response.ai;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class OutfitResponse {

    private String originalPrompt;
    private List<OutfitDto> outfits;
    private Integer tokensUsed;
    private boolean fromCache;
    private Long logId;
}
