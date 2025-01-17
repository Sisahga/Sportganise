package com.sportganise.dto.directmessaging;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Data Transfer Object for blocking a user. */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BlockUserRequestDto {
  private Integer channelId;
  private int accountId;
  private int blockedId;
}
