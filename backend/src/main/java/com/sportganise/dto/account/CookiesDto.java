package com.sportganise.dto.account;

import com.sportganise.entities.account.AccountType;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Data Transfer Object for Cookies. */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CookiesDto {
  private int accountId;
  private String firstName;
  private String lastName;
  private String email;
  private String pictureUrl;
  private AccountType type;
  private String phone;
  private List<Integer> organisationIds;
  private String jwtToken;
}
