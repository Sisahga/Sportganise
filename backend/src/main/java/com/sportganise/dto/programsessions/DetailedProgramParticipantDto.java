package com.sportganise.dto.programsessions;

import com.sportganise.entities.account.AccountType;
import com.sportganise.entities.account.Address;
import java.time.ZonedDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DetailedProgramParticipantDto {
  private Integer accountId;
  private Integer recurrenceId;
  private Integer rank;
  private String participantType;
  private boolean isConfirmed;
  private ZonedDateTime confirmedDate;
  private String firstName;
  private String lastName;
  private Address address;
  private String phone;
  private String email;
  private String profilePicture;
  private AccountType accountType;
}
