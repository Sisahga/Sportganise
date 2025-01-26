package com.sportganise.entities.directmessaging;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
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

  @Enumerated(EnumType.STRING)
  private DeleteChannelRequestStatusType status;
}
