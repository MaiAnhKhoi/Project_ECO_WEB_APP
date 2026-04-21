package com.tlcn.fashion_api.sepay;


import com.tlcn.fashion_api.dto.request.sepay.SepayTransactionDto;
import com.tlcn.fashion_api.dto.response.sepay.SepayListResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
@Slf4j
public class SepayClient {

    @Value("${sepay.api-token}")
    private String apiToken;

    @Value("${sepay.bank-account-number}")
    private String bankAccountNumber;

    private final RestTemplate restTemplate = new RestTemplate();
    private final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    /**
     * Tìm giao dịch TIỀN RA tương ứng refund
     */
    public Optional<SepayTransactionDto> findOutgoingTransactionForRefund(
            BigDecimal amount,
            String refundCode,
            LocalDateTime fromDate
    ) {

        String url = UriComponentsBuilder
                .fromHttpUrl("https://my.sepay.vn/userapi/transactions/list")
                .queryParam("account_number", bankAccountNumber)
                .queryParam("transaction_date_min", fromDate.format(FMT))
                .queryParam("amount_out", amount.longValue())
                .queryParam("limit", 50)
                .toUriString();

        log.info("🔎 Calling SePay: {}", url);

        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));
        headers.setBearerAuth(apiToken);

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<SepayListResponse> res = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    SepayListResponse.class
            );

            if (!res.getStatusCode().is2xxSuccessful() || res.getBody() == null) {
                log.warn("⚠ SePay trả mã HTTP {}", res.getStatusCodeValue());
                return Optional.empty();
            }

            List<SepayTransactionDto> txs = res.getBody().getTransactions();
            if (txs == null || txs.isEmpty()) {
                return Optional.empty();
            }

            return txs.stream()
                    .filter(tx -> tx.getTransaction_content() != null
                            && tx.getTransaction_content().contains(refundCode))
                    .findFirst();

        } catch (Exception e) {
            log.error("🔥 Lỗi gọi SePay API", e);
            return Optional.empty();
        }
    }
}
