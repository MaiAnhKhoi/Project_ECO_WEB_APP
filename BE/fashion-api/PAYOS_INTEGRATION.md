# 💳 PayOS Integration Guide

## 📋 Overview

PayOS là payment gateway Việt Nam, hỗ trợ nhiều phương thức thanh toán: QR Code, ATM, Visa/Mastercard, MoMo, ZaloPay, etc.

## 🔑 Lấy Credentials

1. Đăng ký tại: https://payos.vn/
2. Vào Dashboard > API Keys
3. Lấy:
   - **Client ID**
   - **API Key**
   - **Checksum Key**
   - **Partner Code**

## ⚙️ Configuration (Đã setup sẵn)

Trong `application.properties`:
```properties
app.payment.payos.client-id=${PAYOS_CLIENT_ID:}
app.payment.payos.api-key=${PAYOS_API_KEY:}
app.payment.payos.checksum-key=${PAYOS_CHECKSUM_KEY:}
app.payment.payos.partner-code=${PAYOS_PARTNER_CODE:}
app.payment.payos.return-url=${PAYOS_RETURN_URL:http://localhost:3000/payment/payos/callback}
app.payment.payos.cancel-url=${PAYOS_CANCEL_URL:http://localhost:3000/payment/payos/cancel}
```

## 🛠️ Implementation

### 1. Thêm dependency vào `pom.xml`

```xml
<!-- PayOS SDK -->
<dependency>
    <groupId>vn.payos</groupId>
    <artifactId>payos</artifactId>
    <version>1.0.0</version>
</dependency>

<!-- Hoặc dùng HTTP Client -->
<dependency>
    <groupId>com.squareup.okhttp3</groupId>
    <artifactId>okhttp</artifactId>
    <version>4.12.0</version>
</dependency>
```

### 2. PayOS Configuration Class

```java
package com.tlcn.fashion_api.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "app.payment.payos")
public class PayOSConfig {
    private String clientId;
    private String apiKey;
    private String checksumKey;
    private String partnerCode;
    private String returnUrl;
    private String cancelUrl;
}
```

### 3. PayOS Service

```java
package com.tlcn.fashion_api.service.payment;

import com.tlcn.fashion_api.config.PayOSConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import okhttp3.*;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import com.fasterxml.jackson.databind.ObjectMapper;

@Slf4j
@Service
@RequiredArgsConstructor
public class PayOSService {
    
    private final PayOSConfig payOSConfig;
    private final ObjectMapper objectMapper;
    private static final String PAYOS_API_URL = "https://api.payos.vn/v2/payment-requests";
    
    /**
     * Tạo payment link
     */
    public PaymentResponse createPaymentLink(PaymentRequest request) {
        try {
            // Build request body
            String requestBody = objectMapper.writeValueAsString(request);
            String signature = generateSignature(requestBody);
            
            // Call PayOS API
            OkHttpClient client = new OkHttpClient();
            Request httpRequest = new Request.Builder()
                .url(PAYOS_API_URL)
                .addHeader("x-client-id", payOSConfig.getClientId())
                .addHeader("x-api-key", payOSConfig.getApiKey())
                .addHeader("x-partner-code", payOSConfig.getPartnerCode())
                .addHeader("x-signature", signature)
                .addHeader("Content-Type", "application/json")
                .post(RequestBody.create(requestBody, MediaType.get("application/json")))
                .build();
            
            Response response = client.newCall(httpRequest).execute();
            String responseBody = response.body().string();
            
            if (response.isSuccessful()) {
                return objectMapper.readValue(responseBody, PaymentResponse.class);
            } else {
                log.error("PayOS API error: {}", responseBody);
                throw new RuntimeException("Failed to create payment link");
            }
            
        } catch (Exception e) {
            log.error("Error creating PayOS payment", e);
            throw new RuntimeException("Payment creation failed", e);
        }
    }
    
    /**
     * Xác thực callback từ PayOS
     */
    public boolean verifyCallback(String signature, String data) {
        try {
            String expectedSignature = generateSignature(data);
            return signature.equals(expectedSignature);
        } catch (Exception e) {
            log.error("Error verifying PayOS callback", e);
            return false;
        }
    }
    
    /**
     * Tạo signature cho request
     */
    private String generateSignature(String data) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKeySpec = new SecretKeySpec(
            payOSConfig.getChecksumKey().getBytes(StandardCharsets.UTF_8),
            "HmacSHA256"
        );
        mac.init(secretKeySpec);
        byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
        return Base64.getEncoder().encodeToString(hash);
    }
    
    /**
     * Kiểm tra trạng thái thanh toán
     */
    public PaymentStatusResponse checkPaymentStatus(String orderId) {
        try {
            OkHttpClient client = new OkHttpClient();
            Request request = new Request.Builder()
                .url(PAYOS_API_URL + "/" + orderId)
                .addHeader("x-client-id", payOSConfig.getClientId())
                .addHeader("x-api-key", payOSConfig.getApiKey())
                .get()
                .build();
            
            Response response = client.newCall(request).execute();
            String responseBody = response.body().string();
            
            if (response.isSuccessful()) {
                return objectMapper.readValue(responseBody, PaymentStatusResponse.class);
            } else {
                log.error("PayOS status check error: {}", responseBody);
                throw new RuntimeException("Failed to check payment status");
            }
            
        } catch (Exception e) {
            log.error("Error checking PayOS payment status", e);
            throw new RuntimeException("Payment status check failed", e);
        }
    }
}
```

