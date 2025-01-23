package com.sportganise.entities.programsessions;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Entity Model for ProgramParticipant table. */
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "program_attachments")
public class ProgramAttachment {
  @EmbeddedId ProgramAttachmentCompositeKey compositeProgramAttachmentKey;
}
