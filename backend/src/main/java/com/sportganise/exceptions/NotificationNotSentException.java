package com.sportganise.exceptions;

/**
 * Exception thrown when a notification fails to send.
 */
public class NotificationNotSentException extends RuntimeException {
  public NotificationNotSentException(String message) {
    super(message);
  }
}
