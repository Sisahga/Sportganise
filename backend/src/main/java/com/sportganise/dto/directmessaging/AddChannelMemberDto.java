package com.sportganise.dto.directmessaging;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** DTO for adding members to a Direct Message Channel. */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AddChannelMemberDto {
  private Integer channelId;
  private List<Integer> memberIds;
  private Integer adminId;
}