### 4. DTOs

```java
// PaymentRequest.java
package com.tlcn.fashion_api.dto.payment;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PaymentRequest {
    private String orderCode;        // Mã đơn hàng của bạn
    private Long amount;             // Số tiền (VND)
    private String description;      // Mô tả
    private String returnUrl;        // URL callback success
    private String cancelUrl;        // URL callback cancel
    private String buyerName;        // Tên người mua (optional)
    private String buyerEmail;       // Email người mua (optional)
    private String buyerPhone;       // SĐT người mua (optional)
}

// PaymentResponse.java
@Data
public class PaymentResponse {
    private String code;             // Response code
    private String desc;             // Description
    private PaymentData data;
    
    @Data
    public static class PaymentData {
        private String bin;
        private String accountNumber;
        private String accountName;
        private Long amount;
        private String description;
        private String orderCode;
        private String paymentLinkId;
        private String status;
        private String checkoutUrl;    // URL để redirect user
        private String qrCode;         // QR code URL
    }
}

// PaymentStatusResponse.java
@Data
public class PaymentStatusResponse {
    private String code;
    private String desc;
    private PaymentStatusData data;
    
    @Data
    public static class PaymentStatusData {
        private String orderCode;
        private Long amount;
        private String description;
        private String status;         // "PAID", "PENDING", "CANCELLED"
        private String transactionDateTime;
    }
}
```

### 5. Payment Controller

```java
package com.tlcn.fashion_api.controller;

import com.tlcn.fashion_api.dto.payment.*;
import com.tlcn.fashion_api.service.payment.PayOSService;
import com.tlcn.fashion_api.service.order.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/payment/payos")
@RequiredArgsConstructor
public class PayOSController {
    
    private final PayOSService payOSService;
    private final OrderService orderService;
    
    /**
     * Tạo payment link cho đơn hàng
     */
    @PostMapping("/create")
    public ResponseEntity<PaymentResponse> createPayment(@RequestBody CreatePaymentDTO dto) {
        try {
            // Lấy thông tin order
            var order = orderService.findById(dto.getOrderId());
            
            // Tạo payment request
            PaymentRequest request = PaymentRequest.builder()
                .orderCode(order.getOrderNumber())
                .amount(order.getTotalAmount().longValue())
                .description("Thanh toán đơn hàng " + order.getOrderNumber())
                .returnUrl(payOSConfig.getReturnUrl())
                .cancelUrl(payOSConfig.getCancelUrl())
                .buyerName(order.getCustomerName())
                .buyerEmail(order.getCustomerEmail())
                .buyerPhone(order.getCustomerPhone())
                .build();
            
            // Gọi PayOS API
            PaymentResponse response = payOSService.createPaymentLink(request);
            
            // Lưu payment info vào database
            // paymentService.savePayment(order, response);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error creating PayOS payment", e);
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Callback từ PayOS sau khi thanh toán
     */
    @GetMapping("/callback")
    public ResponseEntity<String> handleCallback(
        @RequestParam String code,
        @RequestParam String id,
        @RequestParam String orderCode,
        @RequestParam String status,
        @RequestParam(required = false) String cancel
    ) {
        try {
            log.info("PayOS callback: code={}, orderCode={}, status={}", code, orderCode, status);
            
            // Kiểm tra trạng thái thanh toán
            if ("00".equals(code) && "PAID".equals(status)) {
                // Thanh toán thành công
                orderService.updatePaymentStatus(orderCode, "PAID");
                return ResponseEntity.ok("Payment successful");
            } else {
                // Thanh toán thất bại
                orderService.updatePaymentStatus(orderCode, "FAILED");
                return ResponseEntity.ok("Payment failed");
            }
            
        } catch (Exception e) {
            log.error("Error handling PayOS callback", e);
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Webhook từ PayOS (để xử lý real-time)
     */
    @PostMapping("/webhook")
    public ResponseEntity<String> handleWebhook(
        @RequestHeader("x-signature") String signature,
        @RequestBody String payload
    ) {
        try {
            // Verify signature
            if (!payOSService.verifyCallback(signature, payload)) {
                log.warn("Invalid PayOS webhook signature");
                return ResponseEntity.badRequest().body("Invalid signature");
            }
            
            // Parse webhook data
            var webhookData = objectMapper.readValue(payload, WebhookData.class);
            
            // Xử lý webhook
            if ("PAID".equals(webhookData.getStatus())) {
                orderService.updatePaymentStatus(webhookData.getOrderCode(), "PAID");
            }
            
            return ResponseEntity.ok("Success");
            
        } catch (Exception e) {
            log.error("Error handling PayOS webhook", e);
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Kiểm tra trạng thái thanh toán
     */
    @GetMapping("/status/{orderCode}")
    public ResponseEntity<PaymentStatusResponse> checkStatus(@PathVariable String orderCode) {
        try {
            PaymentStatusResponse status = payOSService.checkPaymentStatus(orderCode);
            return ResponseEntity.ok(status);
        } catch (Exception e) {
            log.error("Error checking payment status", e);
            return ResponseEntity.badRequest().build();
        }
    }
}
```

