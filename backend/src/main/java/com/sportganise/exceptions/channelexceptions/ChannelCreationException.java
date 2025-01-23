package com.sportganise.exceptions.channelexceptions;

/** Custom exception thrown when creating a channel fails. */
public class ChannelCreationException extends RuntimeException {
  public ChannelCreationException(String message) {
    super(message);
  }
}
