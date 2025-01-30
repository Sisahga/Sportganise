package com.sportganise.dto.directmessaging;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** API object for receiving request body details regarding a channel delete request from client. */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DeleteChannelRequestDto {
  private Integer deleteRequestId; // Will be null on initial request from client.
  private int channelId;
  private int creatorId;
  private String creatorName; // Will be null when used as request object, but will be populated when used as response object.
  private String channelType;
}
