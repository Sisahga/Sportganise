package com.sportganise.exceptions;

/** Exception thrown when the account is not verified. */
public class AccountNotVerifiedException extends RuntimeException {
  public AccountNotVerifiedException(String message) {
    super(message);
  }
}
