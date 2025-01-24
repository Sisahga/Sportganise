package com.sportganise.exceptions.programexceptions;

/** Exception thrown when an entity is not found in the database. */
public class ProgramModificationException extends RuntimeException {
  public ProgramModificationException(String message) {
    super(message);
  }
}
