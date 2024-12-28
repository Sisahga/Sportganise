package com.sportganise.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Entity Model for TrainingSession table. */
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class ProgramParticipant {
  // Could be an admin, coach or player
  @Column(name = "type")
  private String participantType;

  @Column(name = "is_confirmed")
  private boolean isConfirmed;

  @Column(name = "confirm_date")
  private LocalDateTime confirmedDate;

  // Each Program Participant can be linked to one or more Programs
  @OneToMany
  @MapsId("programId")
  @JoinColumn(name = "program_id")
  private Program program;

  // Each Program Participant is linked to exactly one Account
  @OneToOne
  @MapsId("accountId")
  @JoinColumn(name = "account_id")
  private Account account;
}
