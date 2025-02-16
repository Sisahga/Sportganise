package com.sportganise.entities.programsessions;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.time.ZonedDateTime;
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
@Table(name = "program_participants")
public class ProgramParticipant {

  @EmbeddedId private ProgramParticipantId programParticipantId;

  @Column(name = "rank")
  private Integer rank;

  @Column(name = "type")
  private String type;

  @Column(name = "is_confirmed")
  private boolean isConfirmed;

  @Column(name = "confirm_date")
  private ZonedDateTime confirmedDate;

  public Integer getProgramId() {
    return programParticipantId.getProgramId();
  }

  public Integer getAccountId() {
    return programParticipantId.getAccountId();
  }

  public void setAccountId(Integer accountId) {
    this.programParticipantId.setAccountId(accountId);
  }

  public void setProgramId(Integer programId) {
    this.programParticipantId.setProgramId(programId);
  }
}
