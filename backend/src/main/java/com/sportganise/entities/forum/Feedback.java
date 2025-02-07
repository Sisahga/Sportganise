package com.sportganise.entities.forum;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.ZonedDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Entity Model for Feedback table. */
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class Feedback {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "feedback_id", nullable = false, updatable = false)
  private Integer feedbackId;

  @Column(name = "post_id", nullable = false)
  private Integer postId;

  @Column(name = "account_id", nullable = false)
  private Integer userId;

  @Column(name = "content", nullable = false)
  private String content;

  @Column(name = "creation_date", nullable = false, updatable = false)
  @Builder.Default
  private ZonedDateTime creationDate = ZonedDateTime.now();

}
