package com.sportganise.dto.account;

import com.sportganise.entities.account.AccountType;

/** Interface projection for the Account entity. */
public interface AccountPermissions {
  Integer getAccountId();

  String getFirstName();

  String getLastName();

  String getEmail();

  String getPictureUrl();

  AccountType getType();
}
