package com.sportganise.exceptions.notificationexceptions;

/** Exception thrown when there is an error saving the notification preference in the database. */
public class SaveNotificationPrefereceException extends RuntimeException {
  public SaveNotificationPrefereceException(String message) {
    super(message);
  }
}
