package com.sportganise.exceptions;

/**
 * Exception thrown when a request is forbidden.
 */
public class ForbiddenException extends RuntimeException {
  public ForbiddenException(String message) {
    super(message);
  }
}
