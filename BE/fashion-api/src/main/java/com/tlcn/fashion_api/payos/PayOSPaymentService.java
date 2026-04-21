package com.tlcn.fashion_api.payos;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tlcn.fashion_api.config.PayOSConfig;
import com.tlcn.fashion_api.entity.order.Order;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PayOSPaymentService {

    private final PayOSConfig payOSConfig;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final RestTemplate restTemplate = new RestTemplate();

    public PayOSCreatePaymentLinkResponse createPaymentLink(Order order) {
        long orderCode = order.getId(); // tạm dùng orderId làm orderCode
        long amount = order.getGrandTotal().longValue();

        String description = "Order " + order.getId();
        String returnUrl = payOSConfig.getReturnUrl();
        String cancelUrl = payOSConfig.getCancelUrl();

        // ====== BODY GỬI SANG PAYOS ======
        Map<String, Object> body = new HashMap<>();
        body.put("orderCode", orderCode);
        body.put("amount", amount);
        body.put("description", description);
        body.put("cancelUrl", cancelUrl);
        body.put("returnUrl", returnUrl);

        // signature đúng theo docs:
        // amount=$amount&cancelUrl=$cancelUrl&description=$description&orderCode=$orderCode&returnUrl=$returnUrl
        String signature = buildSignature(amount, orderCode, description, returnUrl, cancelUrl);
        body.put("signature", signature);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("x-client-id", payOSConfig.getClientId());
        headers.set("x-api-key", payOSConfig.getApiKey());
        // nếu có partner-code thì:
        // headers.set("x-partner-code", "<PARTNER_CODE>");

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        ResponseEntity<String> res = restTemplate.postForEntity(
                "https://api-merchant.payos.vn/v2/payment-requests",
                entity,
                String.class
        );

        System.out.println("=== PAYOS HTTP STATUS: " + res.getStatusCodeValue());
        System.out.println("=== PAYOS RESPONSE BODY: " + res.getBody());

        if (!res.getStatusCode().is2xxSuccessful()) {
            throw new IllegalStateException("PayOS trả về HTTP " + res.getStatusCodeValue());
        }

        String responseBody = res.getBody();
        if (responseBody == null || responseBody.isBlank()) {
            throw new IllegalStateException("PayOS trả về body rỗng");
        }

        try {
            JsonNode root = objectMapper.readTree(responseBody);

            String code = root.path("code").asText();
            String desc = root.path("desc").asText();

            // theo docs: "00" là success
            if (!"00".equals(code)) {
                throw new IllegalStateException("PayOS error code=" + code + " desc=" + desc);
            }

            JsonNode data = root.path("data");

            PayOSCreatePaymentLinkResponse result = new PayOSCreatePaymentLinkResponse();
            result.setPaymentLinkId(data.path("paymentLinkId").asText(null));
            result.setCheckoutUrl(data.path("checkoutUrl").asText(null));
            result.setQrCode(data.path("qrCode").asText(null));

            if (result.getCheckoutUrl() == null || result.getCheckoutUrl().isBlank()) {
                throw new IllegalStateException("PayOS không trả về checkoutUrl");
            }

            return result;
        } catch (Exception e) {
            // log chi tiết để debug, nhưng quăng lỗi gọn cho FE
            e.printStackTrace();
            throw new IllegalStateException("Không parse được response PayOS", e);
        }
    }

    private String buildSignature(long amount,
                                  long orderCode,
                                  String description,
                                  String returnUrl,
                                  String cancelUrl) {
        // ĐÚNG THEO DOCS PAYOS:
        // amount=$amount&cancelUrl=$cancelUrl&description=$description&orderCode=$orderCode&returnUrl=$returnUrl
        String data = "amount=" + amount
                + "&cancelUrl=" + cancelUrl
                + "&description=" + description
                + "&orderCode=" + orderCode
                + "&returnUrl=" + returnUrl;

        try {
            Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(
                    payOSConfig.getChecksumKey().getBytes(StandardCharsets.UTF_8),
                    "HmacSHA256"
            );
            sha256_HMAC.init(secretKey);
            byte[] hash = sha256_HMAC.doFinal(data.getBytes(StandardCharsets.UTF_8));

            StringBuilder sb = new StringBuilder();
            for (byte b : hash) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (Exception e) {
            e.printStackTrace();
            throw new IllegalStateException("Không thể tạo signature PayOS", e);
        }
    }
}
