package com.sportganise.exceptions.notificationexceptions;

/** Exception thrown when an error occurs while trying to get an FCM token for a user. */
public class GetFcmTokenException extends RuntimeException {
  public GetFcmTokenException(String message) {
    super(message);
  }
}
