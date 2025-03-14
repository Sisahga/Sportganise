package com.sportganise.exceptions.notificationexceptions;

/** Exception thrown when there is an issue updating notification permissions. */
public class UpdateNotificationPermissionException extends RuntimeException {
  public UpdateNotificationPermissionException(String message) {
    super(message);
  }
}
