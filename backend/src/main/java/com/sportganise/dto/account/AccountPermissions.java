package com.sportganise.dto.account;

/** Interface projection for the Account entity. */
public interface AccountPermissions {
  Integer getAccountId();

  String getFirstName();

  String getLastName();

  String getEmail();

  String getPictureUrl();

  String getType();
}
