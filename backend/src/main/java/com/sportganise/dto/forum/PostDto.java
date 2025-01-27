package com.sportganise.dto.forum;

import com.sportganise.entities.forum.PostType;
import jakarta.validation.constraints.NotNull;
import java.time.ZonedDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Data Transfer Object for Post. */
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PostDto {
  @NotNull private Integer postId;
  @NotNull private String title;
  @NotNull private String description;
  private PostType type;
  private ZonedDateTime occurrenceDate;
  @NotNull private ZonedDateTime creationDate;
  @NotNull private long likeCount;
  private List<String> attachments;

  /** Constructor for PostDto. */
  public PostDto(
      Integer postId,
      String title,
      String description,
      PostType type,
      ZonedDateTime occurrenceDate,
      ZonedDateTime creationDate,
      long likeCount) {
    this.postId = postId;
    this.title = title;
    this.description = description;
    this.type = type;
    this.occurrenceDate = occurrenceDate;
    this.creationDate = creationDate;
    this.likeCount = likeCount;
  }
}
