package com.sportganise.entities.directmessaging;

import jakarta.persistence.*;
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
  
  @Enumerated(EnumType.STRING)
  private ChannelMemberRoleType role;
}
