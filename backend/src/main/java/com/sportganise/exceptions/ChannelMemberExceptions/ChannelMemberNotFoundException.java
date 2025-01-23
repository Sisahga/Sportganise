package com.sportganise.exceptions.ChannelMemberExceptions;

import com.sportganise.exceptions.ResourceNotFoundException;

public class ChannelMemberNotFoundException extends ResourceNotFoundException {
  public ChannelMemberNotFoundException(String message) {
    super(message);
  }
}
