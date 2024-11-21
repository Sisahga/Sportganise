package com.sportganise.services.directmessaging;

import com.sportganise.entities.directmessaging.DirectMessageChannel;
import com.sportganise.repositories.directmessaging.DirectMessageChannelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DirectMessageChannelServiceImpl implements DirectMessageChannelService {
    private final DirectMessageChannelRepository directMessageChannelRepository;

    @Autowired
    public DirectMessageChannelServiceImpl(DirectMessageChannelRepository directMessageChannelRepository) {
        this.directMessageChannelRepository = directMessageChannelRepository;
    }

    /**
     * Creates a new DM Channel and stores it in the Database.
     *
     * @param members     String of member ids, separated by a ',' (min. 2 members)
     * @param channelName Name of the message channel. Can be null.
     * @return DM Channel created.
     */
    @Override
    public DirectMessageChannel createDirectMessageChannel(String members, String channelName) {
        // Set the Channel Name to be the first names of members in the channel if it is null or empty.
        if (channelName == null || channelName.isBlank()) {
            StringBuilder channelNameBuilder = createChannelNameFromMembers(members);
            channelName = channelNameBuilder.toString();
        }
        DirectMessageChannel dmChannel = new DirectMessageChannel();
        dmChannel.setName(channelName);
        return this.directMessageChannelRepository.save(dmChannel);
    }

    /**
     * Formats the channel name to be the first names of all members in the channel if no name was given.
     *
     * @param members String of member ids, separated by a ','
     * @return Formatted string for the channel name composed of the name of the members
     */
    private static StringBuilder createChannelNameFromMembers(String members) {
        StringBuilder channelNameBuilder = new StringBuilder();
        String[] membersArray = members.split(",");

        for (int i = 0; i < membersArray.length; i++) {
            channelNameBuilder.append(members.split(",")[i]);
            if (i == membersArray.length - 2) {
                channelNameBuilder.append(" and ");
            }
            else if (i < membersArray.length - 1) {
                channelNameBuilder.append(", ");
            }
        }
        return channelNameBuilder;
    }
}
