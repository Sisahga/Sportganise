package com.sportganise.dto.programsessions;
import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** API DTO for Program Participants. */
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class ProgramParticipantDto {
  private Integer accountId;
  private Integer programId;
  private boolean isConfirmed;
  private LocalDateTime confirmedDate;
}
