package com.sportganise.dto.forum;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Data Transfer Object for creating a feedback. */
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CreateFeedbackDto {
  private Integer accountId;
  private String content;
}
