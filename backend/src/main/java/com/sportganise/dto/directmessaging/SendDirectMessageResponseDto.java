package com.sportganise.dto.directmessaging;

import com.sportganise.entities.directmessaging.DirectMessageType;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** DTO for sending a direct message response. */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SendDirectMessageResponseDto {
  private Integer senderId;
  private Integer channelId;
  private String messageContent;
  private List<String> attachments;
  private String sentAt;
  private DirectMessageType type;
}
