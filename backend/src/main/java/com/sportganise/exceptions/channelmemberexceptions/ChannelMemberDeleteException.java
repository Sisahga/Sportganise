package com.sportganise.exceptions.channelmemberexceptions;

/** Exception thrown when a channel member cannot be deleted. */
public class ChannelMemberDeleteException extends RuntimeException {
  public ChannelMemberDeleteException(String message) {
    super(message);
  }
}
