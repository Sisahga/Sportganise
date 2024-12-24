package com.sportganise.entities.directmessaging;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Entity for channel_member. */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "channel_member")
public class DirectMessageChannelMember {
  @EmbeddedId DirectMessageChannelMemberCompositeKey compositeKey;

  private Boolean read;
}
