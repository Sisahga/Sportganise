package com.sportganise.entities.programsessions;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotNull;
import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Composite Key Id for ProgramParticipant. */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@Embeddable
public class ProgramParticipantId implements Serializable {

  @NotNull
  @Column(name = "recurrence_id")
  private Integer recurrenceId;

  @NotNull
  @Column(name = "account_id")
  private Integer accountId;
}
