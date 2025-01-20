package com.sportganise.exceptions;

/**
 * Exception thrown when a channel is not found.
 */
public class ChannelNotFoundException extends ResourceNotFoundException {
  public ChannelNotFoundException(String message) {
    super(message);
  }
}
