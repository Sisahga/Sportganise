package com.sportganise.exceptions.channelmemberexceptions;

/** Custom exception thrown when saving a channel member fails. */
public class ChannelMemberSaveException extends RuntimeException {
  public ChannelMemberSaveException(String message) {
    super(message);
  }
}
