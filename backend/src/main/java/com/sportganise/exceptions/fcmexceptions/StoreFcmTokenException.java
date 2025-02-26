package com.sportganise.exceptions.fcmexceptions;

/**
 * Exception thrown when an error occurs while storing an FCM token in DB.
 */
public class StoreFcmTokenException extends RuntimeException {
  public StoreFcmTokenException(String message) {
    super(message);
  }
}
