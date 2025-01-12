package com.sportganise.dto.programsessions;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** API DTO for Program Participants. */
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ProgramParticipantDto {
  private Integer programId;
  private Integer accountId;

  private String firstName;
  private String lastName;

  private boolean isConfirmed;
  private LocalDateTime confirmedDate;
}
