package com.sportganise.entities.programsessions;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

/** Entity Model for ProgramParticipant table. */
@Entity
@Table(name = "program_participants")
public class ProgramParticipant {

  @EmbeddedId
  private ProgramParticipantId programParticipantId;

  @Column(name = "rank")
  private Integer rank;

  // Could be an admin, coach, or player
  @Column(name = "type")
  private String participantType;

  @Column(name = "is_confirmed")
  private boolean isConfirmed;

  @Column(name = "confirm_date")
  private LocalDateTime confirmedDate;

  // Constructors
  public ProgramParticipant() {
  }

  public ProgramParticipant(ProgramParticipantId programParticipantId, Integer rank, String participantType, boolean isConfirmed, LocalDateTime confirmedDate) {
    this.programParticipantId = programParticipantId;
    this.rank = rank;
    this.participantType = participantType;
    this.isConfirmed = isConfirmed;
    this.confirmedDate = confirmedDate;
  }

  // Getters and Setters
  public ProgramParticipantId getProgramParticipantId() {
    return programParticipantId;
  }

  public void setProgramParticipantId(ProgramParticipantId programParticipantId) {
    this.programParticipantId = programParticipantId;
  }

  public Integer getRank() {
    return rank;
  }

  public void setRank(Integer rank) {
    this.rank = rank;
  }

  public String getParticipantType() {
    return participantType;
  }

  public void setParticipantType(String participantType) {
    this.participantType = participantType;
  }

  public boolean isConfirmed() {
    return isConfirmed;
  }

  public void setConfirmed(boolean confirmed) {
    isConfirmed = confirmed;
  }

  public LocalDateTime getConfirmedDate() {
    return confirmedDate;
  }

  public void setConfirmedDate(LocalDateTime confirmedDate) {
    this.confirmedDate = confirmedDate;
  }

  // Helper Methods for accessing Program and Account Id from embedded ID
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
