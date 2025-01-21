package com.sportganise.dto.account;

import com.sportganise.entities.account.AccountType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** DTO for Direct Messaging Account Details (used in search in create channel). */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountDetailsDirectMessaging {
  private int accountId;
  private String firstName;
  private String lastName;
  private String pictureUrl;
  private AccountType type;
  private String phone;
}
