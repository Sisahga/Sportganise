package com.sportganise.dto.directmessaging;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO for renaming a Direct Message Channel.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RenameChannelDto {
  private int channelId;
  private String channelName;
}
