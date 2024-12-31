package com.sportganise.dto.directmessaging;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SendDirectMessageResponseDto {
    private Integer senderId;
    private Integer channelId;
    private String messageContent;
    private String[] attachments;
    private String sentAt;
}
