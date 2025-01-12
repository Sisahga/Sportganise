package com.sportganise.dto.accounts;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** DTO for the update account request. */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateAccountDto {
  private String firstName;
  private String lastName;
  private String email;
  private String phone;
  private String address;
}
