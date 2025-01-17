package com.sportganise.dto.directmessaging;

import com.sportganise.entities.directmessaging.DirectMessageType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LastMessageDto {
  private Integer senderId;
  private Integer channelId;
  private String messageContent;
  private DirectMessageType type;
}
