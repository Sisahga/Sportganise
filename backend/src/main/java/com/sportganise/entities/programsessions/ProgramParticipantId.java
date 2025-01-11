package com.sportganise.entities.programsessions;

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
@EqualsAndHashCode
@Embeddable
public class ProgramParticipantId implements Serializable {
  @Column(name = "program_id")
  private Integer programId;

  @Column(name = "account_id")
  private Integer accountId;
}
