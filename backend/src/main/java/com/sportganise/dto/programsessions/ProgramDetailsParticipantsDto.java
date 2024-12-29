package com.sportganise.dto.programsessions;

import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.List;

/** API DTO for Program Details and Participants. */
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class ProgramDetailsParticipantsDto {
    private ProgramDto programDetails;
    private List<ProgramParticipantDto> attendees;
}
