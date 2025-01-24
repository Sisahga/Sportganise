package com.sportganise.dto.directmessaging;

import com.sportganise.entities.directmessaging.DeleteChannelRequestStatusType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** DeleteChannelRequestMembersDto. */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DeleteChannelRequestMembersDto {
  private int accountId;
  private String firstName;
  private String lastName;
  private String avatarUrl;
  private DeleteChannelRequestStatusType status;
}
