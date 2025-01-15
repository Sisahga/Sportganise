package com.sportganise.dto.accounts;

import com.sportganise.entities.account.Address;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** DTO for the update account request. */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateAccountDto {
  private String firstName;
  private String lastName;
  private String email;
  private String phone;
  private Address address;
}
