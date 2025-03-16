package com.sportganise.exceptions.notificationexceptions;

/** Exception for when there is an error getting the notification permission of a user. */
public class GetNotificationPermissionException extends RuntimeException {
  public GetNotificationPermissionException(String message) {
    super(message);
  }
}
