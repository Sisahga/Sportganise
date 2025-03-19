package com.sportganise.dto.forum;

import java.time.ZonedDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Data Transfer Object for Feedback. */
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FeedbackDto {
  private Integer feedbackId;
  private String description;
  private FeedbackAuthorDto author;
  private ZonedDateTime creationDate;
}
