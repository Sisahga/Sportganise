package com.sportganise.entities.programsessions;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Entity Model for ProgramParticipant table. */
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "program_participants")
public class ProgramParticipant {

  /** Composite primary key (program_id + account_id) */
  @EmbeddedId
  private ProgramParticipantId id;

  // Could be an admin, coach or player
  @Column(name = "type")
  private String participantType;

  @Column(name = "is_confirmed")
  private boolean isConfirmed;

  @Column(name = "confirm_date")
  private LocalDateTime confirmedDate;

  /**
   * Returns the ID of the program
   * 
   * @return The current value of the program ID.
   */
  public Integer getProgramId() {
    return id.getProgramId();
  }

  /**
   * Changes the ID of the program.
   * 
   * @param programId The new program ID.
   */
  public void setProgramId(Integer programId) {
    id.setProgramId(programId);
  }

  /**
   * ID of the account.
   * 
   * @return The current value of the account ID.
   */
  public Integer getAccountId() {
    return id.getAccountId();
  }

  /**
   * Changes the ID of the participant.
   * 
   * @param accountId The new account ID.
   */
  public void setAccountId(Integer accountId) {
    id.setAccountId(accountId);
  }

}
