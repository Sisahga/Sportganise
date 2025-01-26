package com.sportganise.exceptions.deletechannelrequestexceptions;

import com.sportganise.exceptions.ResourceNotFoundException;

/** Exception for when a channel approver cannot be deleted. */
public class DeleteChannelApproverException extends ResourceNotFoundException {
  public DeleteChannelApproverException(String message) {
    super(message);
  }
}
