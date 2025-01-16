package com.sportganise.exceptions;

/** Exception thrown when an account already exists in Auth0. */
public class AccountAlreadyExistsInAuth0 extends Exception {
  public AccountAlreadyExistsInAuth0(String message) {
    super(message);
  }
}
