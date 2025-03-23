package com.sportganise.exceptions;

/** Exception thrown when a user does not have sufficient permissions to perform an action. */
public class InsufficientPermissionException extends RuntimeException {
  public InsufficientPermissionException(String message) {
    super(message);
  }
}
