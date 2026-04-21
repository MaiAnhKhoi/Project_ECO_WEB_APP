package com.tlcn.fashion_api.dto.response.sepay;

import com.tlcn.fashion_api.dto.request.sepay.SepayTransactionDto;
import lombok.Data;
import java.util.List;

@Data
public class SepayListResponse {
    private int status;
    private String message;
    private List<SepayTransactionDto> transactions;
}