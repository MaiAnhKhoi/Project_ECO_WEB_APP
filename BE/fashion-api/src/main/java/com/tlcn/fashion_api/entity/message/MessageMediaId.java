package com.tlcn.fashion_api.entity.message;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MessageMediaId implements Serializable {

    private Long messageId;
    private Long mediaId;
}