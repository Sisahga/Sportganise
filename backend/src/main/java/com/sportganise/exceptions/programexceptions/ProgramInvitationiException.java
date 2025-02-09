package com.sportganise.exceptions.programexceptions;

/** General exception for failed invitation to private program. */
public class ProgramInvitationiException extends RuntimeException {
  public ProgramInvitationiException(String message) {
    super(message);
  }
}
