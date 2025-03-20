package com.sportganise.exceptions.notificationexceptions;

/** Exception thrown when an error occurs while marking a notification as read. */
public class MarkNotificationReadException extends RuntimeException {
  public MarkNotificationReadException(String message) {
    super(message);
  }
}
