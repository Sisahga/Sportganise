package com.sportganise.exceptions.channelmemberexceptions;

import com.sportganise.exceptions.ResourceNotFoundException;

/** Custom exception thrown when channel member not found. */
public class ChannelMemberNotFoundException extends ResourceNotFoundException {
  public ChannelMemberNotFoundException(String message) {
    super(message);
  }
}
