package com.sportganise.entities.forum;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** This class represents the PostAttachment entity. */
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "post_attachment")
public class PostAttachment {

  @EmbeddedId private PostAttachmentCompositeKey postAttachmentsCompositeKey;
}
