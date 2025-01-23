package com.sportganise.exceptions.channelmemberexceptions;

/**
 * Exception for when a channel member's role cannot be set.
 */
public class ChannelMemberSetRoleException extends RuntimeException {
  public ChannelMemberSetRoleException(String message) {
    super(message);
  }
}
