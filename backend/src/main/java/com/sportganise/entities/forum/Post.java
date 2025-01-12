package com.sportganise.entities.forum;

import jakarta.persistence.*;
import java.sql.Date;
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
  private Integer postId;

  @Column(nullable = false)
  private Integer accountId;

  @Column(nullable = false, length = 100)
  private String title;

  @Column(nullable = false, columnDefinition = "TEXT")
  private String description;

  private String attachment;

  @Column(nullable = false, updatable = false)
  @Temporal(TemporalType.DATE)
  private Date creationDate;

  /** Constructor for Post. */
  public Post(String title, String description) {
    this.title = title;
    this.description = description;
  }
}
