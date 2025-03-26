package com.sportganise.exceptions;

/** Exception thrown when a user does not have sufficient permissions to perform an action. */
public class InsufficientPermissionsException extends RuntimeException {
  public InsufficientPermissionsException(String message) {
    super(message);
  }
}
