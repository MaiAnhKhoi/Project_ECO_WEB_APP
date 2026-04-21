package com.tlcn.fashion_api.payos;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tlcn.fashion_api.config.PayOSConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
@Slf4j
public class PayOSClient {

    private final PayOSConfig payOSConfig;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Gọi PayOS để lấy trạng thái 1 payment-request
     * @param paymentLinkId: chính là id (txnRef) mà PayOS trả về khi createPaymentLink
     * @return "PAID", "PENDING", "CANCELLED", "FAILED", "EXPIRED"... (tuỳ PayOS)
     */
    public String getPaymentStatus(String paymentLinkId) {
        if (paymentLinkId == null || paymentLinkId.isBlank()) {
            log.warn("⚠ paymentLinkId rỗng, không gọi PayOS.");
            return "UNKNOWN";
        }

        String url = "https://api-merchant.payos.vn/v2/payment-requests/" + paymentLinkId;
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setAccept(java.util.List.of(MediaType.APPLICATION_JSON));
            headers.add("x-client-id", payOSConfig.getClientId());
            headers.add("x-api-key", payOSConfig.getApiKey());

            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<String> res = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    String.class
            );

            log.info("🔎 PayOS GET payment-requests status={}, body={}",
                    res.getStatusCodeValue(), res.getBody());

            if (!res.getStatusCode().is2xxSuccessful()) {
                log.warn("⚠ PayOS trả HTTP {} khi check status", res.getStatusCodeValue());
                return "UNKNOWN";
            }

            JsonNode root = objectMapper.readTree(res.getBody());
            String code = root.path("code").asText("");
            if (!"00".equals(code)) {
                String desc = root.path("desc").asText("");
                log.warn("⚠ PayOS error code={} desc={}", code, desc);
                return "UNKNOWN";
            }

            JsonNode dataNode = root.path("data");
            String status = dataNode.path("status").asText("UNKNOWN");
            log.info("✅ PayOS status paymentLinkId={} => {}", paymentLinkId, status);
            return status;

        } catch (Exception e) {
            log.error("🔥 Lỗi gọi PayOS getPaymentStatus", e);
            return "UNKNOWN";
        }
    }

    /**
     * Gọi PayOS REFUND một giao dịch đã thanh toán
     * @param paymentLinkId: ID của payment-request (txnRef)
     * @param amount: số tiền hoàn (long)
     * @param description: lý do hoàn tiền
     */
   public boolean refundPayment(String paymentLinkId, long amount, String description) {
       if (paymentLinkId == null || paymentLinkId.isBlank()) {
           log.warn("⚠ paymentLinkId rỗng, không gọi refund.");
           return false;
       }

       String url = "https://api-merchant.payos.vn/v2/payment-requests/" + paymentLinkId + "/refund";

       try {
           HttpHeaders headers = new HttpHeaders();
           headers.setContentType(MediaType.APPLICATION_JSON);
           headers.setAccept(java.util.List.of(MediaType.APPLICATION_JSON));
           headers.add("x-client-id", payOSConfig.getClientId());
           headers.add("x-api-key", payOSConfig.getApiKey());

           // body JSON theo format PayOS yêu cầu
           String jsonBody = objectMapper.createObjectNode()
                   .put("amount", amount)
                   .put("description", description)
                   .toString();

           HttpEntity<String> entity = new HttpEntity<>(jsonBody, headers);

           ResponseEntity<String> res = restTemplate.exchange(
                   url,
                   HttpMethod.POST,
                   entity,
                   String.class
           );

           log.info("↩️ PayOS REFUND status={}, body={}",
                   res.getStatusCodeValue(), res.getBody());

           if (!res.getStatusCode().is2xxSuccessful()) {
               log.error("❌ PayOS refund HTTP {}", res.getStatusCodeValue());
               return false;
           }

           JsonNode root = objectMapper.readTree(res.getBody());
           String code = root.path("code").asText("");

           if (!"00".equals(code)) {
               log.error("❌ PayOS refund error code={} desc={}",
                       code,
                       root.path("desc").asText(""));
               return false;
           }

           log.info("💰 REFUND thành công cho paymentLinkId={} số tiền={}",
                   paymentLinkId, amount);
           return true;

       } catch (Exception e) {
           log.error("🔥 Lỗi refundPayOS", e);
           return false;
       }
   }

}