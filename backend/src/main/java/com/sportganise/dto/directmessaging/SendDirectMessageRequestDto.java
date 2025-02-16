package com.sportganise.dto.directmessaging;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** DTO for accepting a direct message request. */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SendDirectMessageRequestDto {
  private Integer senderId;
  private Integer channelId;
  private String messageContent;
  private String sentAt;
  private String type;
  private String senderFirstName;
  private String avatarUrl;
}
