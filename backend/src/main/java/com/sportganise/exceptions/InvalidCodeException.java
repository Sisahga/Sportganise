package com.sportganise.exceptions;

/** Exception thrown when the code is invalid. */
public class InvalidCodeException extends RuntimeException {
  public InvalidCodeException(String message) {
    super(message);
  }
}
