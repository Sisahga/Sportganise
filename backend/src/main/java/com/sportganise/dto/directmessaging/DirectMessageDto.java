package com.sportganise.dto.directmessaging;

import com.sportganise.entities.directmessaging.DirectMessageType;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** DTO for sending a direct message response. */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DirectMessageDto {
  private Integer messageId;
  private Integer senderId;
  private String senderFirstName;
  private Integer channelId;
  private String messageContent;
  private List<DmAttachmentDto> attachments;
  private String sentAt;
  private DirectMessageType type;
  private String avatarUrl;
}
