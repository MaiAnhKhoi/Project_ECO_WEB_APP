package com.tlcn.fashion_api.dto.response.product;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdditionalInfoItem {
    private String label;
    private String value;
}