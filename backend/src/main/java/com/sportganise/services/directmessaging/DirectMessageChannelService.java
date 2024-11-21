package com.sportganise.services.directmessaging;

import com.sportganise.entities.directmessaging.DirectMessageChannel;
import com.sportganise.repositories.AccountRepository;
import com.sportganise.repositories.directmessaging.DirectMessageChannelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DirectMessageChannelService {
    private final DirectMessageChannelRepository directMessageChannelRepository;
    private final AccountRepository accountRepository;

    @Autowired
    public DirectMessageChannelService(DirectMessageChannelRepository directMessageChannelRepository, AccountRepository accountRepository) {
        this.directMessageChannelRepository = directMessageChannelRepository;
        this.accountRepository = accountRepository;
    }

    /**
     * Creates a new DM Channel and stores it in the Database.
     *
     * @param members     String of member ids, separated by a ',' (min. 2 members)
     * @param channelName Name of the message channel. Can be null.
     * @return DM Channel created.
     */
    public DirectMessageChannel createDirectMessageChannel(String members, String channelName) {
        // Set the Channel Name to be the first names of members in the channel if it is null or empty.
        if (channelName == null || channelName.isBlank()) {
            StringBuilder channelNameBuilder = createChannelNameFromMembers(members);
            channelName = channelNameBuilder.toString();
        }
        DirectMessageChannel dmChannel = new DirectMessageChannel();
        dmChannel.setName(channelName);

        DirectMessageChannel createdDmChannel = directMessageChannelRepository.save(dmChannel);

        // Create Channel Members


        return createdDmChannel;
    }

    /**
     * Formats the channel name to be the first names of all members in the channel if no name was given.
     *
     * @param members String of member ids, separated by a ','
     * @return Formatted string for the channel name composed of the name of the members
     */
    private StringBuilder createChannelNameFromMembers(String members) {
        String[] membersArray = members.split(",");
        Integer[] memberIds = new Integer[membersArray.length];
        for (int i = 0; i < memberIds.length; i++) {
            memberIds[i] = Integer.parseInt(membersArray[i]);
        }

        List<String> firstNames = this.accountRepository.findFirstNamesByAccountId(memberIds);

        StringBuilder channelNameBuilder = new StringBuilder();
        for (int i = 0; i < firstNames.size(); i++) {
            // Can't have channel name longer than 50 chars.
            if (channelNameBuilder.length() + firstNames.get(i).length() > 45) {
                channelNameBuilder.append(", ...");
                return channelNameBuilder;
            }
            channelNameBuilder.append(firstNames.get(i));
            if (i == membersArray.length - 2) {
                channelNameBuilder.append(" and "); // Appends ' and ' if it's the before last element of the list. Ex: "Max and James", not "Max, James"
            } else if (i < membersArray.length - 1) {
                channelNameBuilder.append(", ");
            }
        }
        return channelNameBuilder;
    }
}
