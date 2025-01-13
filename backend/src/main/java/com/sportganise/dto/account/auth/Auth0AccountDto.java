package com.sportganise.dto.account.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

/** Data Transfer Object for Auth0 account. */
@Data
@AllArgsConstructor
@RequiredArgsConstructor
public class Auth0AccountDto {
  @NotNull
  @Email(message = "Invalid email format")
  private String email;

  @NotNull private String password;

  private String connection;
}
