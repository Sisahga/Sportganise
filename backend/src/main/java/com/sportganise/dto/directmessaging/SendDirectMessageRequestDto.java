package com.sportganise.dto.directmessaging;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SendDirectMessageRequestDto {
    private Integer senderId;
    private Integer channelId;
    private String messageContent;
    private MultipartFile[] attachments;
    private String sentAt;
}
