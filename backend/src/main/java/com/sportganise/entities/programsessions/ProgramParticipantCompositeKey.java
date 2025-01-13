package com.sportganise.entities.programsessions;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Composite key for the ProgramParticipant entity. */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Embeddable
@EqualsAndHashCode
public class ProgramParticipantCompositeKey implements Serializable {
  @Column(name = "program_id")
  private Integer programId;

  @Column(name = "account_id")
  private Integer accountId;
}
