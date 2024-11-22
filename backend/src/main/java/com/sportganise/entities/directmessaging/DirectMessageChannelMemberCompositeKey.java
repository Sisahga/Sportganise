package com.sportganise.entities.directmessaging;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class DirectMessageChannelMemberCompositeKey implements Serializable {
    @Column(name = "channel_id")
    private Integer channelId;
    @Column(name = "account_id")
    private Integer accountId;
}