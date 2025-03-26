package com.sportganise.exceptions.programexceptions;

import com.sportganise.exceptions.ResourceNotFoundException;

/** Exception thrown when a program is not found. */
public class ProgramNotFoundException extends ResourceNotFoundException {
  public ProgramNotFoundException(String message) {
    super(message);
  }
}
