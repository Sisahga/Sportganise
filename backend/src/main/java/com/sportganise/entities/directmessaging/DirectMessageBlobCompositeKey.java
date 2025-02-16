package com.sportganise.entities.directmessaging;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
@EqualsAndHashCode
public class DirectMessageBlobCompositeKey implements Serializable {
  @Column(name = "message_id")
  private Integer messageId;

  @Column(name = "blob_url")
  private String blobUrl;
}
