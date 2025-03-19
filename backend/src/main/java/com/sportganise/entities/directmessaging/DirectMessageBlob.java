package com.sportganise.entities.directmessaging;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Entity class for the DirectMessageBlob table. */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "message_blob")
public class DirectMessageBlob {
  @EmbeddedId DirectMessageBlobCompositeKey compositeKey;

  @Column(name = "file_type")
  @Enumerated(EnumType.STRING)
  private DirectMessageBlobType fileType;
}
