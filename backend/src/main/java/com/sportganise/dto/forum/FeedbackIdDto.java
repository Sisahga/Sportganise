package com.sportganise.dto.forum;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Data Transfer Object for FeedbackId. */
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FeedbackIdDto {
  private Integer feedbackId;
}
