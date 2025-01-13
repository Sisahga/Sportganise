package com.sportganise.exceptions;

/** Exception thrown when an account is not found. */
public class AccountNotFoundException extends ResourceNotFoundException {
  public AccountNotFoundException(String message) {
    super(message);
  }
}
