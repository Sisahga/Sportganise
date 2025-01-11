package com.sportganise.dto.programsessions;

import jakarta.persistence.Entity;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** API DTO for Program Details and Participants. */
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ProgramDetailsParticipantsDto {
  private ProgramDto programDetails;
  private List<ProgramParticipantDto> attendees;
}
