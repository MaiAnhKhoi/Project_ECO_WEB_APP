package com.tlcn.fashion_api.repository.product;

public interface VariantAttributeProjection {
    String getAttributeName();   // Color / Size
    String getAttributeValues(); // "S, M, L" hoặc "White, Black"
}