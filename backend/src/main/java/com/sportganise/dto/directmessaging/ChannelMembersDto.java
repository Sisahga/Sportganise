package com.sportganise.dto.directmessaging;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ChannelMembersDto {
  private int accountId;
  private String firstName;
  private String lastName;
  private String avatarUrl;
}
