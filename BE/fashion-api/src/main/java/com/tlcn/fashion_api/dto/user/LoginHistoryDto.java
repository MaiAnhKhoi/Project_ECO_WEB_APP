package com.tlcn.fashion_api.dto.user;

import com.tlcn.fashion_api.common.enums.LoginMethod;
import com.tlcn.fashion_api.common.enums.LoginStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginHistoryDto {
    
    private Long id;
    private LoginMethod loginMethod;
    private String ipAddress;
    private String userAgent;
    private String location;
    private LoginStatus status;
    private String failureReason;
    private LocalDateTime createdAt;
}

