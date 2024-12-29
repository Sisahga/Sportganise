package com.sportganise.entities.programsessions;

import com.sportganise.entities.Account;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
public class ProgramParticipant {
  // Could be an admin, coach or player
  @Column(name = "type")
  private String participantType;

  @Column(name = "is_confirmed")
  private boolean isConfirmed;

  @Column(name = "confirm_date")
  private LocalDateTime confirmedDate;

  @Column(name = "program_id")
  private Program program;

  @Column(name = "account_id")
  private Account account;
}
