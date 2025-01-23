package com.sportganise.entities.directmessaging;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

/**
 * Composite Key ID for delete_channel_request_approver.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
@EqualsAndHashCode
public class DeleteChannelRequestApproverCompositeKey implements Serializable {
  @Column(name = "delete_request_id")
  private Integer deleteRequestId;
  @Column(name = "approver_id")
  private Integer approverId;
}
