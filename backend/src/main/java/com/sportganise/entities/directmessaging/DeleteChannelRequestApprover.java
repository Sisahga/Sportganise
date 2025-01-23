package com.sportganise.entities.directmessaging;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Entity for delete_channel_request_approver.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "delete_channel_request_approver")
public class DeleteChannelRequestApprover {
  @EmbeddedId
  DeleteChannelRequestApproverCompositeKey approverCompositeKey;

  @Enumerated(EnumType.STRING)
  private DeleteChannelRequestStatusType status;
}
