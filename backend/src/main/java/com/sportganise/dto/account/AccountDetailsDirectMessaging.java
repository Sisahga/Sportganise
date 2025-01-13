package com.sportganise.dto.account;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** DTO for Direct Messaging Account Details (used in search in create channel). */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AccountDetailsDirectMessaging {
  private int accountId;
  private String firstName;
  private String lastName;
  private String pictureUrl;
  private String type;
  private String phone;
}
