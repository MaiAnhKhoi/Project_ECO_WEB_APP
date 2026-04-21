package com.tlcn.fashion_api.dto.user;

import com.tlcn.fashion_api.common.enums.UserStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserStatusRequest {
    
    @NotNull(message = "Status is required")
    private UserStatus status;
    
    private String reason;  // Lý do thay đổi status (đặc biệt khi suspend/lock)
}

