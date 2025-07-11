package com.sportganise.entities.programsessions;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Composite key for ProgramAttachment entity. */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
@EqualsAndHashCode
public class ProgramAttachmentCompositeKey implements Serializable {
  @Column(name = "program_id")
  private Integer programId;

  @Column(name = "attachment_url")
  private String attachmentUrl;
}
