package com.sportganise.dto.directmessaging;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** API object for sending back details regarding a channel delete request. */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DeleteChannelRequestResponseDto {
  private DeleteChannelRequestDto deleteChannelRequestDto;
  // GROUP: all admin channel members. SIMPLE: all channel members.
  private List<DeleteChannelRequestMembersDto> channelMembers;
}
