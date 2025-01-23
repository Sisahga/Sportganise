package com.sportganise.exceptions.directmessageexceptions;

/** Exception when sending a dm raises an error. */
public class DirectMessageSendException extends RuntimeException {
  public DirectMessageSendException(String message) {
    super(message);
  }
}
