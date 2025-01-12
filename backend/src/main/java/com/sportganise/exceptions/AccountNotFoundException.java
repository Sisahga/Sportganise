package com.sportganise.exceptions;

/** Exception thrown when an account is not found. */
public class AccountNotFoundException extends Exception {
  public AccountNotFoundException(String message) {
    super(message);
  }
}
