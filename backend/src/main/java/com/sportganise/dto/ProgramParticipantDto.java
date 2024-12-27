package com.sportganise.dto;

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
  private String participantType;
  private String email;
  private String address;
  private String phone;
  private String firstName;
  private String lastName;
}
