package com.sportganise.entities.forum;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Composite key for PostAttachment entity. */
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode
@Embeddable
public class PostAttachmentCompositeKey implements Serializable {

  @Column(name = "post_id")
  private Integer postId;

  @Column(name = "attachment_url")
  private String attachmentUrl;
}
