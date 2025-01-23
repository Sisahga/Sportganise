package com.sportganise.exceptions.channelexceptions;

/** Custom exception thworn when deleting a channel fails. */
public class ChannelDeletionException extends RuntimeException {
  public ChannelDeletionException(String message) {
    super(message);
  }
}
