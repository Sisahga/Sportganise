package com.sportganise.entities.programsessions;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import java.time.LocalDateTime;
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
public class ProgramParticipant {
  @Column(name = "program_id")
  private Integer programId;

  @Column(name = "account_id")
  private Integer accountId;

  // Could be an admin, coach or player
  @Column(name = "type")
  private String participantType;

  @Column(name = "is_confirmed")
  private boolean isConfirmed;

  @Column(name = "confirm_date")
  private LocalDateTime confirmedDate;
}
