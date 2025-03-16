package com.sportganise.exceptions.notificationexceptions;

/** Exception thrown when an error occurs while storing an FCM token in DB. */
public class StoreFcmTokenException extends RuntimeException {
  public StoreFcmTokenException(String message) {
    super(message);
  }
}
