package com.sportganise.entities.programsessions;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Embeddable
public class ProgramParticipantCompositeKey implements Serializable {
  @Column(name = "program_id")
  private Integer programId;
  @Column(name = "account_id")
  private Integer accountId;
}
