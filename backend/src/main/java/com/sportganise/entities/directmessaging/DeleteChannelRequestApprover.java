package com.sportganise.entities.directmessaging;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Entity for delete_channel_request_approver. */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "delete_channel_request_approver")
public class DeleteChannelRequestApprover {
  @EmbeddedId DeleteChannelRequestApproverCompositeKey approverCompositeKey;

  @Column(name = "channel_id", updatable = false)
  private Integer channelId;

  @Enumerated(EnumType.STRING)
  private DeleteChannelRequestStatusType status;
}
