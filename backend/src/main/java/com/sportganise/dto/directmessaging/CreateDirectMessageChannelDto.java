package com.sportganise.dto.directmessaging;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** API DTO for creating a new direct message channel. */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateDirectMessageChannelDto {
  private Integer channelId;
  private String channelName;
  private String channelType;
  private List<Integer> memberIds;
}
