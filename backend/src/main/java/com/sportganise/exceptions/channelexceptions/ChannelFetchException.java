package com.sportganise.exceptions.channelexceptions;

/** Custom exception thrown when fetching a channel fails. */
public class ChannelFetchException extends RuntimeException {
  public ChannelFetchException(String message) {
    super(message);
  }
}
