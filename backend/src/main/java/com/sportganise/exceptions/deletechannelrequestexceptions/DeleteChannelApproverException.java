package com.sportganise.exceptions.deletechannelrequestexceptions;

import com.sportganise.exceptions.ResourceNotFoundException;

public class DeleteChannelApproverException extends ResourceNotFoundException {
  public DeleteChannelApproverException(String message) {
    super(message);
  }
}
