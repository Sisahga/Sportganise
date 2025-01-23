package com.sportganise.exceptions.channelMemberExceptions;

import com.sportganise.exceptions.ResourceNotFoundException;

public class ChannelMemberNotFoundException extends ResourceNotFoundException {
  public ChannelMemberNotFoundException(String message) {
    super(message);
  }
}
