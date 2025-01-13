package com.sportganise.dto.account.auth;

import com.sportganise.entities.Address;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** Data Transfer Object for Account. */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountDto {

  @NotNull private String type;

  @NotNull
  @Email(message = "Invalid email format")
  private String email;

  @NotNull private String password;

  private String phone;
  private String firstName;
  private String lastName;

  private Address address;
}
