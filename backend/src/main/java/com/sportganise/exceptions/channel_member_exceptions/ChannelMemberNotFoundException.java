package com.sportganise.exceptions.channel_member_exceptions;

import com.sportganise.exceptions.ResourceNotFoundException;

public class ChannelMemberNotFoundException extends ResourceNotFoundException {
  public ChannelMemberNotFoundException(String message) {
    super(message);
  }
}
