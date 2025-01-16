package com.sportganise.exceptions;

/** Exception thrown when a password is too weak. */
public class PasswordTooWeakException extends Exception {
  public PasswordTooWeakException(String message) {
    super(message);
  }
}
