package com.sportganise.entities.directmessaging;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
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
  @Id
  @Column(name = "message_id")
  private Integer messageId;

  @Column(name = "blob_url")
  private String blobUrl;
}
