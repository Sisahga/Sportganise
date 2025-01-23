package com.sportganise.exceptions.channelmemberexceptions;

/** Custom Exception throwm when fetching channel members fails. */
public class ChannelMemberFetchException extends RuntimeException {
  public ChannelMemberFetchException(String message) {
    super(message);
  }
}
