package com.tlcn.fashion_api.dto.request;

import lombok.Data;

@Data
public class WishlistItemRequest {
    private Long productId;
    private Long variantId;
}
