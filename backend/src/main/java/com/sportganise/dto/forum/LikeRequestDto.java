package com.sportganise.dto.forum;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** DTO for like request. */
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LikeRequestDto {
  private Integer accountId;
}
