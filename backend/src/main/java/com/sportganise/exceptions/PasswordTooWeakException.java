package com.sportganise.exceptions;

public class PasswordTooWeakException extends Exception {
  public PasswordTooWeakException(String message) {
    super(message);
  }
}
