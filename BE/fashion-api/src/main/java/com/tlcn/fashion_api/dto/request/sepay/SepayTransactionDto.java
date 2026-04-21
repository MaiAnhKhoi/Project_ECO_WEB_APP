package com.tlcn.fashion_api.dto.request.sepay;

import lombok.Data;

@Data
public class SepayTransactionDto {
    private String id;
    private String bank_brand_name;
    private String account_number;
    private String transaction_date;
    private String amount_in;
    private String amount_out;
    private String transaction_content;
    private String reference_number;
}
