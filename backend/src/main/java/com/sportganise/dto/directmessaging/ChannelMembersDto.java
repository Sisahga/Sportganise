package com.sportganise.dto.directmessaging;

import com.sportganise.entities.directmessaging.ChannelMemberRoleType;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** API DTO for ChannelMembers. */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ChannelMembersDto {
  private int accountId;
  private String firstName;
  private String lastName;
  private String avatarUrl;
  
  @Enumerated(EnumType.STRING)
  private ChannelMemberRoleType role;
}
