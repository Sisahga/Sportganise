package com.sportganise.dto.programsessions;

import com.sportganise.entities.programsessions.ProgramParticipant;
import java.time.ZonedDateTime;
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
  private Integer accountId;
  private Integer recurrenceId;
  private Integer rank;
  private String participantType;
  private boolean isConfirmed;
  private ZonedDateTime confirmedDate;

  /** Constructor for class that converts ProgramParticipant entity. */
  public ProgramParticipantDto(ProgramParticipant programParticipant) {
    this.accountId = programParticipant.getAccountId();
    this.recurrenceId = programParticipant.getRecurrenceId();
    this.rank = programParticipant.getRank();
    this.participantType = programParticipant.getType();
    this.isConfirmed = programParticipant.isConfirmed();
    this.confirmedDate = programParticipant.getConfirmedDate();
  }
}
