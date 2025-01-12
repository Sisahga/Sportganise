package com.sportganise.entities.programsessions;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
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
@Table(name = "program_participants")
public class ProgramParticipant {
  @EmbeddedId ProgramParticipantCompositeKey compositeKey;

  // Could be an admin, coach or player
  @Column(name = "type")
  private String participantType;

  @Column(name = "is_confirmed")
  private boolean isConfirmed;

  @Column(name = "confirm_date")
  private LocalDateTime confirmedDate;
}
