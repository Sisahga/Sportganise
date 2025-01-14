package com.sportganise.dto.directmessaging;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** DuplicateChannelDto. */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DuplicateChannelDto {
  private Integer channelId;
  private String channelName;
  private String channelType;
  private String channelImageBlob;
}
