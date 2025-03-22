package com.sportganise.entities.forum;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.ZonedDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Entity Model for Post table. */
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class Post {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "post_id", nullable = false, updatable = false)
  private Integer postId;

  @Column(name = "account_id", nullable = false)
  private Integer accountId;

  @Column(nullable = false, length = 100)
  private String title;

  @Column(nullable = false, columnDefinition = "TEXT")
  private String description;

  @Column(columnDefinition = "JSON")
  private String metadata;

  @Enumerated(EnumType.STRING)
  @Column(length = 20)
  private PostType type;

  @Column(name = "occurrence_date")
  private ZonedDateTime occurrenceDate;

  @Column(name = "creation_date", nullable = false, updatable = false)
  @Builder.Default
  private ZonedDateTime creationDate = ZonedDateTime.now();

  /** Constructor for Post. */
  public Post(String title, String description) {
    this.title = title;
    this.description = description;
  }

  /** Constructor for Post for when new program is created. */
  public Post(
      Integer accountId,
      String title,
      String description,
      String metadata,
      PostType type,
      ZonedDateTime occurrenceDate) {
    this.accountId = accountId;
    this.title = title;
    this.description = description;
    this.metadata = metadata;
    this.type = type;
    this.occurrenceDate = occurrenceDate;
    this.creationDate = ZonedDateTime.now(); // Optional: set creation date when creating new posts
  }
}
