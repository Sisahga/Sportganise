package com.sportganise.exceptions.ProgramExceptions;

/** Exception thrown when a program cannot be created. */
public class ProgramCreationException extends RuntimeException {
  public ProgramCreationException(String message) {
    super(message);
  }
}
