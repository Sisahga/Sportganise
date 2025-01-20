package com.sportganise.dto.account;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** DTO for the request body of the update account role endpoint. */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateAccountTypeDto {
  private String type;
}
