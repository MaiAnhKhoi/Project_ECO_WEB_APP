package com.tlcn.fashion_api.dto.response.product;

public interface ProductColorProjection {
    String getLabel(); // Đen / Trắng / Xanh navy
    String getValue(); // bg-black / bg-white / bg-navy ...
    String getImg();   // url image
}
