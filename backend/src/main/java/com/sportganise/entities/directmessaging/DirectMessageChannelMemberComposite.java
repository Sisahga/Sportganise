package com.sportganise.entities.directmessaging;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class DirectMessageChannelMemberComposite {
    @Column(name = "channel_id")
    private Integer channelId;
    @Column(name = "account_id")
    private Integer accountId;
}