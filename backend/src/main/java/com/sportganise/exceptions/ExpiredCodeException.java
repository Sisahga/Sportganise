package com.sportganise.exceptions;

/** Exception thrown when the code is expired. */
public class ExpiredCodeException extends RuntimeException {
  public ExpiredCodeException(String message) {
    super(message);
  }
}
