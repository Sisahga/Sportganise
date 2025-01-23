package com.sportganise.exceptions.directmessageexceptions;

/** Direct Message Fetch Exception when fetching messages throws an error. */
public class DirectMessageFetchException extends RuntimeException {
  public DirectMessageFetchException(String message) {
    super(message);
  }
}
