package com.sportganise.exceptions;

/** Exception thrown when an account is not found. */
public class ParticipantNotFoundException extends ResourceNotFoundException {
  public ParticipantNotFoundException(String message) {
    super(message);
  }
}
