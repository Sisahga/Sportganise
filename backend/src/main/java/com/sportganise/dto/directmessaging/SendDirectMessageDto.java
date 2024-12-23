package com.sportganise.dto.directmessaging;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SendDirectMessageDto {
    private Integer senderId;
    private Integer channelId;
    private String messageContent;
    private String[] attachmentBlobs;
    private String sentAt;
}
