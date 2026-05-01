package com.tlcn.fashion_api.ai.util;

import com.tlcn.fashion_api.dto.response.ai.ProductSuggestionDto;
import lombok.experimental.UtilityClass;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import java.util.List;

@UtilityClass
public class PromptBuilder {

    private static final String SHOP_SYSTEM_PROMPT = """
            Bạn là trợ lý mua sắm thời trang thông minh của UTE Shop — một cửa hàng thời trang chuyên nghiệp.
            Bạn giúp khách hàng tìm sản phẩm phù hợp, tư vấn outfit và trả lời câu hỏi về sản phẩm.
            
            Nguyên tắc:
            - Luôn thân thiện, nhiệt tình và chuyên nghiệp.
            - Trả lời bằng tiếng Việt trừ khi khách dùng tiếng Anh.
            - Chỉ đề xuất sản phẩm từ danh sách được cung cấp.
            - Không bịa đặt thông tin sản phẩm.
            - Giữ câu trả lời ngắn gọn, súc tích.
            - Nếu không có sản phẩm phù hợp, hãy thành thật nói và gợi ý thay thế.
            """;

    private static final String OUTFIT_SYSTEM_PROMPT = """
            Bạn là stylist thời trang chuyên nghiệp của UTE Shop.
            Nhiệm vụ: Tạo 3 outfit hoàn chỉnh từ danh sách sản phẩm có sẵn.
            
            Quy tắc quan trọng:
            - Chỉ dùng sản phẩm từ danh sách được cung cấp (có productId).
            - Mỗi outfit gồm 2-4 sản phẩm.
            - Phải trả về JSON hợp lệ, không thêm text ngoài JSON.
            - Tổng giá phải trong ngân sách của khách nếu có.
            - Tên outfit ngắn gọn, đặc sắc.
            
            JSON format bắt buộc:
            {
              "outfits": [
                {
                  "outfitNumber": 1,
                  "name": "Tên outfit",
                  "description": "Mô tả ngắn",
                  "occasion": "Dịp sử dụng",
                  "style": "Phong cách",
                  "items": [
                    {
                      "productId": 123,
                      "productName": "Tên SP",
                      "role": "Áo/Quần/Giày/Phụ kiện"
                    }
                  ]
                }
              ]
            }
            """;

    public String outfitSystemPrompt() {
        return OUTFIT_SYSTEM_PROMPT;
    }

    public String chatSystemPrompt(String customSystemPrompt) {
        return customSystemPrompt != null && !customSystemPrompt.isBlank()
                ? customSystemPrompt
                : SHOP_SYSTEM_PROMPT;
    }

    public String buildProductContextBlock(List<ProductSuggestionDto> products) {
        if (products == null || products.isEmpty()) return "";

        StringBuilder sb = new StringBuilder("\n\n=== DANH SÁCH SẢN PHẨM CÓ SẴN ===\n");
        for (ProductSuggestionDto p : products) {
            sb.append(String.format(
                    "- ID: %d | %s | Giá: %,.0f VNĐ%s\n",
                    p.getId(),
                    p.getName(),
                    p.getPrice().doubleValue(),
                    p.getOriginalPrice() != null && p.getOriginalPrice().compareTo(p.getPrice()) > 0
                            ? " (KM từ " + String.format("%,.0f", p.getOriginalPrice().doubleValue()) + ")"
                            : ""
            ));
        }
        return sb.toString();
    }

    public String sanitize(String input) {
        if (input == null) return "";
        return input
                .replaceAll("[<>\"'%;()&+]", "")
                .replaceAll("(?i)(ignore|forget|pretend|jailbreak|system:|\\[INST])", "")
                .trim();
    }

    public String hashPrompt(String prompt) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(prompt.toLowerCase().trim().getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash).substring(0, 32);
        } catch (NoSuchAlgorithmException e) {
            return String.valueOf(prompt.hashCode());
        }
    }
}