## 🔄 Payment Flow

### Backend Flow:
```
1. User checkout → POST /api/orders (tạo order)
2. Frontend gọi → POST /api/payment/payos/create
3. Backend trả về checkoutUrl
4. Frontend redirect user đến checkoutUrl
5. User thanh toán trên PayOS
6. PayOS redirect về returnUrl (frontend)
7. PayOS gọi webhook (backend) để confirm
8. Backend update order status
```

### React Integration:

```typescript
// src/services/payment.ts
export const createPayOSPayment = async (orderId: number) => {
  const response = await fetch(`${API_BASE_URL}/payment/payos/create`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ orderId })
  });
  
  const data = await response.json();
  return data;
};

// Component
const handlePayment = async () => {
  try {
    const payment = await createPayOSPayment(orderId);
    
    if (payment.data?.checkoutUrl) {
      // Redirect to PayOS checkout page
      window.location.href = payment.data.checkoutUrl;
    }
  } catch (error) {
    console.error('Payment failed:', error);
  }
};

// Callback page (PaymentCallback.tsx)
const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');
  const orderCode = searchParams.get('orderCode');
  const status = searchParams.get('status');
  
  useEffect(() => {
    if (code === '00' && status === 'PAID') {
      // Thanh toán thành công
      navigate(`/orders/${orderCode}?success=true`);
    } else {
      // Thanh toán thất bại
      navigate(`/orders/${orderCode}?failed=true`);
    }
  }, [code, status]);
  
  return <div>Đang xử lý thanh toán...</div>;
};
```

## 🧪 Testing

### Sandbox Mode:
PayOS cung cấp môi trường test với các thẻ test:
- Thẻ test thành công: `9704 0000 0000 0018`
- CVV: bất kỳ
- OTP: `123456`

### Test Flow:
1. Tạo payment → Nhận checkoutUrl
2. Mở checkoutUrl
3. Chọn phương thức thanh toán test
4. Nhập thông tin thẻ test
5. Xác nhận → PayOS sẽ gọi webhook/callback

## 📊 Payment Status

| Status | Meaning |
|--------|---------|
| PENDING | Đang chờ thanh toán |
| PAID | Đã thanh toán thành công |
| CANCELLED | Đã hủy |
| EXPIRED | Hết hạn |

## 🔐 Security Notes

- ✅ Luôn verify signature trong webhook
- ✅ Dùng HTTPS trong production
- ✅ Không expose API keys trong frontend
- ✅ Log tất cả payment transactions
- ✅ Implement idempotency để tránh duplicate payments

## 📚 Tài Liệu

- Official Docs: https://docs.payos.vn/
- Dashboard: https://my.payos.vn/
- Support: support@payos.vn

---

**Xong! PayOS đã sẵn sàng! 💳**

