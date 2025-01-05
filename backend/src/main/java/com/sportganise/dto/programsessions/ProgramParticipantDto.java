package com.sportganise.dto.programsessions;

import jakarta.persistence.Entity;
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
@Entity
public class ProgramParticipantDto {
  private Integer programId;
  private Integer accountId;
  private String participantType;
  private String firstName;
  private String lastName;
  private String email;
  private String address;
  private String phone;
  private boolean isConfirmed;
  private LocalDateTime confirmedDate;
}
