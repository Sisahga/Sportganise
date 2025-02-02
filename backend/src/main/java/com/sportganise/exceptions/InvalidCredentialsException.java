package com.sportganise.exceptions;

/** Exception thrown when the credentials are invalid. */
public class InvalidCredentialsException extends RuntimeException {
  public InvalidCredentialsException(String message) {
    super(message);
  }
}
