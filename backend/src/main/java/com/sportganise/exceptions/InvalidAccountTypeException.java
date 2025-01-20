package com.sportganise.exceptions;

/** Exception thrown when a string does not match any known AccountType. */
public class InvalidAccountTypeException extends Exception {
  public InvalidAccountTypeException(String message) {
    super(message);
  }
}
