package com.sportganise.dto.forum;

import lombok.*;

import java.time.ZonedDateTime;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FeedbackDto {
    private Integer feedbackId;
    private String description;
    private String author;
    private ZonedDateTime creationDate;
}
