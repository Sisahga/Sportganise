package com.sportganise.dto.directmessaging;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

/** DTO for accepting a direct message request. */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SendDirectMessageRequestDto {
  private Integer senderId;
  private Integer channelId;
  private String messageContent;
  private List<MultipartFile> attachments;
  private String sentAt;
  private String type;
  private String senderFirstName;
  private String avatarUrl;
}