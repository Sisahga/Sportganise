package com.sportganise.exceptions.channelmemberexceptions;

/** Custom exception thrown when marking a channel as read fails. */
public class ChannelMemberMarkReadException extends RuntimeException {
  public ChannelMemberMarkReadException(String message) {
    super(message);
  }
}
