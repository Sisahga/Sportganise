package com.sportganise.dto.directmessaging;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BlockUserRequestDto {
  private int accountId;
  private int blockedId;
}
