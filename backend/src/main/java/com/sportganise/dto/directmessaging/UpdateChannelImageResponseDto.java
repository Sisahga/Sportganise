package com.sportganise.dto.directmessaging;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** API object for Update Channel Image Response. */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdateChannelImageResponseDto {
  private String channelImageUrl;
}
