package com.sportganise.services.directmessaging;

import com.sportganise.entities.directmessaging.DirectMessageChannel;

public interface DirectMessageChannelService {
    DirectMessageChannel createDirectMessageChannel(String members, String channelName);
}
