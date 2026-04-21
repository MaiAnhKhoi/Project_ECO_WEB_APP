package com.tlcn.fashion_api.entity.message;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MessageReadId implements Serializable {
    private Long messageId;
    private Long userId;
}