package com.sportganise.exceptions;

/** Exception thrown when an entity is not found in the database. */
public class EntityNotFoundException extends ResourceNotFoundException {
  public EntityNotFoundException(String message) {
    super(message);
  }
}
