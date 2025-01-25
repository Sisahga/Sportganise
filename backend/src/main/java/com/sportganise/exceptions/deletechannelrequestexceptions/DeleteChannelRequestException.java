package com.sportganise.exceptions.deletechannelrequestexceptions;

/**
 * DeleteChannelRequestException is a custom exception that is thrown when there is an error with
 * deleting a channel request.
 */
public class DeleteChannelRequestException extends RuntimeException {
  public DeleteChannelRequestException(String message) {
    super(message);
  }
}
